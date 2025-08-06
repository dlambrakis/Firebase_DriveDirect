/*
  # Fix Vehicle Variant Options Function (Temporary Workaround)

  This migration updates the `get_vehicle_variant_options_by_variant_id` function to work around a schema mismatch.

  1. Problem
    - The function was failing with the error `record "v_variant_record" has no field "start_year"`.
    - This indicates that the `vehicle_variants` table in the database does not have the `start_year` and `end_year` columns as expected by the application code and Prisma schema.

  2. Temporary Workaround
    - To unblock development and test the rest of the function, the logic for building the `year_range` object has been temporarily removed.
    - The function will now return `null` for the `year_range` key, preventing the error.

  3. Next Steps
    - This is not a permanent fix. The frontend will not be able to display the year selection dropdown.
    - The underlying schema discrepancy for the `vehicle_variants` table (specifically the missing year columns) needs to be investigated and resolved by creating a new migration to add the missing columns.
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
  -- NOTE: year_range is temporarily nulled out due to a schema mismatch.
  -- The 'start_year' and 'end_year' columns do not exist on the 'vehicle_variants' table.
  SELECT json_build_object(
    'year_range', null,
    'body_types', (
      SELECT json_agg(json_build_object('id', vbt.id, 'name', vbt.name))
      FROM public.vehicle_body_types vbt
      WHERE vbt.id = ANY(v_variant_record.body_type_ids) AND vbt.is_active = true
    ),
    'transmissions', (
      SELECT json_agg(json_build_object('id', vtt.id, 'name', vtt.name))
      FROM public.vehicle_transmission_types vtt
      WHERE vtt.id = ANY(v_variant_record.transmission_type_ids) AND vtt.is_active = true
    ),
    'fuel_types', (
      SELECT json_agg(json_build_object('id', vft.id, 'name', vft.name))
      FROM public.vehicle_fuel_types vft
      WHERE vft.id = ANY(v_variant_record.fuel_type_ids) AND vft.is_active = true
    ),
    'drivetrains', (
      SELECT json_agg(json_build_object('id', vdt.id, 'name', vdt.name))
      FROM public.vehicle_drivetrains vdt
      WHERE vdt.id = ANY(v_variant_record.drivetrain_ids) AND vdt.is_active = true
    ),
    'engine_sizes', (
      SELECT json_agg(json_build_object('id', ves.id, 'name', ves.name))
      FROM public.vehicle_engine_sizes ves
      WHERE ves.id = ANY(v_variant_record.engine_size_ids) AND ves.is_active = true
    ),
    'aspirations', (
      SELECT json_agg(json_build_object('id', vea.id, 'name', vea.name))
      FROM public.vehicle_engine_aspirations vea
      WHERE vea.id = ANY(v_variant_record.aspiration_ids) AND vea.is_active = true
    ),
    'doors', (
      SELECT json_agg(json_build_object('id', vd.id, 'name', vd.name))
      FROM public.vehicle_doors vd
      WHERE vd.id = ANY(v_variant_record.door_ids) AND vd.is_active = true
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;
