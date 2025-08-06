/*
      # Update search_listings to use numeric IDs

      This migration refactors the primary vehicle search function, `search_listings`, to align with front-end changes that use numeric IDs for filtering instead of text-based names. This improves performance and data integrity.

      1.  **Function Renamed and Replaced**: The function is now consistently named `search_listings`.
      2.  **Parameter Updates**:
          -   Parameters like `p_makes` (TEXT[]) are replaced with `p_make_ids` (INT[]).
          -   This change applies to makes, models, locations, body types, transmissions, fuel types, and drivetrains.
      3.  **Filtering Logic**:
          -   The `WHERE` clause is updated to filter against corresponding ID columns in the `vehicle_listings_detailed` view (e.g., `make_id`, `model_id`).
      4.  **Dynamic Sorting**:
          -   A `p_sort_by` parameter is introduced to allow sorting by creation date, price, and mileage.
      5.  **Correct Pagination**:
          -   The function now correctly uses `p_page_number` and `p_page_size` for pagination logic.
    */

    CREATE OR REPLACE FUNCTION public.search_listings(
        p_search_term TEXT DEFAULT NULL,
        p_make_ids INT[] DEFAULT NULL,
        p_model_ids INT[] DEFAULT NULL,
        p_location_ids INT[] DEFAULT NULL,
        p_body_type_ids INT[] DEFAULT NULL,
        p_transmission_ids INT[] DEFAULT NULL,
        p_fuel_type_ids INT[] DEFAULT NULL,
        p_drivetrain_ids INT[] DEFAULT NULL,
        p_engine_sizes TEXT[] DEFAULT NULL,
        p_features TEXT[] DEFAULT NULL,
        p_min_year INT DEFAULT NULL,
        p_max_year INT DEFAULT NULL,
        p_min_price INT DEFAULT NULL,
        p_max_price INT DEFAULT NULL,
        p_min_mileage INT DEFAULT NULL,
        p_max_mileage INT DEFAULT NULL,
        p_sort_by TEXT DEFAULT 'created_at_desc',
        p_page_number INT DEFAULT 1,
        p_page_size INT DEFAULT 10
    )
    RETURNS TABLE (
        listing_id INT,
        created_at TIMESTAMPTZ,
        price INT,
        mileage INT,
        images TEXT[],
        make TEXT,
        model TEXT,
        variant TEXT,
        year INT,
        province TEXT,
        transmission TEXT,
        fuel_type TEXT,
        total_count BIGINT
    )
    LANGUAGE plpgsql STABLE
    AS $$
    BEGIN
        RETURN QUERY
        WITH filtered_ids AS (
            SELECT
                vld.listing_id,
                vld.created_at,
                vld.price,
                vld.mileage
            FROM public.vehicle_listings_detailed AS vld
            WHERE
                vld.is_sold = false
                AND (p_search_term IS NULL OR (vld.make ILIKE ('%' || p_search_term || '%') OR vld.model ILIKE ('%' || p_search_term || '%') OR vld.variant ILIKE ('%' || p_search_term || '%')))
                AND (p_make_ids IS NULL OR vld.make_id = ANY(p_make_ids))
                AND (p_model_ids IS NULL OR vld.model_id = ANY(p_model_ids))
                AND (p_location_ids IS NULL OR vld.location_id = ANY(p_location_ids))
                AND (p_body_type_ids IS NULL OR vld.body_type_id = ANY(p_body_type_ids))
                AND (p_transmission_ids IS NULL OR vld.transmission_id = ANY(p_transmission_ids))
                AND (p_fuel_type_ids IS NULL OR vld.fuel_type_id = ANY(p_fuel_type_ids))
                AND (p_drivetrain_ids IS NULL OR vld.drivetrain_id = ANY(p_drivetrain_ids))
                AND (p_engine_sizes IS NULL OR vld.engine_size = ANY(p_engine_sizes))
                AND (p_min_year IS NULL OR vld.year >= p_min_year)
                AND (p_max_year IS NULL OR vld.year <= p_max_year)
                AND (p_min_price IS NULL OR vld.price >= p_min_price)
                AND (p_max_price IS NULL OR vld.price <= p_max_price)
                AND (p_min_mileage IS NULL OR vld.mileage >= p_min_mileage)
                AND (p_max_mileage IS NULL OR vld.mileage <= p_max_mileage)
                AND (
                    p_features IS NULL OR
                    EXISTS (
                        SELECT 1
                        FROM public.vehicle_listing_features vlf
                        JOIN public.vehicle_features vf ON vlf.feature_id = vf.feature_id
                        WHERE vlf.listing_id = vld.listing_id AND vf.feature_name = ANY(p_features)
                    )
                )
        ),
        total AS (
            SELECT count(*) as total_rows FROM filtered_ids
        ),
        paginated_ids AS (
            SELECT
                fi.listing_id
            FROM filtered_ids fi
            ORDER BY
                CASE WHEN p_sort_by = 'created_at_desc' THEN fi.created_at END DESC,
                CASE WHEN p_sort_by = 'created_at_asc' THEN fi.created_at END ASC,
                CASE WHEN p_sort_by = 'price_desc' THEN fi.price END DESC,
                CASE WHEN p_sort_by = 'price_asc' THEN fi.price END ASC,
                CASE WHEN p_sort_by = 'mileage_desc' THEN fi.mileage END DESC,
                CASE WHEN p_sort_by = 'mileage_asc' THEN fi.mileage END ASC,
                fi.created_at DESC -- Default sort
            LIMIT p_page_size
            OFFSET (p_page_number - 1) * p_page_size
        )
        SELECT
            vld.listing_id,
            vld.created_at,
            vld.price::INT,
            vld.mileage,
            vld.images,
            vld.make,
            vld.model,
            vld.variant,
            vld.year,
            vld.province,
            vld.transmission,
            vld.fuel_type,
            total.total_rows AS total_count
        FROM public.vehicle_listings_detailed AS vld
        JOIN paginated_ids pi ON vld.listing_id = pi.listing_id
        CROSS JOIN total
        ORDER BY
            CASE WHEN p_sort_by = 'created_at_desc' THEN vld.created_at END DESC,
            CASE WHEN p_sort_by = 'created_at_asc' THEN vld.created_at END ASC,
            CASE WHEN p_sort_by = 'price_desc' THEN vld.price END DESC,
            CASE WHEN p_sort_by = 'price_asc' THEN vld.price END ASC,
            CASE WHEN p_sort_by = 'mileage_desc' THEN vld.mileage END DESC,
            CASE WHEN p_sort_by = 'mileage_asc' THEN vld.mileage END ASC,
            vld.created_at DESC; -- Default sort
    END;
    $$;
