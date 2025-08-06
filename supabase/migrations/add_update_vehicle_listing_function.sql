/*
  # Add update_vehicle_listing function

  This migration introduces a new RPC function to allow users to update the details of their own vehicle listings.

  1. New Functions
    - `update_vehicle_listing(p_listing_id int, p_make text, ...)`
      - Updates the core details of a specific vehicle listing.
      - Verifies that the caller is the owner of the listing before applying changes.
      - Updates text fields and the images JSONB array.

  2. Security
    - The function includes a strict ownership check using `auth.uid()` to ensure users can only modify their own listings.
    - It runs with `SECURITY DEFINER` privileges to perform the update while respecting the ownership check.
*/
CREATE OR REPLACE FUNCTION public.update_vehicle_listing(
  p_listing_id integer,
  p_make text,
  p_model text,
  p_year integer,
  p_price integer,
  p_mileage integer,
  p_description text,
  p_images jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seller_id uuid;
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
    RAISE EXCEPTION 'You are not authorized to update this listing.';
  END IF;

  -- Update the vehicle listing details
  UPDATE public.vehicle_listings
  SET
    make = p_make,
    model = p_model,
    year = p_year,
    price = p_price,
    mileage = p_mileage,
    description = p_description,
    images = p_images,
    updated_at = now()
  WHERE listing_id = p_listing_id;
END;
$$;
