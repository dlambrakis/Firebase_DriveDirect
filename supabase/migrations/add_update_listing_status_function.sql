/*
  # Add update_listing_status function

  This migration adds a new RPC function to allow users to update the status of their own vehicle listings between 'ACTIVE' and 'SOLD'.

  1. New Functions
    - `update_listing_status(p_listing_id int, p_new_status text)`
      - Updates the status of a vehicle listing.
      - Verifies that the caller is the owner of the listing.
      - Restricts status changes to 'ACTIVE' or 'SOLD'.

  2. Security
    - The function includes an ownership check using `auth.uid()` to ensure users can only modify their own listings.
    - It runs with `SECURITY DEFINER` privileges to modify the table while respecting the ownership check.
*/
CREATE OR REPLACE FUNCTION public.update_listing_status(p_listing_id integer, p_new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seller_id uuid;
BEGIN
  -- Validate the new status. It must be either 'ACTIVE' or 'SOLD'.
  IF p_new_status NOT IN ('ACTIVE', 'SOLD') THEN
    RAISE EXCEPTION 'Invalid status value: %. Must be ''ACTIVE'' or ''SOLD''.', p_new_status;
  END IF;

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
    RAISE EXCEPTION 'You are not authorized to update this listing.';
  END IF;

  -- Update the status and the updated_at timestamp
  UPDATE public.vehicle_listings
  SET status = p_new_status,
      updated_at = now()
  WHERE listing_id = p_listing_id;
END;
$$;
