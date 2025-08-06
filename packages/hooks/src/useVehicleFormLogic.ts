import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import {
  VehicleFormValues,
  vehicleFormSchema,
  Make,
  Model,
  Feature,
  VehicleVariantOptions,
} from '@directdrive/core-types';

const supabase = getSupabase();

// Data Fetching Functions
const fetchMakes = async (): Promise<Make[]> => {
  const { data, error } = await supabase.from('vehicle_makes').select('*').order('make');
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchModels = async (makeId: number): Promise<Model[]> => {
  const { data, error } = await supabase.from('vehicle_models').select('*').eq('make_id', makeId).order('model');
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchYears = async (modelId: number): Promise<{ year: number }[]> => {
  const { data, error } = await supabase.rpc('get_vehicle_years_for_model', { p_model_id: modelId });
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchFeatures = async (): Promise<Feature[]> => {
  const { data, error } = await supabase.from('vehicle_features').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchVariantOptionsForForm = async (modelId: number, year: number): Promise<VehicleVariantOptions> => {
  const { data, error } = await supabase.rpc('get_form_variant_options', {
    p_model_id: modelId,
    p_year: year,
  });
  if (error) throw new Error(error.message);
  return data as VehicleVariantOptions;
};

export const useVehicleFormLogic = ({ defaultValues }: { defaultValues?: Partial<VehicleFormValues> }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      ...defaultValues,
      feature_ids: defaultValues?.feature_ids || [],
    },
  });

  const { watch } = form;
  const makeId = watch('make_id');
  const modelId = watch('model_id');
  const year = watch('year');
  const isEditMode = !!defaultValues?.id;

  // Queries
  const { data: makes, isLoading: isLoadingMakes } = useQuery({ queryKey: ['makes'], queryFn: fetchMakes });
  const { data: models, isLoading: isLoadingModels } = useQuery({ queryKey: ['models', makeId], queryFn: () => fetchModels(makeId!), enabled: !!makeId });
  const { data: years, isLoading: isLoadingYears } = useQuery({ queryKey: ['years', modelId], queryFn: () => fetchYears(modelId!), enabled: !!modelId });
  const { data: features, isLoading: isLoadingFeatures } = useQuery({ queryKey: ['features'], queryFn: fetchFeatures });

  const { data: variantOptions, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['formVariantOptions', modelId, year],
    queryFn: () => fetchVariantOptionsForForm(modelId!, year!),
    enabled: !!modelId && !!year && !isEditMode,
  });

  const attributesDisabled = !modelId || !year;

  return {
    form,
    makes, isLoadingMakes,
    models, isLoadingModels,
    years, isLoadingYears,
    features, isLoadingFeatures,
    variantOptions,
    isLoadingVariants,
    attributesDisabled,
  };
};
