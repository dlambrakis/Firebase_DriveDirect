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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuthProvider: () => AuthProvider,
  useAuth: () => useAuth
});
module.exports = __toCommonJS(src_exports);

// src/provider.tsx
var import_react = require("react");
var import_supabase_client = require("@directdrive/supabase-client");
var import_jsx_runtime = require("react/jsx-runtime");
var AuthContext = (0, import_react.createContext)(
  void 0
);
var AuthProvider = ({ children }) => {
  const [session, setSession] = (0, import_react.useState)(null);
  const [user, setUser] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const supabase = (0, import_supabase_client.getSupabase)();
  (0, import_react.useEffect)(() => {
    const getSession = async () => {
      const {
        data: { session: session2 }
      } = await supabase.auth.getSession();
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session2) => {
        setSession(session2);
        setUser(session2?.user ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  const value = (0, import_react.useMemo)(
    () => ({
      session,
      user,
      loading
    }),
    [session, user, loading]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, { value, children });
};

// src/hook.ts
var import_react2 = require("react");
var useAuth = () => {
  const context = (0, import_react2.useContext)(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthProvider,
  useAuth
});
