/*
  # Restore Year Range Logic in Variant Options Function

  This migration updates the `get_vehicle_variant_options_by_variant_id` function to use the newly added `start_year` and `end_year` columns and conform to the corrected database schema.

  1. Context
    - A previous migration (`workaround_missing_year_columns_in_variants.sql`) temporarily removed the year range logic to prevent errors.
    - With the `start_year` and `end_year` columns now added, this functionality can be restored.

  2. Changes
    - The function now correctly queries the `start_year` and `end_year` from the `vehicle_variants` record.
    - It builds and returns a `year_range` JSON object.
    - It has been updated to query the correct column names for all lookup tables (e.g., `body_type_id`, `body_type`) to match the actual database schema, fixing multiple potential bugs.
*/

CREATE OR REPLACE FUNCTION public.get_vehicle_variant_options_by_variant_id(p_variant_id integer)
RETURNS json
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_variant_record record;
  v_result json;
BEGIN
  -- Get the variant details, including the arrays of IDs
  SELECT * INTO v_variant_record
  FROM public.vehicle_variants
  WHERE variant_id = p_variant_id;

  -- If no variant found, return null
  IF NOT FOUND THEN
    RETURN null;
  END IF;

  -- Build the JSON response by querying each related specification table
  SELECT json_build_object(
    'year_range', json_build_object('start_year', v_variant_record.start_year, 'end_year', v_variant_record.end_year),
    'body_types', (
      SELECT json_agg(json_build_object('id', vbt.body_type_id, 'name', vbt.body_type))
      FROM public.vehicle_body_types vbt
      WHERE vbt.body_type_id = ANY(v_variant_record.body_type_ids) AND vbt.is_active = true
    ),
    'transmissions', (
      SELECT json_agg(json_build_object('id', vtt.transmission_type_id, 'name', vtt.transmission))
      FROM public.vehicle_transmission_types vtt
      WHERE vtt.transmission_type_id = ANY(v_variant_record.transmission_type_ids) AND vtt.is_active = true
    ),
    'fuel_types', (
      SELECT json_agg(json_build_object('id', vft.fuel_type_id, 'name', vft.fuel_type))
      FROM public.vehicle_fuel_types vft
      WHERE vft.fuel_type_id = ANY(v_variant_record.fuel_type_ids) AND vft.is_active = true
    ),
    'drivetrains', (
      SELECT json_agg(json_build_object('id', vdt.drivetrain_id, 'name', vdt.drivetrain))
      FROM public.vehicle_drivetrains vdt
      WHERE vdt.drivetrain_id = ANY(v_variant_record.drivetrain_ids) AND vdt.is_active = true
    ),
    'engine_sizes', (
      SELECT json_agg(json_build_object('id', ves.engine_size_id, 'name', ves.engine_size))
      FROM public.vehicle_engine_sizes ves
      WHERE ves.engine_size_id = ANY(v_variant_record.engine_size_ids) AND ves.is_active = true
    ),
    'aspirations', (
      SELECT json_agg(json_build_object('id', vea.aspiration_id, 'name', vea.aspiration))
      FROM public.vehicle_engine_aspirations vea
      WHERE vea.aspiration_id = ANY(v_variant_record.aspiration_ids) AND vea.is_active = true
    ),
    'doors', (
      SELECT json_agg(json_build_object('id', vd.door_id, 'name', vd.doors))
      FROM public.vehicle_doors vd
      WHERE vd.door_id = ANY(v_variant_record.door_ids) AND vd.is_active = true
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;
