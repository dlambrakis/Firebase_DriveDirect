<pre>
      <code>
/*
  # Update Vehicle Variant Functions

  This migration streamlines how vehicle variants are fetched for the vehicle creation form. It replaces several older functions with a single, more capable function and removes redundant ones.

  1. Dropped Functions
    - `get_vehicle_variants_by_model(integer)`: Replaced by the new function that accepts make and model IDs.
    - `get_variants_by_makes_and_models(integer[], integer[])`: Redundant name, replaced by the new function.
    - `get_variants_by_make_and_model_ids(integer[], integer[])`: Dropped to ensure the updated version is created and used.

  2. New Function
    - `get_variants_by_make_and_model_ids(p_make_ids integer[], p_model_ids integer[])`
      - **Purpose**: Fetches active vehicle variants associated with given lists of vehicle makes and models.
      - **Parameters**:
        - `p_make_ids` (integer[]): An array of `make_id`s.
        - `p_model_ids` (integer[]): An array of `model_id`s.
      - **Returns**: A table with `variant_id` (integer), `variant` (text), and `is_active` (boolean).
*/

-- Drop old and redundant functions
DROP FUNCTION IF EXISTS public.get_vehicle_variants_by_model(integer);
DROP FUNCTION IF EXISTS public.get_variants_by_makes_and_models(integer[], integer[]);
DROP FUNCTION IF EXISTS public.get_variants_by_make_and_model_ids(integer[], integer[]);

-- Create the new, consolidated function
CREATE OR REPLACE FUNCTION public.get_variants_by_make_and_model_ids(p_make_ids integer[], p_model_ids integer[])
RETURNS TABLE(variant_id integer, variant text, is_active boolean)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  IF p_make_ids IS NULL OR array_length(p_make_ids, 1) IS NULL OR
     p_model_ids IS NULL OR array_length(p_model_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT DISTINCT
    vv.variant_id,
    vv.variant,
    vv.is_active
  FROM
    public.vehicle_variants vv
  JOIN
    public.vehicle_main vmain ON vv.variant_id = vmain.variant_id
  WHERE
    vmain.make_id = ANY(p_make_ids) AND
    vmain.model_id = ANY(p_model_ids) AND
    vv.is_active = true
  ORDER BY
    vv.variant;
END;
$$;
      </code>
    </pre>
