import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleVariant } from '@directdrive/core-types';

const supabase = getSupabase();

const fetchVehicleVariants = async (makeIds: string[], modelIds: string[]): Promise<VehicleVariant[]> => {
  if (!makeIds.length || !modelIds.length) {
    return [];
  }

  const { data, error } = await supabase.rpc('get_variants_by_make_and_model_ids', {
    p_make_ids: makeIds.map(Number),
    p_model_ids: modelIds.map(Number),
  });

  if (error) {
    console.error('Error fetching vehicle variants:', error);
    throw new Error(error.message);
  }

  // The RPC function is assumed to return the full VehicleVariant object now.
  // If it still doesn't, you may need to adjust the RPC function itself in Supabase.
  return (data || []) as VehicleVariant[];
};

export const useVehicleVariantsByMakesAndModels = (makeIds: string[], modelIds: string[]) => {
  return useQuery<VehicleVariant[], Error>({
    queryKey: ['vehicleVariants', makeIds, modelIds],
    queryFn: () => fetchVehicleVariants(makeIds, modelIds),
    enabled: makeIds.length > 0 && modelIds.length > 0,
  });
};
