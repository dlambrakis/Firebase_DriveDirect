import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { Database } from '@directdrive/core-types';

type VehicleVariant = Database['public']['Tables']['vehicle_variants']['Row'];
export type SimpleVariant = { id: number; name: string };

export interface VariantFilters {
  modelId?: number;
  year?: number;
  bodyTypeId?: number;
  transmissionTypeId?: number;
  fuelTypeId?: number;
  drivetrainId?: number;
  engineSizeId?: number;
  aspirationId?: number;
  doorId?: number;
}

export const useFilteredVariants = (filters: VariantFilters) => {
  const supabase = getSupabase();

  return useQuery<SimpleVariant[], Error>({
    queryKey: ['filtered_variants', filters],
    queryFn: async () => {
      if (!filters.modelId) {
        return [];
      }

      const { data, error } = await supabase.rpc('get_filtered_variants', {
        p_model_id: filters.modelId,
        p_year: filters.year,
        p_body_type_id: filters.bodyTypeId,
        p_transmission_type_id: filters.transmissionTypeId,
        p_fuel_type_id: filters.fuelTypeId,
        p_drivetrain_id: filters.drivetrainId,
        p_engine_size_id: filters.engineSizeId,
        p_aspiration_id: filters.aspirationId,
        p_door_id: filters.doorId,
      });

      if (error) {
        console.error('Error fetching filtered variants:', error);
        throw error;
      }

      const variants = data as any as VehicleVariant[];

      return (variants || []).map((v) => ({
        id: v.variant_id,
        name: v.variant,
      }));
    },
    enabled: !!filters.modelId,
  });
};
