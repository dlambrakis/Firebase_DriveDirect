/*
  # Add Year Columns to Vehicle Variants

  This migration addresses a schema drift issue by adding the `start_year` and `end_year` columns to the `vehicle_variants` table.

  1. Problem
    - The application and Prisma schema expect `start_year` and `end_year` columns on the `vehicle_variants` table, but they are missing in the database.
    - This caused errors in functions that tried to access these fields.

  2. Changes
    - Adds `start_year` (integer, not null, default 0).
    - Adds `end_year` (integer, not null, default 0).
    - The `DO $$ ... $$` block ensures the migration runs safely and does not fail if the columns already exist.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vehicle_variants' AND column_name = 'start_year'
  ) THEN
    ALTER TABLE public.vehicle_variants ADD COLUMN start_year INTEGER NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vehicle_variants' AND column_name = 'end_year'
  ) THEN
    ALTER TABLE public.vehicle_variants ADD COLUMN end_year INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;
