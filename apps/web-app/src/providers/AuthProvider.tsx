import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Profile, TypedSupabaseClient } from '@directdrive/core-types';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@directdrive/supabase-client/singleton';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
  supabase: TypedSupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state (session, user, profile) to its children components.
 * It handles fetching the user's profile and managing the loading state.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The onAuthStateChange listener is the single source of truth.
    // It fires once on initial load and again whenever the auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // If a user is logged in, fetch their profile from the database.
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        } else {
          setProfile(userProfile);
        }
      } else {
        // If the user is logged out, clear their profile.
        setProfile(null);
      }
      setLoading(false);
    });

    // The cleanup function unsubscribes from the listener when the component unmounts.
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = { session, user, profile, loading, logout, supabase };

  // Display a full-screen spinner only during the initial authentication check.
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook to easily access the authentication context from any component
 * wrapped in an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
