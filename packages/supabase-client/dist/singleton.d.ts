import { TypedSupabaseClient } from '@directdrive/core-types';

/**
 * Initializes the Supabase client singleton.
 * This must be called once at the very start of your application.
 * @param supabaseUrl The Supabase project URL.
 * @param supabaseAnonKey The Supabase project anon key.
 */
declare const initializeSupabaseSingleton: (supabaseUrl: string, supabaseAnonKey: string) => TypedSupabaseClient;
/**
 * Retrieves the singleton instance of the Supabase client.
 * Throws an error if the client has not been initialized first.
 */
declare const getSupabase: () => TypedSupabaseClient;

export { getSupabase, initializeSupabaseSingleton };
