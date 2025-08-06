import type { Database } from './database.types';

// Each of these is derived directly from its corresponding table.
// This ensures that properties and their types (e.g., id: number vs id: string) are always correct.

export type VehicleAspiration =
  Database['public']['Tables']['vehicle_aspirations']['Row'];
export type VehicleBodyType =
  Database['public']['Tables']['vehicle_body_types']['Row'];
export type VehicleDoor = Database['public']['Tables']['vehicle_doors']['Row'];
export type VehicleDrivetrain =
  Database['public']['Tables']['vehicle_drivetrains']['Row'];
export type VehicleEngineSize =
  Database['public']['Tables']['vehicle_engine_sizes']['Row'];
export type VehicleFuelType =
  Database['public']['Tables']['vehicle_fuel_types']['Row'];
export type VehicleMake = Database['public']['Tables']['vehicle_makes']['Row'];
export type VehicleModel = Database['public']['Tables']['vehicle_models']['Row'];
export type VehicleTransmissionType =
  Database['public']['Tables']['vehicle_transmission_types']['Row'];

// --- Aliases for convenience in hooks and components ---
export type Aspiration = VehicleAspiration;
export type BodyType = VehicleBodyType;
export type Door = VehicleDoor;
export type Drivetrain = VehicleDrivetrain;
export type EngineSize = VehicleEngineSize;
export type FuelType = VehicleFuelType;
export type TransmissionType = VehicleTransmissionType;
