import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleWithImages } from '@directdrive/core-types';

const fetchSavedVehicleListings = async (userId: string | undefined) => {
  if (!userId) {
    return { listings: [], savedSet: new Set<number>() };
  }

  const supabase = getSupabase();

  // Step 1: Get the IDs of saved listings
  const { data: savedData, error: savedError } = await supabase
    .from('saved_vehicles')
    .select('listing_id')
    .eq('user_id', userId);

  if (savedError) {
    console.error('Error fetching saved vehicle IDs:', savedError);
    throw new Error(savedError.message);
  }

  if (!savedData || savedData.length === 0) {
    return { listings: [], savedSet: new Set<number>() };
  }

  const listingIds = savedData.map(item => item.listing_id);

  // Step 2: Fetch the full vehicle listings using the IDs, joining related tables.
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicle_listings')
    .select(`
      listing_id,
      price,
      mileage,
      year,
      description,
      is_sold,
      created_at,
      province_id,
      images:vehicle_images(image_url),
      make:vehicle_makes(name),
      model:vehicle_models(name),
      variant:vehicle_variants(name),
      body_type:vehicle_body_types(name),
      transmission:vehicle_transmissions(name),
      fuel_type:vehicle_fuel_types(name),
      location:provinces(name)
    `)
    .in('listing_id', listingIds);

  if (vehicleError) {
    console.error('Error fetching saved vehicles:', vehicleError);
    throw new Error(vehicleError.message);
  }

  if (!vehicleData) {
    return { listings: [], savedSet: new Set<number>() };
  }

  // Step 3: Transform the nested data to match the flat VehicleWithImages type
  const listings: VehicleWithImages[] = vehicleData.map((v: any) => ({
    ...v,
    images: v.images ? v.images.map((img: { image_url: string }) => img.image_url) : [],
    make: v.make?.name,
    model: v.model?.name,
    variant: v.variant?.name,
    body_type: v.body_type?.name,
    transmission: v.transmission?.name,
    fuel_type: v.fuel_type?.name,
    location: v.location?.name,
  }));
    
  const savedSet = new Set<number>(listingIds);

  return { listings, savedSet };
};

export const useFetchSavedVehicleListings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['fetchSavedVehicleListings', userId],
    queryFn: () => fetchSavedVehicleListings(userId),
    enabled: !!userId,
    select: (data) => data.savedSet, // Only return the set for the VehicleCard use case
  });
};

export const useFetchFullSavedListings = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['fetchSavedVehicleListings', userId],
      queryFn: () => fetchSavedVehicleListings(userId),
      enabled: !!userId,
      select: (data) => data.listings, // Return the full listings for pages like "My Saved Vehicles"
    });
  };
