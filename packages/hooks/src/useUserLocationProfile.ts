import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { Profile } from '@directdrive/core-types';

interface UserLocationProfile extends Profile {
  province_name: string | null;
}

export const useUserLocationProfile = (userId: string | undefined) => {
  const supabase = useSupabase();

  const fetchUserProfile = async (): Promise<UserLocationProfile | null> => {
    if (!supabase || !userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        provinces (name)
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // 'PGRST116' means no rows found, which is not an error here
      throw error;
    }

    if (!data) {
      return null;
    }

    const province_name = data.provinces?.name ?? null;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { provinces, ...rest } = data;

    return { ...rest, province_name };
  };

  return useQuery<UserLocationProfile | null, Error>({
    queryKey: ['userLocationProfile', userId],
    queryFn: fetchUserProfile,
    enabled: !!supabase && !!userId,
  });
};
