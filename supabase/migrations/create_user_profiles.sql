/*
      # User Profile Management

      This migration introduces a `profiles` table and the necessary functions to allow users to manage their public profile information.

      1.  **New Table**:
          - `public.profiles`: Stores public user data.
              - `id` (uuid, PK, FK to `auth.users.id`): Ensures a one-to-one relationship with the authentication user.
              - `full_name` (text): The user's display name.
              - `avatar_url` (text): A URL to the user's profile picture.
              - `updated_at` (timestamptz): Tracks when the profile was last updated.

      2.  **Automation**:
          - `public.create_public_profile_for_new_user()`: A trigger function that automatically creates a profile row when a new user is added to `auth.users`. This keeps user data synchronized.
          - An `AFTER INSERT` trigger on `auth.users` is created to execute this function.

      3.  **New Function**:
          - `public.update_user_profile(p_full_name text, p_avatar_url text)`: A secure RPC for the logged-in user to update their profile. It uses `auth.uid()` to identify the correct profile to update.

      4.  **Security**:
          - RLS is enabled on the `profiles` table.
          - Policies are added to allow users to view and update their own profiles.
          - Authenticated users can view other users' profiles (e.g., to see a seller's name).
    */

    -- 1. Create the profiles table
    CREATE TABLE IF NOT EXISTS public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name text,
      avatar_url text,
      updated_at timestamptz DEFAULT now()
    );

    -- 2. Add comments to the table and columns
    COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
    COMMENT ON COLUMN public.profiles.id IS 'References the user in auth.users.';
    COMMENT ON COLUMN public.profiles.full_name IS 'The user''s full name for display.';
    COMMENT ON COLUMN public.profiles.avatar_url IS 'URL for the user''s profile image.';

    -- 3. Enable Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- 4. Create RLS policies
    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Authenticated users can view all profiles"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (true);


    -- 5. Create a trigger function to create a profile when a new user signs up
    CREATE OR REPLACE FUNCTION public.create_public_profile_for_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name, avatar_url)
      VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
      );
      RETURN NEW;
    END;
    $$;

    -- 6. Create the trigger on the auth.users table
    CREATE TRIGGER create_profile_on_signup
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.create_public_profile_for_new_user();


    -- 7. Create an RPC function for updating a user's profile
    CREATE OR REPLACE FUNCTION public.update_user_profile(p_full_name text, p_avatar_url text)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
      UPDATE public.profiles
      SET
        full_name = p_full_name,
        avatar_url = p_avatar_url,
        updated_at = now()
      WHERE id = auth.uid();
    END;
    $$;

    -- 8. Grant execute permission to the authenticated role
    GRANT EXECUTE ON FUNCTION public.update_user_profile(text, text) TO authenticated;
