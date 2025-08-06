import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { useAuth } from './useAuth';
import { VehicleListingDetailed } from '@directdrive/core-types';

/**
 * Fetches all vehicle listings created by the currently authenticated user.
 */
export const useUserListings = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const userId = user?.id;

  const fetchUserListings = async () => {
    if (!userId) return [];

    const { data, error } = await supabase.rpc('get_user_listings', { p_user_id: userId });

    if (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }

    return (data || []) as VehicleListingDetailed[];
  };

  return useQuery<VehicleListingDetailed[], Error>({
    queryKey: ['userListings', userId],
    queryFn: fetchUserListings,
    enabled: !!userId,
  });
};
