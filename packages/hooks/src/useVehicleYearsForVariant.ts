import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

export const useVehicleYearsForVariant = (variantId: number | null) => {
  const supabase = getSupabase();

  return useQuery({
    queryKey: ['vehicleYearsForVariant', variantId],
    queryFn: async () => {
      if (!variantId) return [];

      const { data, error } = await supabase.rpc('get_vehicle_years_for_variant', {
        p_variant_id: variantId,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // Use optional chaining (?.) and a fallback to an empty array
      return data?.map((item: { year: number }) => item.year) || [];
    },
    enabled: !!variantId,
  });
};
