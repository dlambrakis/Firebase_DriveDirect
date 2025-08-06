/**
 * This file exports a singleton instance of the Supabase client.
 * By importing from this file, all parts of the application can share the same
 * Supabase client, ensuring consistent authentication state and connection pooling.
 */
import { getSupabase } from '@directdrive/supabase-client/singleton';

export const supabase = getSupabase();
