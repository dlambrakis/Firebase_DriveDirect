import type { Functions } from './db';

/**
 * A helper type to safely extract the element type from a potential array within a Json response.
 * If the type T is an array (like U[]), it returns U. Otherwise, it returns T.
 */
type UnboxJsonArray<T> = T extends (infer U)[] ? U : T;

/**
 * Represents a vehicle listing with its images.
 */
export type VehicleWithImages = {
  listing_id: number;
  price: number | null;
  mileage: number | null;
  year: number;
  make: string;
  model: string;
  variant: string | null;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  location: string | null;
  description: string | null;
  is_sold: boolean | null;
  created_at: string | null;
  province_id: number | null;
  images: string[] | null;
};

/**
 * Represents a vehicle search result from the RPC function.
 */
export type VehicleSearchResult = UnboxJsonArray<
  Functions['search_and_filter_vehicles']['Returns']
> & {
  total_count: number;
};

/**
 * Defines the shape of the filters used for searching and filtering vehicles.
 */
export interface VehicleFilters {
  searchTerm?: string;
  makes?: string[];
  models?: string[];
  locations?: string[];
  bodyTypes?: string[];
  transmissions?: string[];
  fuelTypes?: string[];
  drivetrains?: string[];
  engineSizes?: string[];
  features?: string[];
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Defines the parameters for looking up a single vehicle.
 */
export interface VehicleLookup {
  id?: number;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
}
