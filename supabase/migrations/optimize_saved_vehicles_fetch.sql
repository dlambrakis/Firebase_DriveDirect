/*
  # Optimize Saved Vehicles Fetching

  This migration introduces a PostgreSQL function to optimize the retrieval of a user's saved vehicle listings.

  1. New Functions
    - `get_saved_vehicle_listings(p_user_id uuid)`: This function accepts a user's ID and returns a set of `vehicle_listings_detailed` records that the user has saved. It replaces a two-step query process on the client with a single, efficient database query.

  2. Changes
    - Instead of the client fetching saved listing IDs and then fetching the listing details, the client can now call this function to get the data in one go. This improves performance by reducing database round-trips.

  3. Security
    - The function is defined to run with the privileges of the caller. The underlying RLS policies on `vehicle_listings_detailed` and `saved_vehicles` will ensure data security.
*/

CREATE OR REPLACE FUNCTION get_saved_vehicle_listings(p_user_id uuid)
RETURNS SETOF vehicle_listings_detailed AS $$
BEGIN
  RETURN QUERY
  SELECT vld.*
  FROM vehicle_listings_detailed AS vld
  INNER JOIN saved_vehicles AS sv ON vld.listing_id = sv.listing_id
  WHERE sv.user_id = p_user_id
  ORDER BY sv.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execution rights to the authenticated role
GRANT EXECUTE ON FUNCTION get_saved_vehicle_listings(uuid) TO authenticated;
