/*
      # Get User Listings Function

      This migration introduces a new RPC function to securely and efficiently fetch all vehicle listings belonging to a specific user.

      1.  **Problem**: The client-side code for fetching a user's listings was querying a non-existent table, causing the "My Listings" feature to fail. A dedicated, server-side function is a more robust and performant solution.

      2.  **Solution**:
          - `get_user_listings`: A new RPC function that accepts a user's ID and an optional limit. It queries the `vehicle_listings_detailed` view to return all relevant listing data for that user.

      3.  **Key Improvements**:
          - **Correctness**: Fixes a critical bug by querying the correct data source.
          - **Performance**: Centralizes the query logic in the database, reducing overhead.
          - **Security**: The function operates on the server side, providing a secure data access pattern.

      4.  **New Function**:
          - `public.get_user_listings(p_user_id uuid, p_limit integer)`: Fetches a user's listings.
    */

    CREATE OR REPLACE FUNCTION public.get_user_listings(p_user_id uuid, p_limit integer DEFAULT NULL)
    RETURNS SETOF vehicle_listings_detailed
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN QUERY
      SELECT *
      FROM public.vehicle_listings_detailed vld
      WHERE vld.user_id = p_user_id
      ORDER BY vld.created_at DESC
      LIMIT p_limit;
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.get_user_listings(uuid, integer) TO authenticated;
