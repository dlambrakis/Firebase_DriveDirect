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

// src/rpc.ts
var callRpc = async (functionName, params) => {
  const supabase2 = getSupabase();
  const { data, error } = await supabase2.rpc(
    functionName,
    params
  );
  if (error) {
    console.error(`Error calling RPC function "${String(functionName)}":`, error);
    throw new Error(error.message);
  }
  return data;
};
export {
  callRpc,
  createSupabaseClient,
  getSupabase,
  initializeSupabaseSingleton
};
//# sourceMappingURL=index.mjs.map