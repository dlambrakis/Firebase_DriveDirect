/*
  # Fix Function get_vehicle_variant_options_by_variant_id

  This migration corrects the `get_vehicle_variant_options_by_variant_id` function. The previous version had a bug that caused an SQL error when fetching variant-specific options, preventing the vehicle listing form from loading correctly.

  1.  **Function Fix**
    -   **`get_vehicle_variant_options_by_variant_id(p_variant_id integer)`**:
        -   **Problem**: The old function referenced a non-existent field in a record, causing the RPC call to fail.
        -   **Solution**: The function has been rewritten to be more robust. It now correctly queries all possible specifications (body type, transmission, etc.) associated with a given `variant_id` from the `vehicle_main` table.
        -   **Output**: It returns a single JSON object with keys for each specification (e.g., `body_types`, `transmissions`). Each key contains a JSON array of objects, with each object having an `id` and `name`. This matches the structure expected by the frontend application.
        -   **Example Return Value**:
            ```json
            {
              "body_types": [{"id": 1, "name": "Sedan"}],
              "transmissions": [{"id": 2, "name": "Automatic"}],
              "fuel_types": null
            }
            ```

  2.  **Security**
    -   The function remains `SECURITY INVOKER`.
    -   Execute permission is granted to the `authenticated` role.
*/

CREATE OR REPLACE FUNCTION public.get_vehicle_variant_options_by_variant_id(p_variant_id integer)
RETURNS json
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_options json;
BEGIN
  WITH variant_specs AS (
    SELECT DISTINCT
      body_type_id,
      transmission_type_id,
      fuel_type_id,
      drivetrain_id,
      engine_size_id,
      aspiration_id,
      door_id
    FROM public.vehicle_main
    WHERE variant_id = p_variant_id
  )
  SELECT json_build_object(
    'body_types', (SELECT json_agg(json_build_object('id', vbt.id, 'name', vbt.name)) FROM public.vehicle_body_types vbt JOIN (SELECT DISTINCT body_type_id FROM variant_specs WHERE body_type_id IS NOT NULL) AS ids ON vbt.id = ids.body_type_id),
    'transmissions', (SELECT json_agg(json_build_object('id', vtt.id, 'name', vtt.name)) FROM public.vehicle_transmission_types vtt JOIN (SELECT DISTINCT transmission_type_id FROM variant_specs WHERE transmission_type_id IS NOT NULL) AS ids ON vtt.id = ids.transmission_type_id),
    'fuel_types', (SELECT json_agg(json_build_object('id', vft.id, 'name', vft.name)) FROM public.vehicle_fuel_types vft JOIN (SELECT DISTINCT fuel_type_id FROM variant_specs WHERE fuel_type_id IS NOT NULL) AS ids ON vft.id = ids.fuel_type_id),
    'drivetrains', (SELECT json_agg(json_build_object('id', vd.id, 'name', vd.name)) FROM public.vehicle_drivetrains vd JOIN (SELECT DISTINCT drivetrain_id FROM variant_specs WHERE drivetrain_id IS NOT NULL) AS ids ON vd.id = ids.drivetrain_id),
    'engine_sizes', (SELECT json_agg(json_build_object('id', ves.id, 'name', ves.size)) FROM public.vehicle_engine_sizes ves JOIN (SELECT DISTINCT engine_size_id FROM variant_specs WHERE engine_size_id IS NOT NULL) AS ids ON ves.id = ids.engine_size_id),
    'aspirations', (SELECT json_agg(json_build_object('id', va.id, 'name', va.name)) FROM public.vehicle_aspirations va JOIN (SELECT DISTINCT aspiration_id FROM variant_specs WHERE aspiration_id IS NOT NULL) AS ids ON va.id = ids.aspiration_id),
    'doors', (SELECT json_agg(json_build_object('id', vdoors.id, 'name', vdoors.name)) FROM public.vehicle_doors vdoors JOIN (SELECT DISTINCT door_id FROM variant_specs WHERE door_id IS NOT NULL) AS ids ON vdoors.id = ids.door_id)
  )
  INTO v_options;

  RETURN v_options;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_vehicle_variant_options_by_variant_id(integer) TO authenticated;
