/*
  # Create Function to Get Vehicle Years

  This migration introduces a new function `get_years_for_vehicle` to dynamically fetch the available manufacturing years for a specific vehicle variant.

  1. New Function
    - `get_years_for_vehicle(p_make_id, p_model_id, p_variant_id)`
    - **Purpose**: To provide a list of valid years for the "Year" dropdown in the vehicle creation form.
    - **Logic**:
      1. It takes a make, model, and variant ID as input.
      2. It queries the `vehicle_main` table to find all associated `year_id`s for that specific vehicle configuration.
      3. It then uses these `year_id`s to query the `vehicle_years` table to get the `start_year` and `end_year` for each valid range.
      4. Finally, it uses `generate_series` to expand these ranges into a distinct, sorted list of individual years.

  2. Security
    - The function is defined with `SECURITY INVOKER` (the default), so it will run with the permissions of the calling user.
    - Access is granted to the `authenticated` role.
*/

CREATE OR REPLACE FUNCTION public.get_years_for_vehicle(
  p_make_id integer,
  p_model_id integer,
  p_variant_id integer
)
RETURNS SETOF integer
LANGUAGE sql
STABLE
AS $$
  WITH relevant_year_ids AS (
    SELECT DISTINCT year_id
    FROM public.vehicle_main
    WHERE make_id = p_make_id
      AND model_id = p_model_id
      AND variant_id = p_variant_id
      AND year_id IS NOT NULL
  )
  SELECT DISTINCT T.year
  FROM public.vehicle_years vy
  JOIN relevant_year_ids ryi ON vy.year_id = ryi.year_id
  CROSS JOIN LATERAL generate_series(vy.start_year, vy.end_year) AS T(year)
  WHERE vy.is_active = true
  ORDER BY T.year DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_years_for_vehicle(integer, integer, integer) TO authenticated;
