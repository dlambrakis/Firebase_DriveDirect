import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { useAuth } from './useAuth';

interface ToggleSaveVehiclePayload {
  listingId: number;
  isSaved: boolean;
}

const toggleSaveVehicle = async ({ listingId, isSaved }: ToggleSaveVehiclePayload) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated.');
  }

  if (isSaved) {
    // If currently saved, unsave it (delete from saved_vehicles)
    const { error } = await supabase
      .from('saved_vehicles')
      .delete()
      .eq('listing_id', listingId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error unsaving vehicle:', error);
      throw new Error(error.message);
    }
  } else {
    // If not saved, save it (insert into saved_vehicles)
    const { error } = await supabase
      .from('saved_vehicles')
      .insert({ listing_id: listingId, user_id: user.id });

    if (error) {
      console.error('Error saving vehicle:', error);
      throw new Error(error.message);
    }
  }
  return true; // Indicate success
};

export const useToggleSaveVehicle = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: toggleSaveVehicle,
    onSuccess: () => {
      // Invalidate queries to refetch saved status
      queryClient.invalidateQueries({ queryKey: ['fetchSavedVehicleListings', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['vehicleDetails'] });
    },
  });
};
