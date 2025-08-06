// src/provider.tsx
import {
  createContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { getSupabase } from "@directdrive/supabase-client";
import { jsx } from "react/jsx-runtime";
var AuthContext = createContext(
  void 0
);
var AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();
  useEffect(() => {
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
  const value = useMemo(
    () => ({
      session,
      user,
      loading
    }),
    [session, user, loading]
  );
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};

// src/hook.ts
import { useContext } from "react";
var useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthProvider,
  useAuth
};
