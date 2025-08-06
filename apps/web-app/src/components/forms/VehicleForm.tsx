import React, { useRef } from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { useVehicleFormLogic } from '@directdrive/hooks';
import { VehicleFormValues } from '@directdrive/core-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Textarea,
  Checkbox,
} from '@directdrive/ui';
import { ImageUpload, ImageUploadRef } from '../ImageUpload';

// Define a generic type for select options for reusability
type SelectOption = {
  id: number | string;
  name: string | number;
};

// Create a fully type-safe generic FormSelect component
interface FormSelectProps<T extends VehicleFormValues> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder: string;
  options?: SelectOption[];
  isLoading: boolean;
  disabled?: boolean;
  error?: FieldError;
}

const FormSelect = <T extends VehicleFormValues>({
  control,
  name,
  label,
  placeholder,
  options,
  isLoading,
  disabled = false,
  error,
}: FormSelectProps<T>) => (
  <div className="space-y-2">
    <Label htmlFor={name as string}>{label}</Label>
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => (
        <Select
          onValueChange={(value: string) => {
            const parsedValue = parseInt(value, 10);
            field.onChange(isNaN(parsedValue) ? value : parsedValue);
          }}
          value={field.value ? String(field.value) : ''}
          disabled={disabled || isLoading}
        >
          <SelectTrigger id={name as string}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              options?.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);

interface VehicleFormProps {
  onSubmit: (
    data: VehicleFormValues,
    newImages: File[],
    deletedImageUrls: string[]
  ) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<VehicleFormValues>;
  existingImageUrls?: string[];
  submitButtonText?: string;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  existingImageUrls = [],
  submitButtonText = 'Create Listing',
}) => {
  const {
    form,
    makes,
    isLoadingMakes,
    models,
    isLoadingModels,
    years,
    isLoadingYears,
    features,
    isLoadingFeatures,
    variantOptions,
    isLoadingVariants,
    attributesDisabled,
  } = useVehicleFormLogic({ defaultValues });

  const { control, handleSubmit, formState: { errors }, watch } = form;
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const handleFormSubmit = (data: VehicleFormValues) => {
    if (imageUploadRef.current) {
      const isImagesValid = imageUploadRef.current.validate();
      if (!isImagesValid) {
        return;
      }
      const { newFiles, deletedUrls } = imageUploadRef.current.getImageState();
      onSubmit(data, newFiles, deletedUrls);
    } else {
      onSubmit(data, [], []);
    }
  };

  const isEditMode = !!defaultValues;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Your Vehicle' : 'List Your Vehicle'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Update the details of your vehicle listing.'
            : 'Fill out the details below to put your car on the market.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                name="make_id"
                label="Make"
                placeholder="Select Make"
                control={control}
                options={makes}
                isLoading={isLoadingMakes}
                error={errors.make_id}
                disabled={isEditMode}
              />
              <FormSelect
                name="model_id"
                label="Model"
                placeholder="Select Model"
                control={control}
                options={models}
                isLoading={isLoadingModels}
                disabled={!watch('make_id') || isEditMode}
                error={errors.model_id}
              />
              <FormSelect
                name="year"
                label="Year"
                placeholder="Select Year"
                control={control}
                options={years?.map((y) => ({ id: y.year, name: y.year }))}
                isLoading={isLoadingYears}
                disabled={!watch('model_id') || isEditMode}
                error={errors.year}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Listing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ZAR)</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 450000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 89000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                {errors.mileage && (
                  <p className="text-sm text-red-500">{errors.mileage.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
              <Controller
                name="vin"
                control={control}
                render={({ field }) => (
                  <Input id="vin" placeholder="17-character VIN" {...field} />
                )}
              />
              {errors.vin && (
                <p className="text-sm text-red-500">{errors.vin.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Add a detailed description of your vehicle..."
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Attributes</h3>
            <p className="text-sm text-muted-foreground">
              {isEditMode
                ? 'These attributes are based on the vehicle model and cannot be changed.'
                : 'Select the make, model, and year to enable these options.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Add other FormSelect components for variant options here */}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Features</h3>
            <Controller
              name="feature_ids"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {isLoadingFeatures ? (
                    <p>Loading features...</p>
                  ) : (
                    features?.map((feature) => (
                      <div
                        key={feature.feature_id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`feature-${feature.feature_id}`}
                          checked={field.value?.includes(feature.feature_id)}
                          onCheckedChange={(checked) => {
                            const currentIds = field.value || [];
                            if (checked) {
                              field.onChange([
                                ...currentIds,
                                feature.feature_id,
                              ]);
                            } else {
                              field.onChange(
                                currentIds.filter(
                                  (id) => id !== feature.feature_id
                                )
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`feature-${feature.feature_id}`}
                          className="font-normal"
                        >
                          {feature.feature_name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              )}
            />
            {errors.feature_ids && (
              <p className="text-sm text-red-500">
                {errors.feature_ids.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Images</h3>
            <ImageUpload
              ref={imageUploadRef}
              existingImageUrls={existingImageUrls}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
