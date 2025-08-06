import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleLookup } from '@directdrive/core-types';

export const useVehicleModels = (makeId: number | undefined) => {
  const supabase = getSupabase();

  return useQuery<VehicleLookup[], Error>({
    queryKey: ['vehicle_models', makeId],
    queryFn: async () => {
      if (!makeId) return [];
      const { data, error } = await supabase.rpc('get_vehicle_models_by_make', {
        p_make_id: makeId,
      });
      if (error) throw error;
      return (data || []).map((m: { model_id: number; model: string }) => ({
        id: m.model_id,
        name: m.model,
      }));
    },
    enabled: !!makeId,
  });
};
