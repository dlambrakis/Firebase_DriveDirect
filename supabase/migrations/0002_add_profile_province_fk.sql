/*
  # Add Foreign Key to Profiles

  This migration adds a foreign key constraint to the `profiles` table, linking `province_id` to the `provinces` table. This establishes a formal relationship between the two tables, which is necessary for proper type generation and relational queries in Supabase. This script is idempotent.

  1. Changes
    - Adds a foreign key constraint `profiles_province_id_fkey` on the `profiles` table.
    - The constraint links `profiles.province_id` to `provinces.id`.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_province_id_fkey' AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_province_id_fkey
    FOREIGN KEY (province_id)
    REFERENCES public.provinces(id);
  END IF;
END $$;
