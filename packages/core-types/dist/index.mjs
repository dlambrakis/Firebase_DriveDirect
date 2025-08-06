// src/auth.ts
import { z } from "zod";
var signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long.")
});
var signUpSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// src/constants.ts
var TRANSMISSION_TYPES = ["Automatic", "Manual"];
var FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
var BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van"];
var LOCATION_TYPES = ["Business", "Residential"];
var RESIDENTIAL_TYPES = ["House", "Apartment", "Townhouse", "Complex", "Estate"];

// src/schemas.ts
import { z as z2 } from "zod";
var profileFormSchema = z2.object({
  display_name: z2.string().nullable().optional(),
  first_name: z2.string().nullable().optional(),
  last_name: z2.string().nullable().optional(),
  contact_number: z2.string().nullable().optional(),
  location_type: z2.string().nullable().optional(),
  residential_type: z2.string().nullable().optional(),
  complex_or_estate_name: z2.string().nullable().optional(),
  unit_number: z2.string().nullable().optional(),
  street_number: z2.string().nullable().optional(),
  street_name: z2.string().nullable().optional(),
  postcode: z2.string().nullable().optional(),
  province_id: z2.coerce.number().optional(),
  city_id: z2.coerce.number().optional(),
  suburb_id: z2.coerce.number().optional()
});
var vehicleFormSchema = z2.object({
  id: z2.number().optional(),
  make_id: z2.number({ required_error: "Make is required." }),
  model_id: z2.number({ required_error: "Model is required." }),
  year: z2.number({ required_error: "Year is required." }),
  price: z2.number({ required_error: "Price is required." }).positive(),
  mileage: z2.number({ required_error: "Mileage is required." }).nonnegative(),
  vin: z2.string().min(1, "VIN is required."),
  description: z2.string().min(1, "Description is required."),
  images: z2.array(z2.string()).min(1, "At least one image is required."),
  // By making the field purely optional, its inferred type becomes `number[] | undefined`,
  // which correctly matches the reality of react-hook-form's partial default values.
  feature_ids: z2.array(z2.number()).optional(),
  body_type_id: z2.number().nullable().optional(),
  drivetrain_id: z2.number().nullable().optional(),
  fuel_type_id: z2.number().nullable().optional(),
  transmission_type_id: z2.number().nullable().optional(),
  engine_size_id: z2.number().nullable().optional(),
  aspiration_id: z2.number().nullable().optional(),
  doors_id: z2.number().nullable().optional()
});
var VariantOptionSchema = z2.object({
  id: z2.number(),
  name: z2.string()
});
export {
  BODY_TYPES,
  FUEL_TYPES,
  LOCATION_TYPES,
  RESIDENTIAL_TYPES,
  TRANSMISSION_TYPES,
  profileFormSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  vehicleFormSchema
};
