"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/singleton.ts
var singleton_exports = {};
__export(singleton_exports, {
  getSupabase: () => getSupabase,
  initializeSupabaseSingleton: () => initializeSupabaseSingleton
});
module.exports = __toCommonJS(singleton_exports);

// src/client.ts
var import_supabase_js = require("@supabase/supabase-js");
var createSupabaseClient = (supabaseUrl, supabaseAnonKey) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key was not provided during client creation.");
  }
  return (0, import_supabase_js.createClient)(supabaseUrl, supabaseAnonKey);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSupabase,
  initializeSupabaseSingleton
});
//# sourceMappingURL=singleton.js.map