import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

export type SimpleAttribute = { id: number; name: string };

type RpcFunctionNames =
  | 'get_aspirations_for_model_and_year'
  | 'get_drivetrains_for_model_and_year'
  | 'get_fuel_types_for_model_and_year'
  | 'get_transmission_types_for_model_and_year'
  | 'get_body_types_for_model_and_year';

export const useVehicleAttribute = (
  attributeNamePlural: string,
  attributeNameSingular: string,
  modelId: number | undefined,
  year: number | undefined
) => {
  const supabase = getSupabase();
  const rpcName = `get_${attributeNamePlural}_for_model_and_year` as RpcFunctionNames;
  const idKey = `${attributeNameSingular}_id`;
  const nameKey = attributeNameSingular;

  return useQuery<SimpleAttribute[], Error>({
    queryKey: [`vehicle_${attributeNamePlural}`, modelId, year],
    queryFn: async () => {
      if (!modelId || !year) return [];
      const { data, error } = await supabase.rpc(rpcName, {
        p_model_id: modelId,
        p_year: year,
      });
      if (error) throw error;

      const items = data as any[];
      return (items || []).map((item) => ({
        id: item[idKey],
        name: item[nameKey],
      }));
    },
    enabled: !!modelId && !!year,
  });
};
