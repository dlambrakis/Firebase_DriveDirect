/*
      # Create Function to Get All Vehicle Years

      This migration introduces a new function `get_all_vehicle_years` to fetch all available manufacturing years from the database, independent of make, model, or variant. This supports the requirement to show the "Year" dropdown on the vehicle creation form from the initial load.

      1. New Function
        - `get_all_vehicle_years()`
        - **Purpose**: To provide a complete list of years for the "Year" dropdown in the vehicle creation form, allowing it to be displayed on initial load.
        - **Logic**:
          1. It queries the `vehicle_years` table to get the `start_year` and `end_year` for all active year ranges.
          2. It uses `generate_series` to expand these ranges into a distinct, sorted list of individual years.

      2. Security
        - The function is defined with `SECURITY INVOKER`.
        - Access is granted to the `authenticated` role.
    */

    CREATE OR REPLACE FUNCTION public.get_all_vehicle_years()
    RETURNS SETOF integer
    LANGUAGE sql
    STABLE
    AS $$
      SELECT DISTINCT T.year
      FROM public.vehicle_years vy
      CROSS JOIN LATERAL generate_series(vy.start_year, vy.end_year) AS T(year)
      WHERE vy.is_active = true
      ORDER BY T.year DESC;
    $$;

    GRANT EXECUTE ON FUNCTION public.get_all_vehicle_years() TO authenticated;
