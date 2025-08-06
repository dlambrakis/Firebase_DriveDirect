/*
  # Fix incorrect total count in vehicle search
  This migration refactors the `search_vehicles` function to ensure the `total_count` accurately reflects the number of vehicles matching the applied filters.

  1.  **Problem**: The previous implementation used a separate CTE and a subquery to calculate the total count, which led to a logical error where the count did not respect all applied filters, resulting in an inflated number.
  2.  **Solution**: The function is updated to use a window function `COUNT(*) OVER()`. This calculates the total number of matching rows over the entire filtered set *before* pagination is applied. This count is then attached to each row in the result, guaranteeing that the data and the total count are always synchronized and accurate. This approach is also more performant.
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
    WITH filtered_listings AS (
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
            COUNT(*) OVER() AS total_count
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
    )
    SELECT
        fl.listing_id,
        fl.created_at,
        fl.price::INT,
        fl.mileage,
        fl.images,
        fl.make,
        fl.model,
        fl.variant,
        fl.year,
        fl.province,
        fl.transmission,
        fl.fuel_type,
        fl.total_count
    FROM filtered_listings AS fl
    ORDER BY fl.created_at DESC
    LIMIT p_page_size
    OFFSET (p_page_number - 1) * p_page_size;
END;
$$;
