import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { useAuth } from './useAuth';
import { ProfileFormValues } from '@directdrive/core-types';

/**
 * Provides a mutation function to update the currently authenticated user's profile.
 * The RPC 'update_user_profile' does not exist; this uses a standard table update.
 */
export const useUpdateProfile = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateProfile = async (profileData: ProfileFormValues) => {
    if (!user?.id) {
      throw new Error('User not authenticated.');
    }

    const { error } = await supabase
      .from('profiles')
      .update(profileData as any) // Using 'as any' to bypass strict type matching on update
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return useMutation<void, Error, ProfileFormValues>({
    mutationFn: updateProfile,
    onSuccess: () => {
      if (user) {
        // Invalidate queries for both 'profile' and 'dashboardData' to reflect changes.
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        queryClient.invalidateQueries({ queryKey: ['dashboardData', user.id] });
      }
    },
  });
};
