import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

export type SimpleMake = { id: number; name: string };

export const useVehicleMakes = () => {
  const supabase = getSupabase();
  return useQuery<SimpleMake[], Error>({
    queryKey: ['vehicle_makes'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_makes');
      if (error) throw error;

      // The RPC returns data in the SimpleMake format directly.
      // The previous mapping was incorrect and caused the runtime error.
      return (data as SimpleMake[]) || [];
    },
  });
};
