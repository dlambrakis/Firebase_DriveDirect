import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormValues } from '@directdrive/core-types';
import { useProfile } from './useProfile';
import { useUpdateProfile } from './useUpdateProfile';
import { useLocations } from './useLocations';

export const useProfileFormLogic = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // Default values now perfectly match the Zod schema
    defaultValues: {
      display_name: '',
      first_name: '',
      last_name: '',
      contact_number: '',
      location_type: null,
      residential_type: null,
      complex_or_estate_name: null,
      unit_number: null,
      street_number: '',
      street_name: '',
      province_id: undefined,
      city_id: undefined,
      suburb_id: undefined,
      postcode: '',
    },
  });

  useEffect(() => {
    if (profile) {
      const profileData = { ...profile };
      for (const key in profileData) {
        if (profileData[key as keyof typeof profileData] === null) {
          (profileData as any)[key] = '';
        }
      }
      form.reset(profileData as any);
    }
  }, [profile, form]);

  const provinceId = form.watch('province_id');
  const cityId = form.watch('city_id');

  const { data: provinces, isLoading: isLoadingProvinces } = useLocations('provinces');
  const { data: cities, isLoading: isLoadingCities } = useLocations('cities', provinceId);
  const { data: suburbs, isLoading: isLoadingSuburbs } = useLocations('suburbs', cityId);

  const onSubmit = (
    data: ProfileFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    updateProfile(data, {
      onSuccess,
      onError,
    });
  };

  return {
    form,
    onSubmit,
    isUpdating,
    isLoadingProfile,
    provinces,
    isLoadingProvinces,
    cities,
    isLoadingCities,
    suburbs,
    isLoadingSuburbs,
  };
};
