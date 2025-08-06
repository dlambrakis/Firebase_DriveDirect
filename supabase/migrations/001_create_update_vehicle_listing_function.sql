/*
  # Update Vehicle Listing Function

  This migration creates a new RPC function `update_vehicle_listing` to handle modifications to existing vehicle listings.

  1. **New Function**:
    - `update_vehicle_listing(p_listing_id, p_mileage, p_price, p_vin, p_description, p_feature_ids, p_new_image_urls, p_deleted_image_urls)`
      - Updates the core details of a listing in the `listings` table.
      - Updates associated features in the `listing_features` table by replacing them.
      - Adds new images to the `vehicle_images` table.
      - Deletes specified images from the `vehicle_images` table.
      - Ensures the user calling the function is the owner of the listing.

  2. **Security**:
    - The function is defined with `SECURITY DEFINER` to run with the permissions of the function owner.
    - It checks that `auth.uid()` matches the `user_id` of the listing being updated, enforcing ownership.
*/

CREATE OR REPLACE FUNCTION update_vehicle_listing(
  p_listing_id int,
  p_mileage int,
  p_price int,
  p_vin text,
  p_description text,
  p_feature_ids int[],
  p_new_image_urls text[],
  p_deleted_image_urls text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_listing_id int;
  current_user_id uuid := auth.uid();
  listing_owner_id uuid;
  image_url text;
BEGIN
  -- 1. Verify ownership
  SELECT user_id INTO listing_owner_id FROM listings WHERE id = p_listing_id;

  IF listing_owner_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF listing_owner_id != current_user_id THEN
    RAISE EXCEPTION 'User does not have permission to update this listing';
  END IF;

  -- 2. Update the listings table
  UPDATE listings
  SET
    mileage = p_mileage,
    price = p_price,
    vin = p_vin,
    description = p_description,
    updated_at = now()
  WHERE id = p_listing_id
  RETURNING id INTO updated_listing_id;

  -- 3. Update features (delete old, insert new)
  DELETE FROM listing_features WHERE listing_id = p_listing_id;
  IF array_length(p_feature_ids, 1) > 0 THEN
    INSERT INTO listing_features (listing_id, feature_id)
    SELECT p_listing_id, unnest(p_feature_ids);
  END IF;

  -- 4. Delete specified images
  IF array_length(p_deleted_image_urls, 1) > 0 THEN
    DELETE FROM vehicle_images
    WHERE listing_id = p_listing_id AND image_url = ANY(p_deleted_image_urls);
  END IF;

  -- 5. Add new images
  IF array_length(p_new_image_urls, 1) > 0 THEN
    FOREACH image_url IN ARRAY p_new_image_urls
    LOOP
      INSERT INTO vehicle_images (listing_id, image_url)
      VALUES (p_listing_id, image_url);
    END LOOP;
  END IF;

  RETURN json_build_object('updated_listing_id', updated_listing_id);
END;
$$;
