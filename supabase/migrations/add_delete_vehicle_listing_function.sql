/*
  # Add delete_vehicle_listing function

  This migration introduces a new RPC function to allow users to securely delete their own vehicle listings.

  1. New Functions
    - `delete_vehicle_listing(p_listing_id int)`
      - Deletes a vehicle listing and its associated features.
      - Verifies that the caller is the owner of the listing before deletion.
      - Returns the ID of the deleted listing for confirmation.

  2. Security
    - The function includes an ownership check using `auth.uid()` to ensure users can only delete their own listings.
    - It runs with `SECURITY DEFINER` privileges to perform deletions while respecting the ownership check.
*/
CREATE OR REPLACE FUNCTION public.delete_vehicle_listing(p_listing_id integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seller_id uuid;
  v_deleted_id int;
BEGIN
  -- Get the seller_id (user_id) of the listing
  SELECT user_id INTO v_seller_id
  FROM public.vehicle_listings
  WHERE listing_id = p_listing_id;

  -- Check if the listing exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found.';
  END IF;

  -- Verify that the current user is the seller
  IF v_seller_id != auth.uid() THEN
    RAISE EXCEPTION 'You are not authorized to delete this listing.';
  END IF;

  -- Delete associated features first to avoid foreign key violations
  DELETE FROM public.vehicle_listing_features
  WHERE listing_id = p_listing_id;

  -- Delete the listing and return its ID
  DELETE FROM public.vehicle_listings
  WHERE listing_id = p_listing_id
  RETURNING listing_id INTO v_deleted_id;

  RETURN v_deleted_id;
END;
$$;
