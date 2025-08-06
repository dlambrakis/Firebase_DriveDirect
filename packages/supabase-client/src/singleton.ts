import { createSupabaseClient } from './client';
import type { TypedSupabaseClient } from '@directdrive/core-types';

let supabase: TypedSupabaseClient | null = null;

/**
 * Initializes the Supabase client singleton.
 * This must be called once at the very start of your application.
 * @param supabaseUrl The Supabase project URL.
 * @param supabaseAnonKey The Supabase project anon key.
 */
export const initializeSupabaseSingleton = (
  supabaseUrl: string,
  supabaseAnonKey: string
): TypedSupabaseClient => {
  if (!supabase) {
    supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

/**
 * Retrieves the singleton instance of the Supabase client.
 * Throws an error if the client has not been initialized first.
 */
export const getSupabase = (): TypedSupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase client has not been initialized. Call initializeSupabaseSingleton at app startup.');
  }
  return supabase;
};
