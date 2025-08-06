import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { VehicleSearchResult, VehicleFilters } from '@directdrive/core-types';

export const useVehicleSearch = (filters: VehicleFilters) => {
  const supabase = getSupabase();

  const fetchVehicles = async () => {
    // Corrected the RPC function name from 'search_vehicles' to 'search_and_filter_vehicles'
    const { data, error } = await supabase.rpc('search_and_filter_vehicles', {
      p_search_term: filters.searchTerm,
      // Corrected all filter properties to use the plural form (e.g., 'makes' instead of 'make')
      p_makes: filters.makes,
      p_models: filters.models,
      p_locations: filters.locations,
      p_body_types: filters.bodyTypes,
      p_transmissions: filters.transmissions,
      p_fuel_types: filters.fuelTypes,
      p_drivetrains: filters.drivetrains,
      p_engine_sizes: filters.engineSizes,
      p_features: filters.features,
      p_min_year: filters.minYear,
      p_max_year: filters.maxYear,
      p_min_price: filters.minPrice,
      p_max_price: filters.maxPrice,
      p_min_mileage: filters.minMileage,
      p_max_mileage: filters.maxMileage,
      p_page_number: filters.pageNumber,
      p_page_size: filters.pageSize,
      p_sort_by: filters.sortBy,
    });

    if (error) {
      console.error('Error searching vehicles:', error);
      throw new Error(error.message);
    }

    // The RPC function is expected to return an array of results that match the search.
    // We cast it to the correct type.
    return (data || []) as VehicleSearchResult[];
  };

  return useQuery<VehicleSearchResult[], Error>({
    queryKey: ['vehicleSearch', filters],
    queryFn: fetchVehicles,
    placeholderData: keepPreviousData,
  });
};
