/*
      # Add Saved Vehicles Feature

      This migration introduces the functionality for users to save or "favorite" vehicle listings.

      1.  **New Tables**
          - `saved_vehicles`: This table creates a many-to-many relationship between users and vehicle listings.
            - `id`: A unique identifier for the saved entry.
            - `user_id`: A foreign key referencing the `auth.users` table, identifying the user who saved the vehicle.
            - `listing_id`: A foreign key referencing the `vehicle_listings` table, identifying the saved vehicle.
            - `created_at`: A timestamp indicating when the vehicle was saved.

      2.  **Constraints &amp; Indexes**
          - A unique constraint on `(user_id, listing_id)` prevents a user from saving the same vehicle multiple times.
          - An index is created on `listing_id` to optimize lookups.

      3.  **Security**
          - Row Level Security (RLS) is enabled on the `saved_vehicles` table.
          - **Policies**:
            - Users can view their own saved vehicles.
            - Users can save new vehicles for themselves.
            - Users can unsave (delete) vehicles they have previously saved.
    */

    -- 1. Create the saved_vehicles table
    CREATE TABLE IF NOT EXISTS public.saved_vehicles (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        listing_id bigint NOT NULL REFERENCES public.vehicle_listings(listing_id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT saved_vehicles_user_listing_unique UNIQUE (user_id, listing_id)
    );

    -- 2. Add comments to the table and columns
    COMMENT ON TABLE public.saved_vehicles IS 'Stores vehicles that users have saved or favorited.';
    COMMENT ON COLUMN public.saved_vehicles.user_id IS 'The user who saved the vehicle.';
    COMMENT ON COLUMN public.saved_vehicles.listing_id IS 'The vehicle that was saved.';

    -- 3. Create indexes
    CREATE INDEX IF NOT EXISTS saved_vehicles_listing_id_idx ON public.saved_vehicles(listing_id);
    CREATE INDEX IF NOT EXISTS saved_vehicles_user_id_idx ON public.saved_vehicles(user_id);

    -- 4. Enable RLS
    ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;

    -- 5. Create RLS policies
    CREATE POLICY "Users can view their own saved vehicles"
    ON public.saved_vehicles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can save a vehicle"
    ON public.saved_vehicles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can unsave their own saved vehicles"
    ON public.saved_vehicles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
