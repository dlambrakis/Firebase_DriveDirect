/*
      # Consolidate Search and Filter Functions

      This migration introduces a single, optimized RPC function `search_and_filter_vehicles` to handle all aspects of vehicle searching and filtering. It replaces the previous two-function system (`search_vehicles` and `get_vehicle_filter_options`), which caused redundant database queries and increased client-side complexity.

      1.  **Problem**: The client had to make two separate API calls for a search: one to get vehicle results and another to get filter options (facets). This was inefficient and could lead to inconsistencies.

      2.  **Solution**: This new function, `search_and_filter_vehicles`, performs all necessary work in a single database transaction. It returns a unified JSON object containing the paginated vehicle results, the total result count, and a complete set of dynamically calculated filter options.

      3.  **Key Improvements**:
          - **Performance**: Reduces database load by running the core filtering logic only once.
          - **Efficiency**: Halves the number of network requests required for a search.
          - **Consistency**: Guarantees that search results and filter options are always perfectly in sync.
          - **Maintainability**: Consolidates related logic into a single, easier-to-manage function.

      4.  **Dropped Functions**:
          - `public.search_vehicles`
          - `public.get_vehicle_filter_options`

      5.  **New Function**:
          - `public.search_and_filter_vehicles`: Takes all filter and pagination parameters and returns a comprehensive JSONB object.
    */

    -- Drop the old, separate functions
    DROP FUNCTION IF EXISTS public.search_vehicles(
        TEXT, TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], INT, INT, INT, INT, INT, INT, INT, INT
    );

    DROP FUNCTION IF EXISTS public.get_vehicle_filter_options(
        TEXT, TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], INT, INT, INT, INT, INT, INT
    );

    -- Create the new, consolidated function
    CREATE OR REPLACE FUNCTION public.search_and_filter_vehicles(
        p_search_term TEXT DEFAULT NULL,
        p_makes TEXT[] DEFAULT NULL,
        p_models TEXT[] DEFAULT NULL,
        p_locations TEXT[] DEFAULT NULL,
        p_body_types TEXT[] DEFAULT NULL,
        p_transmissions TEXT[] DEFAULT NULL,
        p_fuel_types TEXT[] DEFAULT NULL,
        p_drivetrains TEXT[] DEFAULT NULL,
        p_engine_sizes TEXT[] DEFAULT NULL,
        p_features TEXT[] DEFAULT NULL,
        p_min_year INT DEFAULT NULL,
        p_max_year INT DEFAULT NULL,
        p_min_price INT DEFAULT NULL,
        p_max_price INT DEFAULT NULL,
        p_min_mileage INT DEFAULT NULL,
        p_max_mileage INT DEFAULT NULL,
        p_page_number INT DEFAULT 1,
        p_page_size INT DEFAULT 12
    )
    RETURNS JSONB
    LANGUAGE plpgsql STABLE
    AS $$
    DECLARE
        result JSONB;
    BEGIN
        WITH filtered_listings AS (
            SELECT
                vld.*,
                (p_makes IS NULL OR vld.make = ANY(p_makes)) as matches_make,
                (p_models IS NULL OR vld.model = ANY(p_models)) as matches_model,
                (p_locations IS NULL OR vld.province = ANY(p_locations)) as matches_location,
                (p_body_types IS NULL OR vld.body_type = ANY(p_body_types)) as matches_body_type,
                (p_transmissions IS NULL OR vld.transmission = ANY(p_transmissions)) as matches_transmission,
                (p_fuel_types IS NULL OR vld.fuel_type = ANY(p_fuel_types)) as matches_fuel_type,
                (p_drivetrains IS NULL OR vld.drivetrain = ANY(p_drivetrains)) as matches_drivetrain,
                (p_engine_sizes IS NULL OR vld.engine_size = ANY(p_engine_sizes)) as matches_engine_size,
                (p_features IS NULL OR EXISTS (
                    SELECT 1 FROM public.vehicle_listing_features vlf
                    JOIN public.vehicle_features vf ON vlf.feature_id = vf.feature_id
                    WHERE vlf.listing_id = vld.listing_id AND vf.feature_name = ANY(p_features)
                )) as matches_features
            FROM public.vehicle_listings_detailed AS vld
            WHERE
                vld.is_sold = false
                AND (p_search_term IS NULL OR (vld.make ILIKE ('%' || p_search_term || '%') OR vld.model ILIKE ('%' || p_search_term || '%') OR vld.variant ILIKE ('%' || p_search_term || '%')))
                AND (p_min_year IS NULL OR vld.year >= p_min_year)
                AND (p_max_year IS NULL OR vld.year <= p_max_year)
                AND (p_min_price IS NULL OR vld.price >= p_min_price)
                AND (p_max_price IS NULL OR vld.price <= p_max_price)
                AND (p_min_mileage IS NULL OR vld.mileage >= p_min_mileage)
                AND (p_max_mileage IS NULL OR vld.mileage <= p_max_mileage)
        ),
        -- This CTE applies all filters to get the base result set for facets
        fully_filtered AS (
            SELECT * FROM filtered_listings
            WHERE matches_make AND matches_model AND matches_location AND matches_body_type
              AND matches_transmission AND matches_fuel_type AND matches_drivetrain
              AND matches_engine_size AND matches_features
        ),
        -- Paginated results for the current page view
        paginated_results AS (
            SELECT *
            FROM fully_filtered
            ORDER BY created_at DESC
            LIMIT p_page_size
            OFFSET (p_page_number - 1) * p_page_size
        )
        SELECT jsonb_build_object(
            'count', (SELECT count(*) FROM fully_filtered),
            'data', (SELECT COALESCE(jsonb_agg(paginated_results), '[]'::jsonb) FROM paginated_results),
            'filterOptions', jsonb_build_object(
                'makes',        (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT make AS name, count(*) FROM filtered_listings WHERE matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY make HAVING make IS NOT NULL) q),
                'models',       (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT model AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY model HAVING model IS NOT NULL) q),
                'locations',    (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT province AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY province HAVING province IS NOT NULL) q),
                'body_types',   (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT body_type AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_location AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY body_type HAVING body_type IS NOT NULL) q),
                'transmissions',(SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT transmission AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_fuel_type AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY transmission HAVING transmission IS NOT NULL) q),
                'fuel_types',   (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT fuel_type AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_drivetrain AND matches_engine_size AND matches_features GROUP BY fuel_type HAVING fuel_type IS NOT NULL) q),
                'drivetrains',  (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT drivetrain AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_engine_size AND matches_features GROUP BY drivetrain HAVING drivetrain IS NOT NULL) q),
                'engine_sizes', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb) FROM (SELECT engine_size AS name, count(*) FROM filtered_listings WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_features GROUP BY engine_size HAVING engine_size IS NOT NULL) q),
                'features',     (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', feature_name, 'count', count) ORDER BY count DESC, feature_name ASC), '[]'::jsonb) FROM (SELECT vf.feature_name, count(DISTINCT l.listing_id) FROM filtered_listings l JOIN public.vehicle_listing_features vlf ON l.listing_id = vlf.listing_id JOIN public.vehicle_features vf ON vlf.feature_id = vf.feature_id WHERE l.matches_make AND l.matches_model AND l.matches_location AND l.matches_body_type AND l.matches_transmission AND l.matches_fuel_type AND l.matches_drivetrain AND l.matches_engine_size GROUP BY vf.feature_name) q),
                'prices',       (SELECT jsonb_build_object('min', COALESCE(min(price), 0), 'max', COALESCE(max(price), 0)) FROM fully_filtered),
                'years',        (SELECT jsonb_build_object('min', COALESCE(min(year), 0), 'max', COALESCE(max(year), 0)) FROM fully_filtered),
                'mileages',     (SELECT jsonb_build_object('min', COALESCE(min(mileage), 0), 'max', COALESCE(max(mileage), 0)) FROM fully_filtered)
            )
        )
        INTO result;

        RETURN result;
    END;
    $$;
