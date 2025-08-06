"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BODY_TYPES: () => BODY_TYPES,
  FUEL_TYPES: () => FUEL_TYPES,
  LOCATION_TYPES: () => LOCATION_TYPES,
  RESIDENTIAL_TYPES: () => RESIDENTIAL_TYPES,
  TRANSMISSION_TYPES: () => TRANSMISSION_TYPES,
  profileFormSchema: () => profileFormSchema,
  signInSchema: () => signInSchema,
  signUpSchema: () => signUpSchema,
  updatePasswordSchema: () => updatePasswordSchema,
  vehicleFormSchema: () => vehicleFormSchema
});
module.exports = __toCommonJS(src_exports);

// src/auth.ts
var import_zod = require("zod");
var signInSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address."),
  password: import_zod.z.string().min(8, "Password must be at least 8 characters long.")
});
var signUpSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address."),
  password: import_zod.z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: import_zod.z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var updatePasswordSchema = import_zod.z.object({
  password: import_zod.z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: import_zod.z.string()
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
var import_zod2 = require("zod");
var profileFormSchema = import_zod2.z.object({
  display_name: import_zod2.z.string().nullable().optional(),
  first_name: import_zod2.z.string().nullable().optional(),
  last_name: import_zod2.z.string().nullable().optional(),
  contact_number: import_zod2.z.string().nullable().optional(),
  location_type: import_zod2.z.string().nullable().optional(),
  residential_type: import_zod2.z.string().nullable().optional(),
  complex_or_estate_name: import_zod2.z.string().nullable().optional(),
  unit_number: import_zod2.z.string().nullable().optional(),
  street_number: import_zod2.z.string().nullable().optional(),
  street_name: import_zod2.z.string().nullable().optional(),
  postcode: import_zod2.z.string().nullable().optional(),
  province_id: import_zod2.z.coerce.number().optional(),
  city_id: import_zod2.z.coerce.number().optional(),
  suburb_id: import_zod2.z.coerce.number().optional()
});
var vehicleFormSchema = import_zod2.z.object({
  id: import_zod2.z.number().optional(),
  make_id: import_zod2.z.number({ required_error: "Make is required." }),
  model_id: import_zod2.z.number({ required_error: "Model is required." }),
  year: import_zod2.z.number({ required_error: "Year is required." }),
  price: import_zod2.z.number({ required_error: "Price is required." }).positive(),
  mileage: import_zod2.z.number({ required_error: "Mileage is required." }).nonnegative(),
  vin: import_zod2.z.string().min(1, "VIN is required."),
  description: import_zod2.z.string().min(1, "Description is required."),
  images: import_zod2.z.array(import_zod2.z.string()).min(1, "At least one image is required."),
  // By making the field purely optional, its inferred type becomes `number[] | undefined`,
  // which correctly matches the reality of react-hook-form's partial default values.
  feature_ids: import_zod2.z.array(import_zod2.z.number()).optional(),
  body_type_id: import_zod2.z.number().nullable().optional(),
  drivetrain_id: import_zod2.z.number().nullable().optional(),
  fuel_type_id: import_zod2.z.number().nullable().optional(),
  transmission_type_id: import_zod2.z.number().nullable().optional(),
  engine_size_id: import_zod2.z.number().nullable().optional(),
  aspiration_id: import_zod2.z.number().nullable().optional(),
  doors_id: import_zod2.z.number().nullable().optional()
});
var VariantOptionSchema = import_zod2.z.object({
  id: import_zod2.z.number(),
  name: import_zod2.z.string()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
