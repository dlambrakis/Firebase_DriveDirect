/*
      # Update Profiles Table and Functions

      This migration corrects the existing `profiles` table and related functions to properly integrate with Supabase authentication and provide a secure way for users to manage their profile data. It replaces the previous, incorrect migration script.

      1.  **Schema Changes**:
          - The `user_id` column in `profiles` is altered to be of type `uuid` to match `auth.users.id`.
          - A foreign key constraint is added from `profiles.user_id` to `auth.users.id`.
          - `user_id` is made `NOT NULL` and `UNIQUE` to enforce a one-to-one relationship.

      2.  **Security**:
          - Row Level Security (RLS) is enabled on the `profiles` table.
          - Policies are created to allow users to view and update their own profiles, while also allowing other authenticated users to view public profile information. The policies now correctly reference the `user_id` column.

      3.  **Automation**:
          - The old, incorrect trigger function (`create_public_profile_for_new_user`) is removed.
          - A new trigger function, `handle_new_user`, is created to automatically populate a profile with basic information when a new user signs up.
          - A trigger `on_auth_user_created` is set on `auth.users` to execute the new function.

      4.  **Functions**:
          - The old `update_user_profile` function is removed.
          - A new, secure RPC function `update_user_profile` is created. It accepts a `jsonb` object containing profile data, making it flexible and easier to maintain. It updates the profile corresponding to the currently authenticated user.
    */

    -- Drop old, incorrect functions and triggers if they exist
    DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
    DROP FUNCTION IF EXISTS public.create_public_profile_for_new_user();
    DROP FUNCTION IF EXISTS public.update_user_profile(text, text);

    -- Step 1: Alter the user_id column to be a UUID if it's not already.
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'user_id' AND udt_name != 'uuid'
      ) THEN
        ALTER TABLE public.profiles ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
      END IF;
    END $$;

    -- Step 2: Add the foreign key constraint to link profiles to auth.users
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_user_id_fkey' AND conrelid = 'public.profiles'::regclass
      ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
      END IF;
    END $$;

    -- Step 3: Ensure user_id is unique and not null
    ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_user_id_key' AND conrelid = 'public.profiles'::regclass
      ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
      END IF;
    END $$;

    -- Step 4: Enable Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Step 5: Create RLS policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
    CREATE POLICY "Authenticated users can view all profiles"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (true);

    -- Step 6: Create a trigger function to create a profile when a new user signs up
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
    AS $$
    BEGIN
      INSERT INTO public.profiles (user_id, display_name, avatar_url)
      VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'avatar_url'
      );
      RETURN NEW;
    END;
    $$;

    -- Step 7: Create the trigger on the auth.users table
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Step 8: Create an RPC function for updating a user's profile using a JSONB object
    CREATE OR REPLACE FUNCTION public.update_user_profile(p_profile_data jsonb)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
      UPDATE public.profiles
      SET
        display_name = p_profile_data->>'display_name',
        first_name = p_profile_data->>'first_name',
        last_name = p_profile_data->>'last_name',
        contact_number = p_profile_data->>'contact_number',
        avatar_url = p_profile_data->>'avatar_url',
        location_type = (p_profile_data->>'location_type')::public.location_type_enum,
        residential_type = (p_profile_data->>'residential_type')::public.residential_type_enum,
        complex_or_estate_name = p_profile_data->>'complex_or_estate_name',
        unit_number = p_profile_data->>'unit_number',
        street_number = p_profile_data->>'street_number',
        street_name = p_profile_data->>'street_name',
        province_id = (p_profile_data->>'province_id')::integer,
        city_id = (p_profile_data->>'city_id')::integer,
        suburb_id = (p_profile_data->>'suburb_id')::integer,
        postcode = p_profile_data->>'postcode',
        updated_at = now()
      WHERE user_id = auth.uid();
    END;
    $$;

    -- Step 9: Grant execute permission to the authenticated role
    GRANT EXECUTE ON FUNCTION public.update_user_profile(jsonb) TO authenticated;
