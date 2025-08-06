/*
  # Refactor search_vehicles for accuracy

  This migration refactors the `search_vehicles` function to improve the accuracy and reliability of the `total_count` field, especially when multiple complex filters are applied.

  1. **Problem**: The previous implementation used a window function (`COUNT(*) OVER()`) to calculate the total number of matching vehicles. The database's query planner can sometimes miscalculate this value when dealing with complex `WHERE` clauses, leading to incorrect total counts and pagination issues.

  2. **Solution**: The function is updated to use a multi-step Common Table Expression (CTE) approach. This forces a specific order of operations, guaranteeing an accurate count:
    - **`filtered_ids` CTE**: First, select only the `listing_id` of all vehicles that match the filter criteria. This is a lightweight operation.
    - **`total` CTE**: Second, perform a simple `COUNT(*)` on the `filtered_ids` CTE to get the definitive total number of matching records.
    - **`paginated_ids` CTE**: Third, paginate the `filtered_ids` to get only the IDs for the requested page.
    - **Final Query**: Finally, join the main `vehicle_listings_detailed` view against the `paginated_ids` and `CROSS JOIN` the `total` count.

  This approach explicitly separates the filtering, counting, and pagination logic, ensuring the `total_count` is always correct and pagination is reliable.
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
    WITH filtered_ids AS (
        SELECT
            vld.listing_id,
            vld.created_at -- Also select created_at for ordering before pagination
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
    total AS (
        SELECT count(*) as total_rows FROM filtered_ids
    ),
    paginated_ids AS (
        SELECT
            fi.listing_id
        FROM filtered_ids fi
        ORDER BY fi.created_at DESC
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
    ORDER BY vld.created_at DESC;
END;
$$;
