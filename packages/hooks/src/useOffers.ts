import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { Offer } from '@directdrive/core-types';

export const useOffers = (listingId: number | undefined) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['offers', listingId],
    queryFn: async (): Promise<Offer[]> => {
      if (!supabase || !listingId) return [];
      
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase && !!listingId,
  });
};
