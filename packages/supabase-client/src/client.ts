import { createClient } from '@supabase/supabase-js';
import { Database, TypedSupabaseClient } from '@directdrive/core-types';

/**
 * Creates a new Supabase client instance.
 * This function is intended to be used by the singleton initializer.
 * @param supabaseUrl The Supabase project URL.
 * @param supabaseAnonKey The Supabase project anon key.
 */
export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseAnonKey: string
): TypedSupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key was not provided during client creation.');
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
