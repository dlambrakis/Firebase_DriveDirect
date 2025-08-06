import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleLookup } from '@directdrive/core-types';

export const useVehicleModelsByMakes = (makeIds: string[] | undefined) => {
  const supabase = getSupabase();

  const integerMakeIds = makeIds?.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  return useQuery<VehicleLookup[], Error>({
    queryKey: ['vehicle_models_by_makes', integerMakeIds],
    queryFn: async () => {
      if (!integerMakeIds || integerMakeIds.length === 0) {
        return [];
      }
      const { data, error } = await supabase.rpc('get_models_by_make_ids', {
        p_make_ids: integerMakeIds,
      });

      if (error) {
        console.error('Error fetching models by makes:', error);
        throw error;
      }

      // The RPC returns { model_id, model }, so we map it to { id, name }
      return (data || []).map((m: { model_id: number, model: string }) => ({
        id: m.model_id,
        name: m.model,
      }));
    },
    enabled: !!integerMakeIds && integerMakeIds.length > 0,
  });
};
