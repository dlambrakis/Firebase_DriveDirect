/*
      # Atomic Vehicle Creation and Updates

      This migration introduces two new RPC functions to handle the creation and updating of vehicle listings within single, atomic transactions. It also removes the previous, less robust `update_vehicle_listing` function.

      1.  **Problem**: The previous implementation required multiple client-side calls to create or update a listing (e.g., one call to create the listing, another to add features). This is not transactional and can lead to inconsistent data if one call fails.

      2.  **Solution**:
          - `create_vehicle_listing_atomic`: Creates a vehicle listing, its main record, and associates all its features in a single database transaction.
          - `update_vehicle_listing_atomic`: Updates a listing's details and synchronizes its features (adds new, removes old) in a single transaction, ensuring data integrity.

      3.  **Key Improvements**:
          - **Atomicity**: Guarantees that a listing is either fully created/updated or not at all.
          - **Performance**: Reduces the number of network round-trips required for each operation.
          - **Security & Simplicity**: Moves complex business logic from the client into the database, simplifying the frontend code and centralizing the logic.

      4.  **New Functions**:
          - `public.create_vehicle_listing_atomic(...)`: Creates a complete vehicle listing.
          - `public.update_vehicle_listing_atomic(...)`: Updates a vehicle listing and its features.

      5.  **Removed Functions**:
          - `public.update_vehicle_listing(...)`: This function is now obsolete and has been replaced by `update_vehicle_listing_atomic`.
    */

    -- Drop the old, non-atomic update function
    DROP FUNCTION IF EXISTS public.update_vehicle_listing(integer, text, text, integer, integer, integer, text, jsonb);

    -- Function to create a vehicle listing and its features atomically
    CREATE OR REPLACE FUNCTION public.create_vehicle_listing_atomic(
      p_user_id uuid,
      p_vehicle_main_id integer,
      p_price integer,
      p_mileage integer,
      p_vin text,
      p_description text,
      p_images text[],
      p_feature_ids integer[]
    )
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      new_listing_id int;
      new_listing json;
    BEGIN
      -- Insert into vehicle_listings
      INSERT INTO public.vehicle_listings (user_id, vehicle_main_id, price, mileage, vin, description, images)
      VALUES (p_user_id, p_vehicle_main_id, p_price, p_mileage, p_vin, p_description, p_images)
      RETURNING listing_id INTO new_listing_id;

      -- Insert features if any are provided
      IF array_length(p_feature_ids, 1) > 0 THEN
        INSERT INTO public.vehicle_listing_features (listing_id, feature_id)
        SELECT new_listing_id, unnest(p_feature_ids);
      END IF;

      -- Return the newly created listing's details
      SELECT json_build_object('id', vl.listing_id)
      INTO new_listing
      FROM public.vehicle_listings vl
      WHERE vl.listing_id = new_listing_id;

      RETURN new_listing;
    END;
    $$;

    -- Function to update a vehicle listing and its features atomically
    CREATE OR REPLACE FUNCTION public.update_vehicle_listing_atomic(
      p_listing_id integer,
      p_price integer,
      p_mileage integer,
      p_description text,
      p_is_sold boolean,
      p_images text[],
      p_feature_ids integer[]
    )
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_seller_id uuid;
    BEGIN
      -- Verify ownership
      SELECT user_id INTO v_seller_id
      FROM public.vehicle_listings
      WHERE listing_id = p_listing_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found.';
      END IF;

      IF v_seller_id != auth.uid() THEN
        RAISE EXCEPTION 'You are not authorized to update this listing.';
      END IF;

      -- Update the main listing details
      UPDATE public.vehicle_listings
      SET
        price = p_price,
        mileage = p_mileage,
        description = p_description,
        status = CASE WHEN p_is_sold THEN 'SOLD' ELSE 'AVAILABLE' END,
        images = p_images,
        updated_at = now()
      WHERE listing_id = p_listing_id;

      -- Synchronize features
      -- 1. Delete features that are no longer selected
      DELETE FROM public.vehicle_listing_features vlf
      WHERE vlf.listing_id = p_listing_id
        AND vlf.feature_id NOT IN (SELECT unnest(p_feature_ids));

      -- 2. Insert new features that are now selected
      INSERT INTO public.vehicle_listing_features (listing_id, feature_id)
      SELECT p_listing_id, fid
      FROM unnest(p_feature_ids) AS fid
      WHERE NOT EXISTS (
        SELECT 1
        FROM public.vehicle_listing_features vlf
        WHERE vlf.listing_id = p_listing_id AND vlf.feature_id = fid
      );
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.create_vehicle_listing_atomic(uuid, integer, integer, integer, text, text, text[], integer[]) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.update_vehicle_listing_atomic(integer, integer, integer, text, boolean, text[], integer[]) TO authenticated;
