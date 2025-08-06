import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleLookup } from '@directdrive/core-types';

type VehicleOptionType = 'make' | 'body_type' | 'fuel_type' | 'transmission_type' | 'drivetrain';

// This mapping is still useful for normalizing the data after the query.
const optionTypeToColumnMapping: Record<VehicleOptionType, { idColumn: string; nameColumn: string }> = {
  make: { idColumn: 'make_id', nameColumn: 'make' },
  body_type: { idColumn: 'body_type_id', nameColumn: 'body_type' },
  fuel_type: { idColumn: 'fuel_type_id', nameColumn: 'fuel_type' },
  transmission_type: { idColumn: 'transmission_type_id', nameColumn: 'transmission_type' },
  drivetrain: { idColumn: 'drivetrain_id', nameColumn: 'drivetrain' },
};

/**
 * Fetches vehicle lookup options.
 * This has been refactored to use a switch statement to avoid the TS2769 error,
 * ensuring that supabase.from() is called with a string literal.
 */
export const useVehicleOptions = (optionType: VehicleOptionType) => {
  return useQuery<VehicleLookup[], Error>({
    queryKey: ['vehicleOptions', optionType],
    queryFn: async () => {
      const supabase = getSupabase();
      const { idColumn, nameColumn } = optionTypeToColumnMapping[optionType];
      let query;

      // A switch statement is used to ensure TypeScript can verify the table name literal.
      switch (optionType) {
        case 'make':
          query = supabase.from('vehicle_makes').select(`${idColumn}, ${nameColumn}`);
          break;
        case 'body_type':
          query = supabase.from('vehicle_body_types').select(`${idColumn}, ${nameColumn}`);
          break;
        case 'fuel_type':
          query = supabase.from('vehicle_fuel_types').select(`${idColumn}, ${nameColumn}`);
          break;
        case 'transmission_type':
          query = supabase.from('vehicle_transmission_types').select(`${idColumn}, ${nameColumn}`);
          break;
        case 'drivetrain':
          query = supabase.from('vehicle_drivetrains').select(`${idColumn}, ${nameColumn}`);
          break;
        default:
          // This case should be unreachable with TypeScript, but it's good practice.
          throw new Error(`Invalid vehicle option type: ${optionType}`);
      }

      const { data, error } = await query.eq('is_active', true);

      if (error) {
        throw new Error(error.message);
      }

      // Normalize the data to the VehicleLookup type.
      return data.map((item: any) => ({
        id: item[idColumn],
        name: item[nameColumn],
      }));
    },
  });
};
