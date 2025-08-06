/*
      # Optimize Vehicle Detail Page Loading

      This migration introduces two new RPC functions to optimize the vehicle detail page, reducing the number of network requests from two to one and simplifying client-side logic.

      1.  **Problem**: The vehicle detail page previously made one request to get vehicle data and a separate request to fetch the user's entire list of saved vehicles, just to check if the current vehicle was saved. This was inefficient and slow.

      2.  **Solution**:
          - A new `get_vehicle_details_for_user` function was created to fetch vehicle details and the user-specific `is_saved` status in a single call.
          - A new `toggle_saved_vehicle` function was created to handle saving and unsaving atomically in the database.

      3.  **Key Improvements**:
          - **Performance**: Reduces network requests and eliminates the need to transfer a potentially large list of saved vehicle IDs.
          - **Simplicity**: Drastically simplifies the client-side code in the `VehicleDetailPage` and its related hooks.
          - **Data Integrity**: Ensures the save/unsave action is a single, atomic transaction.

      4.  **New Functions**:
          - `public.get_vehicle_details_for_user(p_listing_id INT, p_user_id UUID)`: Returns all data from the `vehicle_listings_detailed` view plus a boolean `is_saved` field.
          - `public.toggle_saved_vehicle(p_listing_id INT, p_user_id UUID)`: Adds or removes a record from the `saved_vehicles` table.
    */

    -- Function to get detailed vehicle info including whether the specified user has saved it
    CREATE OR REPLACE FUNCTION public.get_vehicle_details_for_user(p_listing_id INT, p_user_id UUID)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN (
        SELECT json_build_object(
          'listing_id', v.listing_id,
          'user_id', v.user_id,
          'vin', v.vin,
          'make', v.make,
          'model', v.model,
          'variant', v.variant,
          'year', v.year,
          'mileage', v.mileage,
          'price', v.price,
          'description', v.description,
          'city', v.city,
          'province', v.province,
          'status', v.status,
          'created_at', v.created_at,
          'images', v.images,
          'features', v.features,
          'seller_full_name', v.seller_full_name,
          'seller_avatar_url', v.seller_avatar_url,
          'is_saved', (EXISTS (
            SELECT 1
            FROM public.saved_vehicles sv
            WHERE sv.listing_id = v.listing_id AND sv.user_id = p_user_id
          ))
        )
        FROM public.vehicle_listings_detailed v
        WHERE v.listing_id = p_listing_id
      );
    END;
    $$;

    -- Function to atomically save or unsave a vehicle for a user
    CREATE OR REPLACE FUNCTION public.toggle_saved_vehicle(p_listing_id INT, p_user_id UUID)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      is_currently_saved BOOLEAN;
    BEGIN
      -- Check if the vehicle is already saved
      SELECT EXISTS (
        SELECT 1
        FROM public.saved_vehicles
        WHERE listing_id = p_listing_id AND user_id = p_user_id
      ) INTO is_currently_saved;

      -- If saved, delete it. If not saved, insert it.
      IF is_currently_saved THEN
        DELETE FROM public.saved_vehicles
        WHERE listing_id = p_listing_id AND user_id = p_user_id;
        RETURN json_build_object('saved', false);
      ELSE
        INSERT INTO public.saved_vehicles (listing_id, user_id)
        VALUES (p_listing_id, p_user_id);
        RETURN json_build_object('saved', true);
      END IF;
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.get_vehicle_details_for_user(INT, UUID) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.toggle_saved_vehicle(INT, UUID) TO authenticated;
