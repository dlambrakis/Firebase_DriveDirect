import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleFeature } from '@directdrive/core-types';

export const useVehicleFeatures = () => {
  return useQuery<VehicleFeature[], Error>({
    queryKey: ['features'],
    queryFn: async () => {
      const supabase = getSupabase();
      // Corrected to use the standard supabase.rpc call and handle the response.
      const { data, error } = await supabase.rpc('get_features');

      if (error) {
        console.error('Error fetching vehicle features:', error);
        throw new Error(error.message);
      }

      return (data || []) as VehicleFeature[];
    },
  });
};
