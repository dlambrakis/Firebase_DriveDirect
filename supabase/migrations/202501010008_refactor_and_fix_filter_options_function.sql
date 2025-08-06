/*
  # Refactor Dynamic Filter Options Function for Maintainability &amp; Correctness
  This migration refactors the `get_vehicle_filter_options` function to improve its readability and maintainability, and fixes a bug where some filter options were not being returned.

  1.  **Problem (Maintainability)**: The previous implementation contained multiple, nearly identical subqueries to calculate counts for each filter category (makes, models, etc.). Each subquery repeated a large, complex `WHERE` clause, making the function difficult to read and maintain.
  2.  **Problem (Bug)**: The previous function accepted parameters for `drivetrains` and `engine_sizes` and even calculated their counts, but failed to include them in the final JSON output.
  3.  **Solution**: This new version uses a single Common Table Expression (CTE) named `listings_with_match_flags`.
      - It first applies the base filters (search term, price, year, etc.).
      - It then calculates a boolean flag for each filterable dimension (e.g., `matches_make`, `matches_model`, `matches_drivetrain`).
      - The final `SELECT` statement builds the JSON object by aggregating results from this CTE, using the boolean flags to apply the correct context for each count. For example, to count makes, it filters `WHERE matches_model AND matches_location AND ...`.
      - The final JSON object now correctly includes `drivetrains` and `engine_sizes`.

  This approach centralizes the filtering logic, eliminates redundant code, makes the function's intent clearer, and fixes the missing data bug.
*/

-- Drop the old function to replace it
DROP FUNCTION IF EXISTS public.get_vehicle_filter_options(
    TEXT, TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], INT, INT, INT, INT, INT, INT
);

-- Create the new, refactored, and corrected function
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
    WITH listings_with_match_flags AS (
        SELECT
            vld.make,
            vld.model,
            vld.province AS location,
            vld.body_type,
            vld.transmission,
            vld.fuel_type,
            vld.drivetrain,
            vld.engine_size,
            -- Boolean flags for each filterable dimension
            (p_makes IS NULL OR vld.make = ANY(p_makes)) as matches_make,
            (p_models IS NULL OR vld.model = ANY(p_models)) as matches_model,
            (p_locations IS NULL OR vld.province = ANY(p_locations)) as matches_location,
            (p_body_types IS NULL OR vld.body_type = ANY(p_body_types)) as matches_body_type,
            (p_transmissions IS NULL OR vld.transmission = ANY(p_transmissions)) as matches_transmission,
            (p_fuel_types IS NULL OR vld.fuel_type = ANY(p_fuel_types)) as matches_fuel_type,
            (p_drivetrains IS NULL OR vld.drivetrain = ANY(p_drivetrains)) as matches_drivetrain,
            (p_engine_sizes IS NULL OR vld.engine_size = ANY(p_engine_sizes)) as matches_engine_size
        FROM public.vehicle_listings_detailed AS vld
        WHERE
            vld.is_sold = false
            -- Base filters that are always applied
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
    )
    SELECT jsonb_build_object(
        'makes', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT make AS name, count(*) FROM listings_with_match_flags
                WHERE matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size
                GROUP BY make HAVING make IS NOT NULL
            ) q
        ),
        'models', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT model AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size
                GROUP BY model HAVING model IS NOT NULL
            ) q
        ),
        'locations', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT location AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size
                GROUP BY location HAVING location IS NOT NULL
            ) q
        ),
        'body_types', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT body_type AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_location AND matches_transmission AND matches_fuel_type AND matches_drivetrain AND matches_engine_size
                GROUP BY body_type HAVING body_type IS NOT NULL
            ) q
        ),
        'transmissions', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT transmission AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_fuel_type AND matches_drivetrain AND matches_engine_size
                GROUP BY transmission HAVING transmission IS NOT NULL
            ) q
        ),
        'fuel_types', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT fuel_type AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_drivetrain AND matches_engine_size
                GROUP BY fuel_type HAVING fuel_type IS NOT NULL
            ) q
        ),
        'drivetrains', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT drivetrain AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_engine_size
                GROUP BY drivetrain HAVING drivetrain IS NOT NULL
            ) q
        ),
        'engine_sizes', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC, name ASC), '[]'::jsonb)
            FROM (
                SELECT engine_size AS name, count(*) FROM listings_with_match_flags
                WHERE matches_make AND matches_model AND matches_location AND matches_body_type AND matches_transmission AND matches_fuel_type AND matches_drivetrain
                GROUP BY engine_size HAVING engine_size IS NOT NULL
            ) q
        )
    )
    INTO result;

    RETURN result;
END;
$$;
