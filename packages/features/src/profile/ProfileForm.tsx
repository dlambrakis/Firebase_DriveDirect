import React from 'react';
import type { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { ProfileFormValues } from '@directdrive/core-types';

// Define the props for the individual form field components that will be passed in
type InputProps = { name: any; label: string; control: Control<ProfileFormValues>; error?: any; [key: string]: any };
type SelectProps = { name: any; label: string; control: Control<ProfileFormValues>; error?: any; options: any[]; placeholder: string; isLoading: boolean; disabled: boolean; };

// Define the props for the shared ProfileForm component
interface ProfileFormProps {
  // Platform-specific components for rendering UI elements
  InputComponent: React.FC<InputProps>;
  SelectComponent: React.FC<SelectProps>;
  
  // Platform-specific components for layout
  GridWrapper: React.ElementType<{ children: React.ReactNode }>;
  CountryInput?: React.ElementType; // Optional: for web's read-only country input

  // Data and form control from the parent hook
  control: Control<ProfileFormValues>;
  watch: UseFormWatch<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  
  // Location data
  provinces: any[];
  isLoadingProvinces: boolean;
  cities: any[];
  isLoadingCities: boolean;
  suburbs: any[];
  isLoadingSuburbs: boolean;
}

const locationTypes = ['Urban', 'Rural', 'Suburban'];
const residentialTypes = ['House', 'Apartment', 'Complex', 'Estate'];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  InputComponent,
  SelectComponent,
  GridWrapper,
  CountryInput,
  control,
  watch,
  errors,
  provinces,
  isLoadingProvinces,
  cities,
  isLoadingCities,
  suburbs,
  isLoadingSuburbs,
}) => {
  const residentialType = watch('residential_type');
  const provinceId = watch('province_id');
  const cityId = watch('city_id');

  return (
    <GridWrapper>
      <SelectComponent name="location_type" label="Location Type" control={control} error={errors.location_type} options={locationTypes.map(t => ({ value: t, label: t }))} placeholder="Select type..." isLoading={false} disabled={false} />
      <SelectComponent name="residential_type" label="Residential Type" control={control} error={errors.residential_type} options={residentialTypes.map(t => ({ value: t, label: t }))} placeholder="Select type..." isLoading={false} disabled={false} />
      {(residentialType === 'Complex' || residentialType === 'Estate') && (
        <>
          <InputComponent name="complex_or_estate_name" label="Complex/Estate Name" control={control} error={errors.complex_or_estate_name} />
          <InputComponent name="unit_number" label="Unit Number" control={control} error={errors.unit_number} />
        </>
      )}
      <InputComponent name="street_number" label="Street Number" control={control} error={errors.street_number} />
      <InputComponent name="street_name" label="Street Name" control={control} error={errors.street_name} />
      <SelectComponent name="province_id" label="Province" control={control} error={errors.province_id} options={provinces} placeholder="Select province..." isLoading={isLoadingProvinces} disabled={false} />
      <SelectComponent name="city_id" label="City" control={control} error={errors.city_id} options={cities} placeholder="Select city..." isLoading={isLoadingCities} disabled={!provinceId} />
      <SelectComponent name="suburb_id" label="Suburb" control={control} error={errors.suburb_id} options={suburbs} placeholder="Select suburb..." isLoading={isLoadingSuburbs} disabled={!cityId} />
      {CountryInput ? <CountryInput /> : null}
      <InputComponent name="postcode" label="Postcode" control={control} error={errors.postcode} />
    </GridWrapper>
  );
};
