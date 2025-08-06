import type { Enums, Tables } from './db';

// The Conversation type needed by useConversations.ts
export type Conversation = Tables<'conversations'>;

// The detailed listing type needed by useListing.ts and others
export type VehicleListingDetailed = Tables<'vehicle_listings_detailed'>;

// A standard listing type
export type Listing = Tables<'vehicle_listings'>;

// The user profile type
export type Profile = Tables<'profiles'>;

// The status enum for a vehicle listing
export type ListingStatus = Enums<'vehicle_status'>;

// A generic type for filter options
export type FilterOptionsResponse = {
  makes: { id: number; name: string }[];
  models: { id: number; name: string }[];
  bodyTypes: { id: number; name: string }[];
  // Add any other filter categories here
};

// A detailed vehicle type for the vehicle detail page
export type VehicleWithDetails = VehicleListingDetailed & {
  features: { feature_name: string }[];
  // Add any other relations you need here
};

// Individual types needed by useVehicleFormLogic.ts
export type Make = Tables<'vehicle_makes'>;
export type Model = Tables<'vehicle_models'>;
export type Feature = Tables<'vehicle_features'>;
export type VehicleVariant = Tables<'vehicle_variants'>;
