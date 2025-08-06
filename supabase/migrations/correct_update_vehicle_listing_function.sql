/*
      # Correct `update_vehicle_listing` Function

      This migration corrects the `update_vehicle_listing` function to align it with the client-side `useUpdateVehicle` hook. The previous version had a signature mismatch and lacked image handling capabilities.

      1.  **Function Signature**
          - The function is recreated to accept all parameters sent by the client, including `p_price`, `p_mileage`, `p_description`, `p_vin`, `p_feature_ids`, `p_new_image_urls`, `p_deleted_image_urls`, and the new `p_is_sold` flag.

      2.  **Logic**
          - **Authorization**: Verifies that the caller is the owner of the listing using `auth.uid()`.
          - **Image Management**: Correctly removes deleted image URLs and appends new ones to the `images` array.
          - **Status Update**: Sets the listing `status` to 'SOLD' or 'ACTIVE' based on the `p_is_sold` boolean parameter.
          - **Feature Management**: Updates the associated vehicle features.

      3.  **Return Value**
          - Returns a JSON object `{ "updated_listing_id": ... }` on success to match the client's expectation.
    */

    CREATE OR REPLACE FUNCTION public.update_vehicle_listing(
        p_listing_id integer,
        p_price numeric,
        p_mileage integer,
        p_description text,
        p_vin text,
        p_feature_ids integer[],
        p_new_image_urls text[],
        p_deleted_image_urls text[],
        p_is_sold boolean
    )
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      listing_owner_id uuid;
      current_images text[];
      updated_images text[];
    BEGIN
      -- 1. Authorization: Ensure the caller owns the listing
      SELECT user_id INTO listing_owner_id FROM public.vehicle_listings WHERE listing_id = p_listing_id;

      IF listing_owner_id IS NULL THEN
        RAISE EXCEPTION 'Listing not found';
      END IF;

      IF listing_owner_id != auth.uid() THEN
        RAISE EXCEPTION 'User does not have permission to update this listing';
      END IF;

      -- 2. Image Management: Update the images array
      SELECT images INTO current_images FROM public.vehicle_listings WHERE listing_id = p_listing_id;

      -- Remove deleted images
      IF p_deleted_image_urls IS NOT NULL AND array_length(p_deleted_image_urls, 1) > 0 THEN
        SELECT array_agg(elem) INTO updated_images FROM unnest(current_images) elem WHERE NOT (elem = ANY(p_deleted_image_urls));
      ELSE
        updated_images := current_images;
      END IF;

      -- Add new images
      IF p_new_image_urls IS NOT NULL AND array_length(p_new_image_urls, 1) > 0 THEN
        updated_images := array_cat(COALESCE(updated_images, ARRAY[]::text[]), p_new_image_urls);
      END IF;

      -- 3. Update Listing Details
      UPDATE public.vehicle_listings
      SET
        price = COALESCE(p_price, price),
        mileage = COALESCE(p_mileage, mileage),
        description = COALESCE(p_description, description),
        vin = COALESCE(p_vin, vin),
        images = updated_images,
        status = CASE
          WHEN p_is_sold IS NOT NULL THEN
            CASE WHEN p_is_sold THEN 'SOLD'::text ELSE 'ACTIVE'::text END
          ELSE
            status
        END
      WHERE listing_id = p_listing_id;

      -- 4. Feature Management: Update associated features
      IF p_feature_ids IS NOT NULL THEN
        -- Delete existing features for the listing
        DELETE FROM public.vehicle_listing_features WHERE listing_id = p_listing_id;

        -- Insert new features if the array is not empty
        IF array_length(p_feature_ids, 1) > 0 THEN
          INSERT INTO public.vehicle_listing_features (listing_id, feature_id)
          SELECT p_listing_id, unnest(p_feature_ids);
        END IF;
      END IF;

      -- 5. Return confirmation
      RETURN json_build_object('updated_listing_id', p_listing_id);
    END;
    $$;
