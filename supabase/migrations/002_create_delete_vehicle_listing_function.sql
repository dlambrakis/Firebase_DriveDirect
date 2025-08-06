/*
  # Delete Vehicle Listing Function

  This migration creates a new RPC function `delete_vehicle_listing` to handle the complete removal of a vehicle listing.

  1. **New Function**:
    - `delete_vehicle_listing(p_listing_id)`
      - Verifies that the user calling the function is the owner of the listing.
      - Collects all associated image URLs from `vehicle_images`.
      - Deletes the listing record from the `listings` table. Due to cascading deletes set up in the schema, this will also remove related entries in `listing_features` and `vehicle_images`.
      - Deletes the associated images from Supabase Storage to prevent orphaned files.
      - Returns the ID of the deleted listing.

  2. **Security**:
    - The function is defined with `SECURITY DEFINER` to run with elevated privileges required for storage operations.
    - It strictly enforces ownership by comparing `auth.uid()` with the `user_id` on the listing.
*/

CREATE OR REPLACE FUNCTION delete_vehicle_listing(p_listing_id int)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_listing_id int;
  current_user_id uuid := auth.uid();
  listing_owner_id uuid;
  image_paths text[];
BEGIN
  -- 1. Verify ownership
  SELECT user_id INTO listing_owner_id FROM listings WHERE id = p_listing_id;

  IF listing_owner_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF listing_owner_id != current_user_id THEN
    RAISE EXCEPTION 'User does not have permission to delete this listing';
  END IF;

  -- 2. Get all storage paths for images associated with the listing
  SELECT array_agg(
    (string_to_array(image_url, '/'))[array_length(string_to_array(image_url, '/'), 1) - 1]
  )
  INTO image_paths
  FROM vehicle_images
  WHERE listing_id = p_listing_id;

  -- 3. Delete the listing from the table.
  -- Assumes ON DELETE CASCADE is set for foreign keys in listing_features and vehicle_images.
  DELETE FROM listings
  WHERE id = p_listing_id
  RETURNING id INTO deleted_listing_id;

  -- 4. Delete the images from storage if any exist
  IF image_paths IS NOT NULL AND array_length(image_paths, 1) > 0 THEN
    PERFORM storage.delete_objects('vehicle-images', image_paths, listing_owner_id::text);
  END IF;

  RETURN json_build_object('deleted_listing_id', deleted_listing_id);
END;
$$;
