import { z } from 'zod';

/**
 * Defines the validation schema for the user profile form.
 */
export const profileFormSchema = z.object({
  display_name: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  contact_number: z.string().nullable().optional(),
  location_type: z.string().nullable().optional(),
  residential_type: z.string().nullable().optional(),
  complex_or_estate_name: z.string().nullable().optional(),
  unit_number: z.string().nullable().optional(),
  street_number: z.string().nullable().optional(),
  street_name: z.string().nullable().optional(),
  postcode: z.string().nullable().optional(),
  province_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  suburb_id: z.coerce.number().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/**
 * Defines the validation schema for the vehicle creation/editing form.
 */
export const vehicleFormSchema = z.object({
  id: z.number().optional(),
  make_id: z.number({ required_error: 'Make is required.' }),
  model_id: z.number({ required_error: 'Model is required.' }),
  year: z.number({ required_error: 'Year is required.' }),
  price: z.number({ required_error: 'Price is required.' }).positive(),
  mileage: z.number({ required_error: 'Mileage is required.' }).nonnegative(),
  vin: z.string().min(1, 'VIN is required.'),
  description: z.string().min(1, 'Description is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
  // By making the field purely optional, its inferred type becomes `number[] | undefined`,
  // which correctly matches the reality of react-hook-form's partial default values.
  feature_ids: z.array(z.number()).optional(),
  body_type_id: z.number().nullable().optional(),
  drivetrain_id: z.number().nullable().optional(),
  fuel_type_id: z.number().nullable().optional(),
  transmission_type_id: z.number().nullable().optional(),
  engine_size_id: z.number().nullable().optional(),
  aspiration_id: z.number().nullable().optional(),
  doors_id: z.number().nullable().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

/**
 * Defines the shape of the options returned for vehicle variants.
 */
const VariantOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type VehicleVariantOptions = {
  body_types: z.infer<typeof VariantOptionSchema>[];
  drivetrains: z.infer<typeof VariantOptionSchema>[];
  fuel_types: z.infer<typeof VariantOptionSchema>[];
  transmission_types: z.infer<typeof VariantOptionSchema>[];
  engine_sizes: z.infer<typeof VariantOptionSchema>[];
  aspirations: z.infer<typeof VariantOptionSchema>[];
  doors: z.infer<typeof VariantOptionSchema>[];
};
