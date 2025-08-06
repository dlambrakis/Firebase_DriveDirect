import { SupabaseClient } from '@supabase/supabase-js';
// Import 'Json' alongside 'Database' from the generated file.
import type { Database, Json } from './database.types';

// Re-export 'Json' alongside 'Database' so other files can use it.
export type { Database, Json };

// This is the correctly typed Supabase client.
export type TypedSupabaseClient = SupabaseClient<Database>;

// --- HELPER TYPES ---
export type Tables<
  T extends keyof (Database['public']['Tables'] & Database['public']['Views'])
> = (Database['public']['Tables'] & Database['public']['Views'])[T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type Functions = Database['public']['Functions'];
