/*
      # Add status to vehicle listings

      This migration adds a `status` column to the `vehicle_listings` table to track whether a listing is active or sold.

      1.  **New Columns**
          - `vehicle_listings.status`: A text column to store the listing status. It defaults to 'ACTIVE' and is constrained to either 'ACTIVE' or 'SOLD'.

      2.  **Changes**
          - The `vehicle_listings` table is altered to include the new `status` column.
    */

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'vehicle_listings' AND column_name = 'status'
      ) THEN
        ALTER TABLE public.vehicle_listings
        ADD COLUMN status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD'));
      END IF;
    END $$;
