/*
  # Optimize Vehicle Form Variant Options Fetching

  This migration introduces a new PostgreSQL function to dramatically improve the performance of the vehicle creation/editing form.

  1. New Function
    - `get_form_variant_options(p_model_id integer, p_year integer)`: This function replaces an inefficient client-side process that involved multiple database queries. It accepts a model ID and year, and returns a single JSON object containing all unique, available vehicle attributes (body types, transmissions, etc.).

  2. Changes
    - The client-side logic for fetching vehicle variants and deriving options is now handled by this single, efficient database function.
    - This reduces multiple network round-trips to a single one, significantly speeding up the vehicle form's dependent dropdowns.
    - The function correctly formats the output (e.g., using `size` for engine sizes and `count` for doors) into a consistent `{id, name}` structure for the client.

  3. Security
    - The function is `STABLE` and `SECURITY INVOKER`.
    - Execute permission is granted to the `authenticated` role.
*/

CREATE OR REPLACE FUNCTION public.get_form_variant_options(p_model_id integer, p_year integer)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY INVOKER
AS $$
BEGIN
  RETURN (
    WITH relevant_variants AS (
      SELECT DISTINCT
        vvt.body_type_id,
        vvt.drivetrain_id,
        vvt.fuel_type_id,
        vvt.transmission_type_id,
        vvt.engine_size_id,
        vvt.aspiration_id,
        vvt.doors_id
      FROM public.vehicle_variants AS vvt
      WHERE vvt.model_id = p_model_id AND vvt.year = p_year
    )
    SELECT json_build_object(
      'body_types',         (SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) FROM public.vehicle_body_types t JOIN (SELECT DISTINCT body_type_id FROM relevant_variants WHERE body_type_id IS NOT NULL) ids ON t.id = ids.body_type_id),
      'drivetrains',        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) FROM public.vehicle_drivetrains t JOIN (SELECT DISTINCT drivetrain_id FROM relevant_variants WHERE drivetrain_id IS NOT NULL) ids ON t.id = ids.drivetrain_id),
      'fuel_types',         (SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) FROM public.vehicle_fuel_types t JOIN (SELECT DISTINCT fuel_type_id FROM relevant_variants WHERE fuel_type_id IS NOT NULL) ids ON t.id = ids.fuel_type_id),
      'transmission_types', (SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) FROM public.vehicle_transmission_types t JOIN (SELECT DISTINCT transmission_type_id FROM relevant_variants WHERE transmission_type_id IS NOT NULL) ids ON t.id = ids.transmission_type_id),
      'engine_sizes',       (SELECT json_agg(json_build_object('id', t.id, 'name', t.size)) FROM public.vehicle_engine_sizes t JOIN (SELECT DISTINCT engine_size_id FROM relevant_variants WHERE engine_size_id IS NOT NULL) ids ON t.id = ids.engine_size_id),
      'aspirations',        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) FROM public.vehicle_aspirations t JOIN (SELECT DISTINCT aspiration_id FROM relevant_variants WHERE aspiration_id IS NOT NULL) ids ON t.id = ids.aspiration_id),
      'doors',              (SELECT json_agg(json_build_object('id', t.id, 'name', t.count)) FROM public.vehicle_doors t JOIN (SELECT DISTINCT doors_id FROM relevant_variants WHERE doors_id IS NOT NULL) ids ON t.id = ids.doors_id)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_form_variant_options(integer, integer) TO authenticated;
