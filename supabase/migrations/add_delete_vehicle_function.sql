/*
      # Create delete_vehicle_listing function

      This migration introduces a new RPC function `delete_vehicle_listing` to allow users to delete their own vehicle listings.

      1. **New Function**: `delete_vehicle_listing(p_listing_id int)`
         - **Purpose**: Securely deletes a vehicle listing and its associated images.
         - **Parameters**:
           - `p_listing_id`: The ID of the listing to delete.
         - **Logic**:
           - Verifies that the authenticated user (`auth.uid()`) is the owner of the listing.
           - Retrieves all image URLs for the listing.
           - Deletes the listing from the `vehicle_listings` table. This will cascade and delete related entries in `vehicle_features` and `vehicle_images`.
           - Deletes the corresponding image files from the `vehicle-images` storage bucket.
           - Returns the ID of the deleted listing.
         - **Security**: The function can only be executed by the listing's owner, preventing unauthorized deletions.

      2. **Dependencies**:
         - This function relies on `on delete cascade` being set for foreign keys in the `vehicle_images` and `vehicle_features` tables.
    */

    create or replace function public.delete_vehicle_listing(p_listing_id int)
    returns int
    language plpgsql
    security definer
    as $$
    declare
      v_seller_id uuid;
      v_image_urls text[];
      v_image_paths text[];
    begin
      -- 1. Verify ownership and get listing
      select seller_id into v_seller_id
      from public.vehicle_listings
      where id = p_listing_id;

      if v_seller_id is null then
        raise exception 'Listing not found or user does not have permission to delete.';
      end if;

      if v_seller_id <> auth.uid() then
        raise exception 'User is not the owner of the listing';
      end if;

      -- 2. Get image URLs to delete from storage
      select array_agg(image_url) into v_image_urls
      from public.vehicle_images
      where listing_id = p_listing_id;

      -- 3. Delete the listing from the table (cascades to features and images tables)
      delete from public.vehicle_listings
      where id = p_listing_id;

      -- 4. Delete images from storage bucket
      if array_length(v_image_urls, 1) > 0 then
        -- Extract storage paths from public URLs
        select array_agg(
          substring(url from position('/vehicle-images/' in url) + length('/vehicle-images/'))
        ) into v_image_paths
        from unnest(v_image_urls) as url;

        -- Perform deletion from storage
        if array_length(v_image_paths, 1) > 0 then
          perform storage.delete_objects('vehicle-images', v_image_paths);
        end if;
      end if;

      -- 5. Return the deleted listing ID
      return p_listing_id;
    end;
    $$;
