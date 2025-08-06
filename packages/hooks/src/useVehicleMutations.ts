import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleFormValues } from '@directdrive/core-types';

const supabase = getSupabase();

const createVehicleListing = async (formData: VehicleFormValues) => {
  const { data, error } = await supabase.rpc('create_vehicle_listing_atomic', {
    p_user_id: (await supabase.auth.getUser()).data.user?.id!,
    p_vehicle_main_id: 1, // This likely needs to be determined dynamically
    p_price: formData.price,
    p_mileage: formData.mileage,
    p_vin: formData.vin,
    p_description: formData.description,
    p_images: formData.images,
    // We now handle the case where feature_ids might be undefined from the form.
    p_feature_ids: formData.feature_ids || [],
  });
  if (error) throw error;
  return data;
};

export const useCreateVehicleListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicleListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  });
};

const updateVehicleListing = async (formData: VehicleFormValues) => {
  if (!formData.id) throw new Error('Listing ID is required for updates.');

  const { data, error } = await supabase.rpc('update_vehicle_listing_atomic', {
    p_listing_id: formData.id,
    p_price: formData.price,
    p_mileage: formData.mileage,
    p_description: formData.description,
    p_is_sold: false,
    p_images: formData.images,
    // We also handle the undefined case here for updates.
    p_feature_ids: formData.feature_ids || [],
  });

  if (error) throw error;
  return data;
};

export const useUpdateVehicleListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicleListing,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
  });
};
