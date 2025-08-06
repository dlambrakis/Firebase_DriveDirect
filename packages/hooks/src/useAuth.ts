import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Note: The module-level 'getSupabase()' call has been removed.

const getSession = async () => {
  // Get the Supabase client inside the async function, ensuring it's initialized.
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: session, isLoading, isError } = useQuery<Session | null>({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    // Get the client inside the effect, after the component has mounted.
    const supabase = getSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        queryClient.setQueryData(['session'], session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const user = useMemo(() => session?.user ?? null, [session]);

  return {
    session,
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
  };
};
