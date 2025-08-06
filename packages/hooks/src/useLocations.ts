import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

const supabase = getSupabase();

type LocationType = 'provinces' | 'cities' | 'suburbs';

const fetchLocations = async (
  locationType: LocationType,
  parentId?: number | null
) => {
  let query = supabase.from(locationType).select('id, name');

  if (parentId) {
    if (locationType === 'cities') {
      query = query.eq('province_id', parentId);
    } else if (locationType === 'suburbs') {
      query = query.eq('city_id', parentId);
    }
  }

  const { data, error } = await query.order('name');
  if (error) throw new Error(error.message);
  return data || [];
};

export const useLocations = (
  locationType: LocationType,
  parentId?: number | null
) => {
  return useQuery({
    queryKey: [locationType, parentId],
    queryFn: () => fetchLocations(locationType, parentId),
    enabled: locationType === 'provinces' || !!parentId, // Enable for provinces, or for others if parentId exists
  });
};
