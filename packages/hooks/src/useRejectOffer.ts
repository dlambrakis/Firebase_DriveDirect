import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';

export const useRejectOffer = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: number, listingId: number }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { error } = await supabase
        .from('offers')
        .update({ status: 'REJECTED' })
        .eq('id', offerId);

      if (error) throw error;

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.listingId] });
    },
  });
};
