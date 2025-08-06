/*
      # Fix function overload for get_vehicle_years_for_model

      This migration resolves a function overload ambiguity for `get_vehicle_years_for_model`.

      1. **Changes**
        - Removed the version of `get_vehicle_years_for_model` that accepts a `uuid` parameter. The correct version, which accepts an `integer`, is kept. This fixes runtime errors where the database could not determine which function to call.

      2. **Security**
        - No security changes.
    */

    DROP FUNCTION IF EXISTS get_vehicle_years_for_model(p_model_id uuid);
