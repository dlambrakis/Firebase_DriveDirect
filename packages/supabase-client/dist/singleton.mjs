// src/client.ts
import { createClient } from "@supabase/supabase-js";
var createSupabaseClient = (supabaseUrl, supabaseAnonKey) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key was not provided during client creation.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// src/singleton.ts
var supabase = null;
var initializeSupabaseSingleton = (supabaseUrl, supabaseAnonKey) => {
  if (!supabase) {
    supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};
var getSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase client has not been initialized. Call initializeSupabaseSingleton at app startup.");
  }
  return supabase;
};
export {
  getSupabase,
  initializeSupabaseSingleton
};
//# sourceMappingURL=singleton.mjs.map