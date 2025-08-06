import { useQuery } from '@tanstack/react-query';
    import { useSupabase } from './useSupabase';
    import { useAuth } from './useAuth';
    import { Profile } from '@directdrive/core-types';

    /**
     * Fetches the public profile of a specific user.
     * If no userId is provided, it fetches the profile of the currently authenticated user.
     * The query is disabled if no user is specified or authenticated.
     */
    export const useProfile = (userId?: string) => {
      const supabase = useSupabase();
      const { user: authUser } = useAuth();
      const targetUserId = userId || authUser?.id;

      const fetchProfile = async () => {
        if (!targetUserId) return null;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId) // Corrected: Filter by user_id, not id
          .single();

        if (error) {
          // It's common for a profile to not exist initially, so we don't want to throw an error for 404s.
          if (error.code === 'PGRST116') {
            return null;
          }
          console.error('Error fetching profile:', error);
          throw error;
        }

        return data as Profile;
      };

      return useQuery<Profile | null, Error>({
        queryKey: ['profile', targetUserId],
        queryFn: fetchProfile,
        enabled: !!targetUserId,
      });
    };
