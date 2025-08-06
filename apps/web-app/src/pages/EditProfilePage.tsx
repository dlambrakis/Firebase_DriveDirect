import React from 'react';
import { Controller, Control, FieldError, UseFormWatch } from 'react-hook-form';
import { useAuth, useProfileFormLogic } from '@directdrive/hooks';
import { ProfileFormValues } from '@directdrive/core-types';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  useToast,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@directdrive/ui';

// --- Type-Safe Form Components ---

type SelectOption = { id: number | string; name: string | number };

interface FormInputProps {
  name: keyof ProfileFormValues;
  label: string;
  control: Control<ProfileFormValues>;
  error?: FieldError;
  [key: string]: any; // For other input props like 'type', 'placeholder'
}

const FormInput: React.FC<FormInputProps> = ({ name, label, control, error, ...props }) => (
  <div>
    <Label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-2">
      {label}
    </Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input id={name} {...field} {...props} value={field.value ?? ''} />
      )}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
  </div>
);

interface FormSelectProps {
  name: keyof ProfileFormValues;
  label: string;
  control: Control<ProfileFormValues>;
  error?: FieldError;
  options?: SelectOption[];
  placeholder: string;
  isLoading: boolean;
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({ name, label, control, error, options, placeholder, isLoading, disabled }) => (
  <div>
    <Label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-2">
      {label}
    </Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : null)}
          value={field.value ? String(field.value) : ''}
          disabled={disabled || isLoading}
        >
          <SelectTrigger id={name}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              options?.map((opt) => (
                <SelectItem key={opt.id} value={String(opt.id)}>
                  {opt.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
  </div>
);

// --- Main Page Component ---

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
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
  } = useProfileFormLogic();

  const { control, handleSubmit, watch, formState: { errors } } = form;

  const handleFormSubmit = (data: ProfileFormValues) => {
    onSubmit(
      data,
      () => toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' }),
      (error) => toast({ title: 'Error', description: `Failed to update profile: ${error.message}`, variant: 'destructive' })
    );
  };

  if (isLoadingProfile) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput name="display_name" label="Display Name" control={control} error={errors.display_name} />
            <FormInput name="first_name" label="First Name" control={control} error={errors.first_name} />
            <FormInput name="last_name" label="Last Name" control={control} error={errors.last_name} />
            <FormInput name="contact_number" label="Contact Number" control={control} error={errors.contact_number} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect name="location_type" label="Location Type" control={control} error={errors.location_type} options={[{id: 'Residential', name: 'Residential'}, {id: 'Commercial', name: 'Commercial'}]} placeholder="Select location type" isLoading={false} />
                <FormSelect name="residential_type" label="Residential Type" control={control} error={errors.residential_type} options={[{id: 'Free Standing', name: 'Free Standing'}, {id: 'Complex', name: 'Complex'}, {id: 'Estate', name: 'Estate'}]} placeholder="Select residential type" isLoading={false} />
             </div>
             <FormInput name="complex_or_estate_name" label="Complex or Estate Name" control={control} error={errors.complex_or_estate_name} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="unit_number" label="Unit Number" control={control} error={errors.unit_number} />
                <FormInput name="street_number" label="Street Number" control={control} error={errors.street_number} />
             </div>
             <FormInput name="street_name" label="Street Name" control={control} error={errors.street_name} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect name="province_id" label="Province" control={control} error={errors.province_id} options={provinces} placeholder="Select province" isLoading={isLoadingProvinces} />
                <FormSelect name="city_id" label="City" control={control} error={errors.city_id} options={cities} placeholder="Select city" isLoading={isLoadingCities} disabled={!watch('province_id')} />
                <FormSelect name="suburb_id" label="Suburb" control={control} error={errors.suburb_id} options={suburbs} placeholder="Select suburb" isLoading={isLoadingSuburbs} disabled={!watch('city_id')} />
                <FormInput name="postcode" label="Postcode" control={control} error={errors.postcode} />
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
