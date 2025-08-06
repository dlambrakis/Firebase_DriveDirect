/*
  # Fix search_vehicles RPC function
  This migration fixes the `search_vehicles` function to resolve the 'ambiguous column' error and align its behavior with the frontend's expectations for filtering and pagination.

  1.  **Resolve Ambiguity**: Explicitly qualifies column names with table aliases (e.g., `vld.listing_id`) to prevent ambiguity, especially when filtering by features which requires joining related tables.
  2.  **Correct Filtering**: Implements robust filtering for all specified criteria. Uses an `EXISTS` subquery for feature-based filtering, which is efficient and avoids issues with duplicate rows.
  3.  **Accurate Pagination**: Uses a Common Table Expression (CTE) to first identify all matching listing IDs, then calculates the total count based on that set, and finally applies pagination. This ensures the `total_count` is accurate for the entire filtered result set, not just the current page.
  4.  **Return Type**: The function returns a table with a `total_count` column on each row, matching the data structure expected by the `useVehicleSearch` hook.
*/
CREATE OR REPLACE FUNCTION public.search_vehicles(
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
    WITH filtered_listing_ids AS (
        SELECT vld.listing_id
        FROM public.vehicle_listings_detailed AS vld
        WHERE
            vld.is_sold = false
            AND (p_search_term IS NULL OR (vld.make ILIKE ('%' || p_search_term || '%') OR vld.model ILIKE ('%' || p_search_term || '%') OR vld.variant ILIKE ('%' || p_search_term || '%')))
            AND (p_makes IS NULL OR vld.make = ANY(p_makes))
            AND (p_models IS NULL OR vld.model = ANY(p_models))
            AND (p_locations IS NULL OR vld.province = ANY(p_locations))
            AND (p_body_types IS NULL OR vld.body_type = ANY(p_body_types))
            AND (p_transmissions IS NULL OR vld.transmission = ANY(p_transmissions))
            AND (p_fuel_types IS NULL OR vld.fuel_type = ANY(p_fuel_types))
            AND (p_drivetrains IS NULL OR vld.drivetrain = ANY(p_drivetrains))
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
    paginated_listings AS (
        SELECT
            vld.listing_id,
            vld.created_at,
            vld.price,
            vld.mileage,
            vld.images,
            vld.make,
            vld.model,
            vld.variant,
            vld.year,
            vld.province,
            vld.transmission,
            vld.fuel_type,
            (SELECT count(*) FROM filtered_listing_ids) AS total_count
        FROM public.vehicle_listings_detailed vld
        WHERE vld.listing_id IN (SELECT listing_id FROM filtered_listing_ids)
        ORDER BY vld.created_at DESC
        LIMIT p_page_size
        OFFSET (p_page_number - 1) * p_page_size
    )
    SELECT * FROM paginated_listings;
END;
$$;
