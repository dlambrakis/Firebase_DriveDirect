import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleListingDetailed } from '@directdrive/core-types';

// This interface extends the detailed view to include the user-specific 'is_saved' status.
type VehicleDetailsForUser = VehicleListingDetailed & { is_saved: boolean };

const fetchVehicleDetails = async (listingId: number, userId?: string): Promise<VehicleDetailsForUser> => {
  const supabase = getSupabase();

  // 1. Fetch the base vehicle details from the detailed view.
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicle_listings_detailed')
    .select('*')
    .eq('listing_id', listingId)
    .single();

  if (vehicleError) {
    console.error('Error fetching vehicle details:', vehicleError);
    throw new Error(vehicleError.message);
  }

  if (!vehicleData) {
    throw new Error('Vehicle not found.');
  }

  // 2. If a user is logged in, check if they have saved this vehicle.
  let isSaved = false;
  if (userId) {
    const { data: savedData, error: savedError } = await supabase
      .from('saved_vehicles')
      .select('listing_id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (savedError) {
      // Log the error but don't block the main data from returning.
      console.error('Error checking saved vehicle status:', savedError);
    }

    if (savedData) {
      isSaved = true;
    }
  }

  // 3. Combine the data and return.
  return { ...vehicleData, is_saved: isSaved };
};

export const useVehicleDetails = (
  listingId: string | undefined,
  userId?: string,
  options?: Omit<UseQueryOptions<VehicleDetailsForUser, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  const numericListingId = listingId ? parseInt(listingId, 10) : undefined;

  return useQuery<VehicleDetailsForUser, Error>({
    queryKey: ['vehicleDetail', numericListingId, userId],
    queryFn: () => fetchVehicleDetails(numericListingId!, userId),
    enabled: !!numericListingId,
    ...options,
  });
};
