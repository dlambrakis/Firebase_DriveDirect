/*
  # Update Vehicle Listing Function and Types

  This migration enhances the vehicle editing capabilities by replacing the existing `update_vehicle_listing` function with a more comprehensive version. It also introduces a new composite type for handling image updates.

  1.  **New Types**
    -   `image_update_payload`: A composite type to structure new and deleted image URLs, simplifying the function signature.

  2.  **Function Changes**
    -   `DROP FUNCTION update_vehicle_listing`: The old function is removed.
    -   `CREATE FUNCTION update_vehicle_listing`: The new function is created with an expanded parameter list to handle more fields.
        -   Accepts `p_listing_id`, `p_mileage`, `p_price`, `p_vin`, `p_description`, `p_feature_ids`, `p_new_image_urls`, `p_deleted_image_urls`, and `p_is_sold`.
        -   Performs ownership verification to ensure security.
        -   Updates the `vehicle_listings` table.
        -   Manages the `vehicle_features_junction` table by deleting existing features and inserting the new set.
        -   Updates the `images` array by removing deleted URLs and appending new ones.
        -   Sets the listing `status` based on the `p_is_sold` boolean.

  3.  **Security**
    -   The function maintains the `SECURITY DEFINER` context and strict ownership checks via `auth.uid()`.
*/

-- Drop the old, simpler function if it exists
DROP FUNCTION IF EXISTS public.update_vehicle_listing(integer, text, text, integer, integer, integer, text, jsonb);

-- Create the new, more comprehensive function
CREATE OR REPLACE FUNCTION public.update_vehicle_listing(
  p_listing_id integer,
  p_mileage integer,
  p_price integer,
  p_vin text,
  p_description text,
  p_feature_ids integer[],
  p_new_image_urls text[],
  p_deleted_image_urls text[],
  p_is_sold boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seller_id uuid;
  v_current_images text[];
BEGIN
  -- Get the seller_id and current images of the listing
  SELECT user_id, images INTO v_seller_id, v_current_images
  FROM public.vehicle_listings
  WHERE listing_id = p_listing_id;

  -- Check if the listing exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found.';
  END IF;

  -- Verify that the current user is the seller
  IF v_seller_id != auth.uid() THEN
    RAISE EXCEPTION 'You are not authorized to update this listing.';
  END IF;

  -- Update vehicle_listings table
  UPDATE public.vehicle_listings
  SET
    mileage = p_mileage,
    price = p_price,
    vin = p_vin,
    description = p_description,
    status = CASE WHEN p_is_sold THEN 'sold' ELSE 'available' END,
    updated_at = now()
  WHERE listing_id = p_listing_id;

  -- Manage features
  -- First, delete existing features for this listing
  DELETE FROM public.vehicle_features_junction
  WHERE vehicle_listing_id = p_listing_id;

  -- Then, insert the new set of features
  IF array_length(p_feature_ids, 1) > 0 THEN
    INSERT INTO public.vehicle_features_junction (vehicle_listing_id, feature_id)
    SELECT p_listing_id, unnest(p_feature_ids);
  END IF;

  -- Manage images
  -- Remove deleted images
  IF array_length(p_deleted_image_urls, 1) > 0 THEN
    v_current_images := array(
      SELECT unnest(v_current_images)
      EXCEPT
      SELECT unnest(p_deleted_image_urls)
    );
  END IF;

  -- Add new images
  IF array_length(p_new_image_urls, 1) > 0 THEN
    v_current_images := v_current_images || p_new_image_urls;
  END IF;

  -- Update the images array in the listing
  UPDATE public.vehicle_listings
  SET images = v_current_images
  WHERE listing_id = p_listing_id;

END;
$$;
