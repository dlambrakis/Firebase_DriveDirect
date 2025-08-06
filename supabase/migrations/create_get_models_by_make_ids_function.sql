/*
      # Get Vehicle Models by Make IDs

      This function retrieves a distinct list of vehicle models based on an array of make IDs.

      1. New Function
        - `get_models_by_make_ids(p_make_ids integer[])`
          - **Purpose**: Fetches active vehicle models associated with a given list of vehicle makes.
          - **Parameters**:
            - `p_make_ids` (integer[]): An array of `make_id`s to filter by.
          - **Returns**: A table with `model_id` (integer) and `model` (text).
          - **Logic**:
            1. Finds all distinct `model_id`s from `vehicle_main` that match the input `p_make_ids`.
            2. Joins with `vehicle_models` to get the model names.
            3. Filters for models where `is_active` is true.
            4. Returns a distinct, ordered list of models.

      2. Security
        - The function is defined with `SECURITY INVOKER` (default), so it runs with the permissions of the calling user. RLS on the underlying tables will apply.
    */
    CREATE OR REPLACE FUNCTION public.get_models_by_make_ids(p_make_ids integer[])
    RETURNS TABLE(model_id integer, model text)
    LANGUAGE plpgsql
    STABLE
    AS $$
    BEGIN
      IF p_make_ids IS NULL OR array_length(p_make_ids, 1) IS NULL THEN
        RETURN;
      END IF;

      RETURN QUERY
      SELECT DISTINCT
        vm.model_id,
        vm.model
      FROM
        public.vehicle_models vm
      JOIN
        public.vehicle_main vmain ON vm.model_id = vmain.model_id
      WHERE
        vmain.make_id = ANY(p_make_ids) AND vm.is_active = true
      ORDER BY
        vm.model;
    END;
    $$;
