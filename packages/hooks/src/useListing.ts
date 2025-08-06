import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { VehicleListingDetailed } from '@directdrive/core-types';

export const useListing = (listingId: string | undefined) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: async (): Promise<VehicleListingDetailed | null> => {
      if (!supabase || !listingId) {
        return null;
      }

      const parsedId = parseInt(listingId, 10);
      if (isNaN(parsedId)) {
        console.error('Invalid listing ID provided:', listingId);
        return null;
      }

      const { data, error } = await supabase
        .from('vehicle_listings_detailed')
        .select('*')
        .eq('listing_id', parsedId)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }

      return data;
    },
    enabled: !!supabase && !!listingId,
  });
};
