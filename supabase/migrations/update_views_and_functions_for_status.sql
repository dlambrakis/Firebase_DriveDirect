/*
      # Rework Views and Functions for Listing Status

      This migration reworks the database views and functions to integrate the `status` field for vehicle listings. It addresses a `cannot drop columns from view` error by explicitly dropping and recreating the view and its dependent functions.

      1.  **Dependency Management**
          - `get_user_listings` function is dropped because it depends on the `vehicle_listings_detailed` view.
          - `vehicle_listings_detailed` view is dropped to allow for structural changes (adding the `status` column).

      2.  **View Recreation**
          - `vehicle_listings_detailed`: The view is recreated with the correct joins and the new `status` column.

      3.  **Function Recreation**
          - `get_user_listings`: Recreated to return the updated `vehicle_listings_detailed` structure.
          - `update_vehicle_listing`: Recreated to handle the `status` change based on the `p_is_sold` parameter.

      4.  **Security**
          - The `update_vehicle_listing` function continues to verify that the user updating the listing is the owner.
    */

    -- Drop dependent function and the view itself to allow for structural changes
    DROP FUNCTION IF EXISTS public.get_user_listings(uuid);
    DROP VIEW IF EXISTS public.vehicle_listings_detailed;

    -- 1. Recreate the detailed view to include the status column and fix joins
    CREATE VIEW public.vehicle_listings_detailed AS
    SELECT
      vl.listing_id,
      vl.user_id,
      vl.created_at,
      vl.price,
      vl.mileage,
      vl.description,
      vl.vin,
      vl.status,
      vl.year,
      vma.make,
      vmo.model,
      vv.variant,
      p.name AS province_name,
      p.id AS province_id,
      vl.images,
      (
        SELECT json_agg(json_build_object('feature_id', vf.feature_id, 'feature_name', vf.feature_name))
        FROM public.vehicle_listing_features vlf
        JOIN public.vehicle_features vf ON vlf.feature_id = vf.feature_id
        WHERE vlf.listing_id = vl.listing_id
      ) AS features
    FROM
      public.vehicle_listings vl
      LEFT JOIN public.vehicle_main vm ON vl.vehicle_main_id = vm.id
      LEFT JOIN public.vehicle_makes vma ON vm.make_id = vma.make_id
      LEFT JOIN public.vehicle_models vmo ON vm.model_id = vmo.model_id
      LEFT JOIN public.vehicle_variants vv ON vm.variant_id = vv.variant_id
      LEFT JOIN public.provinces p ON vl.province_id = p.id;

    -- 2. Recreate the function to get user listings to ensure it uses the updated view
    CREATE OR REPLACE FUNCTION public.get_user_listings(p_user_id uuid)
    RETURNS SETOF public.vehicle_listings_detailed
    LANGUAGE sql
    STABLE
    AS $$
      SELECT *
      FROM public.vehicle_listings_detailed
      WHERE user_id = p_user_id
      ORDER BY created_at DESC;
    $$;

    -- 3. Update the function for updating a vehicle to handle the status change
    CREATE OR REPLACE FUNCTION public.update_vehicle_listing(
      p_listing_id integer,
      p_user_id uuid,
      p_province_id integer DEFAULT NULL,
      p_price numeric DEFAULT NULL,
      p_mileage integer DEFAULT NULL,
      p_description text DEFAULT NULL,
      p_is_sold boolean DEFAULT NULL,
      p_feature_ids integer[] DEFAULT NULL
    )
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      listing_owner_id uuid;
    BEGIN
      -- Ensure the user owns the listing
      SELECT user_id INTO listing_owner_id FROM public.vehicle_listings WHERE listing_id = p_listing_id;
      IF listing_owner_id != p_user_id THEN
        RAISE EXCEPTION 'User does not have permission to update this listing';
      END IF;

      -- Update the main listing details
      UPDATE public.vehicle_listings
      SET
        province_id = COALESCE(p_province_id, province_id),
        price = COALESCE(p_price, price),
        mileage = COALESCE(p_mileage, mileage),
        description = COALESCE(p_description, description),
        status = CASE
          WHEN p_is_sold IS NOT NULL THEN
            CASE WHEN p_is_sold THEN 'SOLD'::text ELSE 'ACTIVE'::text END
          ELSE
            status
        END
      WHERE listing_id = p_listing_id;

      -- Update features if provided
      IF p_feature_ids IS NOT NULL THEN
        -- Delete existing features for the listing
        DELETE FROM public.vehicle_listing_features WHERE listing_id = p_listing_id;

        -- Insert new features
        INSERT INTO public.vehicle_listing_features (listing_id, feature_id)
        SELECT p_listing_id, unnest(p_feature_ids);
      END IF;
    END;
    $$;
