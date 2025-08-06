/*
      # Fix and Recreate delete_vehicle_listing function

      This migration corrects an issue where the `delete_vehicle_listing` function could not be updated due to a return type mismatch and improves its security context.

      1. **Function Drop**:
         - The existing `delete_vehicle_listing(integer)` function is dropped to allow for its recreation.

      2. **Function Re-creation**: `delete_vehicle_listing(p_listing_id int)`
         - **Purpose**: Securely deletes a vehicle listing and its associated images.
         - **Return Type**: `int` (The ID of the deleted listing).
         - **Security Context**: Changed from `SECURITY DEFINER` to `SECURITY INVOKER`. This ensures all operations within the function, including storage deletions, are performed with the permissions of the calling user, correctly enforcing Row Level Security policies on both the database tables and storage objects.
         - **Logic**:
           - Verifies that the authenticated user (`auth.uid()`) is the owner of the listing.
           - Retrieves all image URLs for the listing.
           - Deletes the listing from the `vehicle_listings` table.
           - Deletes the corresponding image files from the `vehicle-images` storage bucket.
           - Returns the ID of the deleted listing.
    */

    -- Drop the existing function to resolve the return type conflict.
    DROP FUNCTION IF EXISTS public.delete_vehicle_listing(integer);

    -- Recreate the function with the correct return type and security context.
    create or replace function public.delete_vehicle_listing(p_listing_id int)
    returns int
    language plpgsql
    security invoker -- Changed to INVOKER to respect user's RLS policies for storage
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
        raise exception 'Listing not found.';
      end if;

      if v_seller_id <> auth.uid() then
        raise exception 'User does not have permission to delete this listing.';
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
        -- e.g., from '.../storage/v1/object/public/vehicle-images/user-uuid/image.jpg'
        -- to 'user-uuid/image.jpg'
        select array_agg(
          substring(url from position('/vehicle-images/' in url) + length('/vehicle-images/'))
        ) into v_image_paths
        from unnest(v_image_urls) as t(url);

        -- Perform deletion from storage. This will now run as the calling user
        -- and respect the RLS policies on the storage.objects table.
        if array_length(v_image_paths, 1) > 0 then
          perform storage.delete_objects('vehicle-images', v_image_paths);
        end if;
      end if;

      -- 5. Return the deleted listing ID
      return p_listing_id;
    end;
    $$;
