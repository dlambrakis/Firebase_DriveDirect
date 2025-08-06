import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

export const useVehicleYearsForModel = (modelId: number | null, enabled: boolean = true) => {
  const supabase = getSupabase();

  return useQuery({
    queryKey: ['vehicleYearsForModel', modelId],
    queryFn: async () => {
      if (!modelId) return [];

      const { data, error } = await supabase.rpc('get_vehicle_years_for_model', {
        p_model_id: modelId,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // Use optional chaining (?.) and a fallback to an empty array
      return data?.map((item: { year: number }) => item.year) || [];
    },
    enabled: !!modelId && enabled,
  });
};
