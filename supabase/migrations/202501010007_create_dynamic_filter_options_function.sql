/*
  # Create Dynamic Vehicle Filter Options Function
  This migration replaces the old, static `get_vehicle_filter_options` function with a new, dynamic version that calculates context-aware counts for each filter option.

  1.  **Problem**: The previous implementation showed incorrect counts in the filter modal (e.g., "Hatchback (15)") because it didn't consider other active filters.
  2.  **Solution**: This new function accepts the current set of active filters as parameters. It then calculates the available options and their respective counts for each category (makes, models, locations, etc.) based on the provided filter context.

  This ensures that if a user selects "Volkswagen", the count for "Hatchback" will accurately reflect the number of Volkswagen Hatchbacks available, not the total number of hatchbacks from all makes.
*/

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.get_vehicle_filter_options();

-- Create the new dynamic function
CREATE OR REPLACE FUNCTION public.get_vehicle_filter_options(
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
    p_max_mileage INT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql STABLE
AS $$
DECLARE
    result JSONB;
BEGIN
    WITH base_filters AS (
        SELECT
            vld.listing_id,
            vld.make,
            vld.model,
            vld.province AS location,
            vld.body_type,
            vld.transmission,
            vld.fuel_type,
            vld.drivetrain,
            vld.engine_size,
            vld.year,
            vld.price,
            vld.mileage
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
    make_counts AS (
        SELECT v.make AS name, count(*)
        FROM base_filters v
        WHERE (p_models IS NULL OR v.model = ANY(p_models))
          AND (p_locations IS NULL OR v.location = ANY(p_locations))
          AND (p_body_types IS NULL OR v.body_type = ANY(p_body_types))
          AND (p_transmissions IS NULL OR v.transmission = ANY(p_transmissions))
          AND (p_fuel_types IS NULL OR v.fuel_type = ANY(p_fuel_types))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.make
    ),
    model_counts AS (
        SELECT v.model AS name, count(*)
        FROM base_filters v
        WHERE (p_makes IS NULL OR v.make = ANY(p_makes))
          AND (p_locations IS NULL OR v.location = ANY(p_locations))
          AND (p_body_types IS NULL OR v.body_type = ANY(p_body_types))
          AND (p_transmissions IS NULL OR v.transmission = ANY(p_transmissions))
          AND (p_fuel_types IS NULL OR v.fuel_type = ANY(p_fuel_types))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.model
    ),
    location_counts AS (
        SELECT v.location AS name, count(*)
        FROM base_filters v
        WHERE (p_makes IS NULL OR v.make = ANY(p_makes))
          AND (p_models IS NULL OR v.model = ANY(p_models))
          AND (p_body_types IS NULL OR v.body_type = ANY(p_body_types))
          AND (p_transmissions IS NULL OR v.transmission = ANY(p_transmissions))
          AND (p_fuel_types IS NULL OR v.fuel_type = ANY(p_fuel_types))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.location
    ),
    body_type_counts AS (
        SELECT v.body_type AS name, count(*)
        FROM base_filters v
        WHERE (p_makes IS NULL OR v.make = ANY(p_makes))
          AND (p_models IS NULL OR v.model = ANY(p_models))
          AND (p_locations IS NULL OR v.location = ANY(p_locations))
          AND (p_transmissions IS NULL OR v.transmission = ANY(p_transmissions))
          AND (p_fuel_types IS NULL OR v.fuel_type = ANY(p_fuel_types))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.body_type
    ),
    transmission_counts AS (
        SELECT v.transmission AS name, count(*)
        FROM base_filters v
        WHERE (p_makes IS NULL OR v.make = ANY(p_makes))
          AND (p_models IS NULL OR v.model = ANY(p_models))
          AND (p_locations IS NULL OR v.location = ANY(p_locations))
          AND (p_body_types IS NULL OR v.body_type = ANY(p_body_types))
          AND (p_fuel_types IS NULL OR v.fuel_type = ANY(p_fuel_types))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.transmission
    ),
    fuel_type_counts AS (
        SELECT v.fuel_type AS name, count(*)
        FROM base_filters v
        WHERE (p_makes IS NULL OR v.make = ANY(p_makes))
          AND (p_models IS NULL OR v.model = ANY(p_models))
          AND (p_locations IS NULL OR v.location = ANY(p_locations))
          AND (p_body_types IS NULL OR v.body_type = ANY(p_body_types))
          AND (p_transmissions IS NULL OR v.transmission = ANY(p_transmissions))
          AND (p_drivetrains IS NULL OR v.drivetrain = ANY(p_drivetrains))
          AND (p_engine_sizes IS NULL OR v.engine_size = ANY(p_engine_sizes))
        GROUP BY v.fuel_type
    )
    SELECT jsonb_build_object(
        'makes', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM make_counts WHERE name IS NOT NULL),
        'models', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM model_counts WHERE name IS NOT NULL),
        'locations', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM location_counts WHERE name IS NOT NULL),
        'body_types', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM body_type_counts WHERE name IS NOT NULL),
        'transmissions', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM transmission_counts WHERE name IS NOT NULL),
        'fuel_types', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count)), '[]'::jsonb) FROM fuel_type_counts WHERE name IS NOT NULL)
    )
    INTO result;

    RETURN result;
END;
$$;
