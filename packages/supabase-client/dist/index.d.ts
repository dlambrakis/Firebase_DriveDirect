import { TypedSupabaseClient, Database } from '@directdrive/core-types';
export { getSupabase, initializeSupabaseSingleton } from './singleton.js';
export { Session } from '@supabase/supabase-js';

/**
 * Creates a new Supabase client instance.
 * This function is intended to be used by the singleton initializer.
 * @param supabaseUrl The Supabase project URL.
 * @param supabaseAnonKey The Supabase project anon key.
 */
declare const createSupabaseClient: (supabaseUrl: string, supabaseAnonKey: string) => TypedSupabaseClient;

type DbFunctions = Database['public']['Functions'];
declare const callRpc: <T extends keyof DbFunctions>(functionName: T, params: DbFunctions[T]["Args"]) => Promise<DbFunctions[T]["Returns"]>;

export { callRpc, createSupabaseClient };
