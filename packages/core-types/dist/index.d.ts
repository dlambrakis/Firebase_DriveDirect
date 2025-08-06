import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Schema for validating user sign-in credentials.
 * Requires a valid email and a password of at least 8 characters.
 */
declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
/**
 * Schema for validating user sign-up credentials.
 * Requires a valid email, a password of at least 8 characters, and a matching confirmation password.
 */
declare const signUpSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    confirmPassword: string;
}>, {
    email: string;
    password: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    confirmPassword: string;
}>;
/**
 * Schema for validating a password update.
 * Requires a new password of at least 8 characters and a matching confirmation password.
 */
declare const updatePasswordSchema: z.ZodEffects<z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>;
/**
 * Represents the input data for a sign-in operation.
 */
type SignInInput = z.infer<typeof signInSchema>;
/**
 * Represents the input data for a sign-up operation.
 */
type SignUpInput = z.infer<typeof signUpSchema>;
/**
 * Represents the input data for a password update operation.
 */
type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

declare const TRANSMISSION_TYPES: readonly ["Automatic", "Manual"];
declare const FUEL_TYPES: readonly ["Petrol", "Diesel", "Electric", "Hybrid"];
declare const BODY_TYPES: readonly ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van"];
declare const LOCATION_TYPES: readonly ["Business", "Residential"];
declare const RESIDENTIAL_TYPES: readonly ["House", "Apartment", "Townhouse", "Complex", "Estate"];

type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
type Database = {
    __InternalSupabase: {
        PostgrestVersion: "12.2.3 (519615d)";
    };
    public: {
        Tables: {
            cities: {
                Row: {
                    created_at: string;
                    id: number;
                    is_active: boolean;
                    name: string;
                    province_id: number | null;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name: string;
                    province_id?: number | null;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name?: string;
                    province_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "cities_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "provinces";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cities_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["province_id"];
                    }
                ];
            };
            conversations: {
                Row: {
                    buyer_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    seller_id: number | null;
                    updated_at: string;
                    vehicle_id: string;
                    vehicle_listing_id: number | null;
                };
                Insert: {
                    buyer_id?: number | null;
                    created_at?: string;
                    id?: number;
                    public_id?: string;
                    seller_id?: number | null;
                    updated_at?: string;
                    vehicle_id: string;
                    vehicle_listing_id?: number | null;
                };
                Update: {
                    buyer_id?: number | null;
                    created_at?: string;
                    id?: number;
                    public_id?: string;
                    seller_id?: number | null;
                    updated_at?: string;
                    vehicle_id?: string;
                    vehicle_listing_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "conversations_buyer_id_fkey";
                        columns: ["buyer_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_seller_id_fkey";
                        columns: ["seller_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_vehicle_listing_id_fkey";
                        columns: ["vehicle_listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings";
                        referencedColumns: ["listing_id"];
                    },
                    {
                        foreignKeyName: "conversations_vehicle_listing_id_fkey";
                        columns: ["vehicle_listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["listing_id"];
                    }
                ];
            };
            countries: {
                Row: {
                    created_at: string;
                    id: number;
                    is_active: boolean;
                    name: string;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name: string;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name?: string;
                };
                Relationships: [];
            };
            messages: {
                Row: {
                    content: string;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    is_read: boolean;
                    is_system_message: boolean;
                    public_id: string;
                    sender_id: number | null;
                };
                Insert: {
                    content: string;
                    conversation_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_read?: boolean;
                    is_system_message?: boolean;
                    public_id?: string;
                    sender_id?: number | null;
                };
                Update: {
                    content?: string;
                    conversation_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_read?: boolean;
                    is_system_message?: boolean;
                    public_id?: string;
                    sender_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversation_details";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "messages_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey";
                        columns: ["sender_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            offers: {
                Row: {
                    amount: number;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    recipient_id: number | null;
                    sender_id: number | null;
                    status: Database["public"]["Enums"]["offer_status"];
                    updated_at: string | null;
                    vehicle_id: string | null;
                };
                Insert: {
                    amount: number;
                    conversation_id?: number | null;
                    created_at?: string;
                    id?: number;
                    public_id?: string;
                    recipient_id?: number | null;
                    sender_id?: number | null;
                    status?: Database["public"]["Enums"]["offer_status"];
                    updated_at?: string | null;
                    vehicle_id?: string | null;
                };
                Update: {
                    amount?: number;
                    conversation_id?: number | null;
                    created_at?: string;
                    id?: number;
                    public_id?: string;
                    recipient_id?: number | null;
                    sender_id?: number | null;
                    status?: Database["public"]["Enums"]["offer_status"];
                    updated_at?: string | null;
                    vehicle_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "offers_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversation_details";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "offers_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "offers_recipient_id_fkey";
                        columns: ["recipient_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "offers_sender_id_fkey";
                        columns: ["sender_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    bio: string | null;
                    city_id: number | null;
                    complex_or_estate_name: string | null;
                    contact_number: string | null;
                    country: string | null;
                    display_name: string | null;
                    first_name: string | null;
                    id: number;
                    last_name: string | null;
                    location_type: Database["public"]["Enums"]["location_type_enum"] | null;
                    postcode: string | null;
                    province_id: number | null;
                    public_id: string;
                    residential_type: Database["public"]["Enums"]["residential_type_enum"] | null;
                    street_name: string | null;
                    street_number: string | null;
                    suburb_id: number | null;
                    unit_number: string | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    city_id?: number | null;
                    complex_or_estate_name?: string | null;
                    contact_number?: string | null;
                    country?: string | null;
                    display_name?: string | null;
                    first_name?: string | null;
                    id?: number;
                    last_name?: string | null;
                    location_type?: Database["public"]["Enums"]["location_type_enum"] | null;
                    postcode?: string | null;
                    province_id?: number | null;
                    public_id: string;
                    residential_type?: Database["public"]["Enums"]["residential_type_enum"] | null;
                    street_name?: string | null;
                    street_number?: string | null;
                    suburb_id?: number | null;
                    unit_number?: string | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    city_id?: number | null;
                    complex_or_estate_name?: string | null;
                    contact_number?: string | null;
                    country?: string | null;
                    display_name?: string | null;
                    first_name?: string | null;
                    id?: number;
                    last_name?: string | null;
                    location_type?: Database["public"]["Enums"]["location_type_enum"] | null;
                    postcode?: string | null;
                    province_id?: number | null;
                    public_id?: string;
                    residential_type?: Database["public"]["Enums"]["residential_type_enum"] | null;
                    street_name?: string | null;
                    street_number?: string | null;
                    suburb_id?: number | null;
                    unit_number?: string | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profiles_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "provinces";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "profiles_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["province_id"];
                    }
                ];
            };
            provinces: {
                Row: {
                    country_id: number | null;
                    created_at: string;
                    id: number;
                    is_active: boolean;
                    name: string;
                };
                Insert: {
                    country_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name: string;
                };
                Update: {
                    country_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "provinces_country_id_fkey";
                        columns: ["country_id"];
                        isOneToOne: false;
                        referencedRelation: "countries";
                        referencedColumns: ["id"];
                    }
                ];
            };
            saved_vehicles: {
                Row: {
                    created_at: string;
                    id: number;
                    listing_id: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    listing_id: number;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    listing_id?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "saved_vehicles_listing_id_fkey";
                        columns: ["listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings";
                        referencedColumns: ["listing_id"];
                    },
                    {
                        foreignKeyName: "saved_vehicles_listing_id_fkey";
                        columns: ["listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["listing_id"];
                    }
                ];
            };
            suburbs: {
                Row: {
                    box_code: string | null;
                    city_id: number | null;
                    created_at: string;
                    id: number;
                    is_active: boolean;
                    name: string;
                    street_code: string | null;
                };
                Insert: {
                    box_code?: string | null;
                    city_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name: string;
                    street_code?: string | null;
                };
                Update: {
                    box_code?: string | null;
                    city_id?: number | null;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean;
                    name?: string;
                    street_code?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "suburbs_city_id_fkey";
                        columns: ["city_id"];
                        isOneToOne: false;
                        referencedRelation: "cities";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_aspirations: {
                Row: {
                    aspiration: string;
                    aspiration_id: number;
                    is_active: boolean | null;
                };
                Insert: {
                    aspiration: string;
                    aspiration_id?: number;
                    is_active?: boolean | null;
                };
                Update: {
                    aspiration?: string;
                    aspiration_id?: number;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_body_types: {
                Row: {
                    body_type: string;
                    body_type_id: number;
                    is_active: boolean | null;
                };
                Insert: {
                    body_type: string;
                    body_type_id?: number;
                    is_active?: boolean | null;
                };
                Update: {
                    body_type?: string;
                    body_type_id?: number;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_doors: {
                Row: {
                    door_id: number;
                    doors: string;
                    is_active: boolean | null;
                };
                Insert: {
                    door_id?: number;
                    doors: string;
                    is_active?: boolean | null;
                };
                Update: {
                    door_id?: number;
                    doors?: string;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_drivetrains: {
                Row: {
                    drivetrain: string;
                    drivetrain_id: number;
                    is_active: boolean | null;
                };
                Insert: {
                    drivetrain: string;
                    drivetrain_id?: number;
                    is_active?: boolean | null;
                };
                Update: {
                    drivetrain?: string;
                    drivetrain_id?: number;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_engine_sizes: {
                Row: {
                    engine_size: string;
                    engine_size_id: number;
                    is_active: boolean | null;
                };
                Insert: {
                    engine_size: string;
                    engine_size_id?: number;
                    is_active?: boolean | null;
                };
                Update: {
                    engine_size?: string;
                    engine_size_id?: number;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_features: {
                Row: {
                    feature_id: number;
                    feature_name: string;
                    is_active: boolean | null;
                };
                Insert: {
                    feature_id?: number;
                    feature_name: string;
                    is_active?: boolean | null;
                };
                Update: {
                    feature_id?: number;
                    feature_name?: string;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_fuel_types: {
                Row: {
                    fuel_type: string;
                    fuel_type_id: number;
                    is_active: boolean | null;
                };
                Insert: {
                    fuel_type: string;
                    fuel_type_id?: number;
                    is_active?: boolean | null;
                };
                Update: {
                    fuel_type?: string;
                    fuel_type_id?: number;
                    is_active?: boolean | null;
                };
                Relationships: [];
            };
            vehicle_listing_features: {
                Row: {
                    feature_id: number;
                    listing_id: number;
                };
                Insert: {
                    feature_id: number;
                    listing_id: number;
                };
                Update: {
                    feature_id?: number;
                    listing_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_feature";
                        columns: ["feature_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_features";
                        referencedColumns: ["feature_id"];
                    },
                    {
                        foreignKeyName: "fk_listing";
                        columns: ["listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings";
                        referencedColumns: ["listing_id"];
                    },
                    {
                        foreignKeyName: "fk_listing";
                        columns: ["listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["listing_id"];
                    }
                ];
            };
            vehicle_listings: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    images: string[] | null;
                    is_sold: boolean | null;
                    listing_id: number;
                    mileage: number;
                    price: number;
                    province_id: number | null;
                    status: string;
                    updated_at: string | null;
                    user_id: string;
                    vehicle_main_id: number;
                    vin: string;
                    year: number;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    images?: string[] | null;
                    is_sold?: boolean | null;
                    listing_id?: number;
                    mileage: number;
                    price: number;
                    province_id?: number | null;
                    status?: string;
                    updated_at?: string | null;
                    user_id: string;
                    vehicle_main_id: number;
                    vin: string;
                    year: number;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    images?: string[] | null;
                    is_sold?: boolean | null;
                    listing_id?: number;
                    mileage?: number;
                    price?: number;
                    province_id?: number | null;
                    status?: string;
                    updated_at?: string | null;
                    user_id?: string;
                    vehicle_main_id?: number;
                    vin?: string;
                    year?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_listings_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "provinces";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "vehicle_listings_province_id_fkey";
                        columns: ["province_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["province_id"];
                    },
                    {
                        foreignKeyName: "vehicle_listings_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main: {
                Row: {
                    id: number;
                    make_id: number | null;
                    model_id: number | null;
                    variant_id: number | null;
                    year_id: number | null;
                };
                Insert: {
                    id?: number;
                    make_id?: number | null;
                    model_id?: number | null;
                    variant_id?: number | null;
                    year_id?: number | null;
                };
                Update: {
                    id?: number;
                    make_id?: number | null;
                    model_id?: number | null;
                    variant_id?: number | null;
                    year_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_make_id_fkey";
                        columns: ["make_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_makes";
                        referencedColumns: ["make_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_model_id_fkey";
                        columns: ["model_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_models";
                        referencedColumns: ["model_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_variants";
                        referencedColumns: ["variant_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_year_id_fkey";
                        columns: ["year_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_years";
                        referencedColumns: ["year_id"];
                    }
                ];
            };
            vehicle_main_aspirations: {
                Row: {
                    aspiration_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    aspiration_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    aspiration_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_aspirations_aspiration_id_fkey";
                        columns: ["aspiration_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_aspirations";
                        referencedColumns: ["aspiration_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_aspirations_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_body_types: {
                Row: {
                    body_type_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    body_type_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    body_type_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_body_types_body_type_id_fkey";
                        columns: ["body_type_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_body_types";
                        referencedColumns: ["body_type_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_body_types_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_doors: {
                Row: {
                    door_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    door_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    door_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_doors_door_id_fkey";
                        columns: ["door_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_doors";
                        referencedColumns: ["door_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_doors_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_drivetrains: {
                Row: {
                    drivetrain_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    drivetrain_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    drivetrain_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_drivetrains_drivetrain_id_fkey";
                        columns: ["drivetrain_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_drivetrains";
                        referencedColumns: ["drivetrain_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_drivetrains_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_engine_sizes: {
                Row: {
                    engine_size_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    engine_size_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    engine_size_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_engine_sizes_engine_size_id_fkey";
                        columns: ["engine_size_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_engine_sizes";
                        referencedColumns: ["engine_size_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_engine_sizes_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_fuel_types: {
                Row: {
                    fuel_type_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    fuel_type_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    fuel_type_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_fuel_types_fuel_type_id_fkey";
                        columns: ["fuel_type_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_fuel_types";
                        referencedColumns: ["fuel_type_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_fuel_types_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_main_transmissions: {
                Row: {
                    transmission_type_id: number;
                    vehicle_main_id: number;
                };
                Insert: {
                    transmission_type_id: number;
                    vehicle_main_id: number;
                };
                Update: {
                    transmission_type_id?: number;
                    vehicle_main_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "vehicle_main_transmissions_transmission_type_id_fkey";
                        columns: ["transmission_type_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_transmission_types";
                        referencedColumns: ["transmission_type_id"];
                    },
                    {
                        foreignKeyName: "vehicle_main_transmissions_vehicle_main_id_fkey";
                        columns: ["vehicle_main_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_main";
                        referencedColumns: ["id"];
                    }
                ];
            };
            vehicle_makes: {
                Row: {
                    is_active: boolean | null;
                    make: string;
                    make_id: number;
                };
                Insert: {
                    is_active?: boolean | null;
                    make: string;
                    make_id?: number;
                };
                Update: {
                    is_active?: boolean | null;
                    make?: string;
                    make_id?: number;
                };
                Relationships: [];
            };
            vehicle_models: {
                Row: {
                    is_active: boolean | null;
                    model: string;
                    model_id: number;
                };
                Insert: {
                    is_active?: boolean | null;
                    model: string;
                    model_id?: number;
                };
                Update: {
                    is_active?: boolean | null;
                    model?: string;
                    model_id?: number;
                };
                Relationships: [];
            };
            vehicle_transmission_types: {
                Row: {
                    is_active: boolean | null;
                    transmission_type: string;
                    transmission_type_id: number;
                };
                Insert: {
                    is_active?: boolean | null;
                    transmission_type: string;
                    transmission_type_id?: number;
                };
                Update: {
                    is_active?: boolean | null;
                    transmission_type?: string;
                    transmission_type_id?: number;
                };
                Relationships: [];
            };
            vehicle_variants: {
                Row: {
                    is_active: boolean | null;
                    variant: string;
                    variant_id: number;
                };
                Insert: {
                    is_active?: boolean | null;
                    variant: string;
                    variant_id?: number;
                };
                Update: {
                    is_active?: boolean | null;
                    variant?: string;
                    variant_id?: number;
                };
                Relationships: [];
            };
            vehicle_years: {
                Row: {
                    end_year: number | null;
                    is_active: boolean | null;
                    start_year: number | null;
                    year_id: number;
                };
                Insert: {
                    end_year?: number | null;
                    is_active?: boolean | null;
                    start_year?: number | null;
                    year_id?: number;
                };
                Update: {
                    end_year?: number | null;
                    is_active?: boolean | null;
                    start_year?: number | null;
                    year_id?: number;
                };
                Relationships: [];
            };
        };
        Views: {
            conversation_details: {
                Row: {
                    buyer_avatar: string | null;
                    buyer_id: number | null;
                    buyer_name: string | null;
                    created_at: string | null;
                    id: number | null;
                    images: string[] | null;
                    last_message: string | null;
                    last_message_at: string | null;
                    last_message_sender_id: number | null;
                    price: number | null;
                    seller_avatar: string | null;
                    seller_id: number | null;
                    seller_name: string | null;
                    updated_at: string | null;
                    vehicle_listing_id: number | null;
                    vehicle_make: string | null;
                    vehicle_model: string | null;
                    year: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "conversations_buyer_id_fkey";
                        columns: ["buyer_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_seller_id_fkey";
                        columns: ["seller_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_vehicle_listing_id_fkey";
                        columns: ["vehicle_listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings";
                        referencedColumns: ["listing_id"];
                    },
                    {
                        foreignKeyName: "conversations_vehicle_listing_id_fkey";
                        columns: ["vehicle_listing_id"];
                        isOneToOne: false;
                        referencedRelation: "vehicle_listings_detailed";
                        referencedColumns: ["listing_id"];
                    }
                ];
            };
            vehicle_listings_detailed: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    features: Json | null;
                    images: string[] | null;
                    listing_id: number | null;
                    make: string | null;
                    mileage: number | null;
                    model: string | null;
                    price: number | null;
                    province_id: number | null;
                    province_name: string | null;
                    status: string | null;
                    user_id: string | null;
                    variant: string | null;
                    vin: string | null;
                    year: number | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            accept_offer: {
                Args: {
                    p_offer_id: string;
                };
                Returns: {
                    amount: number;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    recipient_id: number | null;
                    sender_id: number | null;
                    status: Database["public"]["Enums"]["offer_status"];
                    updated_at: string | null;
                    vehicle_id: string | null;
                };
            };
            create_conversation: {
                Args: {
                    p_listing_id: number;
                    p_initiator_id: string;
                    p_listing_owner_id: string;
                };
                Returns: string;
            };
            create_conversation_and_message: {
                Args: {
                    p_listing_id: number;
                    p_seller_id: string;
                    p_message_content: string;
                };
                Returns: string;
            };
            create_counter_offer: {
                Args: {
                    original_offer_id: string;
                    new_amount: number;
                };
                Returns: {
                    amount: number;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    recipient_id: number | null;
                    sender_id: number | null;
                    status: Database["public"]["Enums"]["offer_status"];
                    updated_at: string | null;
                    vehicle_id: string | null;
                };
            };
            create_offer: {
                Args: {
                    p_conversation_id: string;
                    p_amount: number;
                    p_recipient_id: string;
                } | {
                    p_conversation_id: string;
                    p_recipient_id: string;
                    p_amount: number;
                };
                Returns: {
                    amount: number;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    recipient_id: number | null;
                    sender_id: number | null;
                    status: Database["public"]["Enums"]["offer_status"];
                    updated_at: string | null;
                    vehicle_id: string | null;
                };
            };
            create_spec_function: {
                Args: {
                    spec_name: string;
                    table_name: string;
                    column_name: string;
                    id_column: string;
                };
                Returns: undefined;
            };
            create_vehicle: {
                Args: {
                    p_user_id: string;
                    p_make_id: string;
                    p_model_id: string;
                    p_variant_id: string;
                    p_suburb_id: string;
                    p_year: number;
                    p_price: number;
                    p_mileage: number;
                    p_description: string;
                    p_vin: string;
                    p_images: string[];
                    p_feature_ids: string[];
                };
                Returns: string;
            };
            create_vehicle_listing: {
                Args: {
                    p_vehicle_main_id: number;
                    p_year: number;
                    p_mileage: number;
                    p_price: number;
                    p_vin: string;
                    p_description: string;
                    p_images: string[];
                    p_feature_ids: number[];
                };
                Returns: number;
            };
            create_vehicle_listing_atomic: {
                Args: {
                    p_user_id: string;
                    p_vehicle_main_id: number;
                    p_price: number;
                    p_mileage: number;
                    p_vin: string;
                    p_description: string;
                    p_images: string[];
                    p_feature_ids: number[];
                };
                Returns: Json;
            };
            deactivate_all_vehicle_data: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            deactivate_location_data_by_country_name: {
                Args: {
                    p_country_name: string;
                };
                Returns: undefined;
            };
            decline_offer: {
                Args: {
                    p_offer_id: string;
                };
                Returns: {
                    amount: number;
                    conversation_id: number | null;
                    created_at: string;
                    id: number;
                    public_id: string;
                    recipient_id: number | null;
                    sender_id: number | null;
                    status: Database["public"]["Enums"]["offer_status"];
                    updated_at: string | null;
                    vehicle_id: string | null;
                };
            };
            delete_conversation: {
                Args: {
                    p_conversation_id: string;
                };
                Returns: undefined;
            };
            delete_conversation_for_user: {
                Args: {
                    p_conversation_id: string;
                };
                Returns: undefined;
            };
            delete_vehicle_listing: {
                Args: {
                    p_listing_id: number;
                };
                Returns: number;
            };
            fetch_vehicle_years_by_model: {
                Args: {
                    p_model_id: string;
                };
                Returns: {
                    year: number;
                }[];
            };
            get_all_features: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    id: string;
                    name: string;
                    description: string;
                }[];
            };
            get_all_vehicle_years: {
                Args: Record<PropertyKey, never>;
                Returns: number[];
            };
            get_aspirations_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_body_types_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_conversations_for_user: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    id: string;
                    created_at: string;
                    vehicle_id: string;
                    last_message_at: string;
                    last_message_preview: string;
                    last_message_sender_id: string;
                    vehicle_make: string;
                    vehicle_model: string;
                    vehicle_year: number;
                    vehicle_image: string;
                    other_user_id: string;
                    other_user_name: string;
                    other_user_avatar: string;
                    unread_count: number;
                }[];
            };
            get_conversations_with_details: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    id: string;
                    other_user_id: string;
                    other_user_name: string;
                    other_user_avatar: string;
                    listing_id: number;
                    vehicle_make: string;
                    vehicle_model: string;
                    last_message_preview: string;
                    last_message_at: string;
                    last_message_sender_id: string;
                    is_last_message_read: boolean;
                }[];
            };
            get_dashboard_data: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    summary: Json;
                    recent_listings: Json;
                    recent_conversations: Json;
                    recent_offers: Json;
                }[];
            };
            get_distinct_spec_options: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                    spec_table_name: string;
                    spec_column_name: string;
                    join_column_name: string;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_doors_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_drivetrains_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_engine_sizes_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_features: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    feature_id: number;
                    feature_name: string;
                    is_active: boolean;
                }[];
            };
            get_filtered_variants: {
                Args: {
                    p_model_id: number;
                    p_year?: number;
                    p_body_type_id?: number;
                    p_transmission_type_id?: number;
                    p_fuel_type_id?: number;
                    p_drivetrain_id?: number;
                    p_engine_size_id?: number;
                    p_aspiration_id?: number;
                    p_door_id?: number;
                };
                Returns: {
                    is_active: boolean | null;
                    variant: string;
                    variant_id: number;
                }[];
            };
            get_form_variant_options: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: Json;
            };
            get_fuel_types_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_listing_details: {
                Args: {
                    p_listing_id: number;
                    p_user_id?: string;
                };
                Returns: Json;
            };
            get_models_by_make_ids: {
                Args: {
                    p_make_ids: number[];
                };
                Returns: {
                    model_id: number;
                    model: string;
                }[];
            };
            get_saved_vehicle_listings: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    created_at: string | null;
                    description: string | null;
                    features: Json | null;
                    images: string[] | null;
                    listing_id: number | null;
                    make: string | null;
                    mileage: number | null;
                    model: string | null;
                    price: number | null;
                    province_id: number | null;
                    province_name: string | null;
                    status: string | null;
                    user_id: string | null;
                    variant: string | null;
                    vin: string | null;
                    year: number | null;
                }[];
            };
            get_transmission_types_for_model_and_year: {
                Args: {
                    p_model_id: number;
                    p_year: number;
                };
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_user_dashboard_data: {
                Args: {
                    p_user_id: string;
                    p_limit: number;
                };
                Returns: Json;
            };
            get_user_listings: {
                Args: {
                    p_user_id: string;
                } | {
                    p_user_id: string;
                    p_limit?: number;
                };
                Returns: {
                    created_at: string | null;
                    description: string | null;
                    features: Json | null;
                    images: string[] | null;
                    listing_id: number | null;
                    make: string | null;
                    mileage: number | null;
                    model: string | null;
                    price: number | null;
                    province_id: number | null;
                    province_name: string | null;
                    status: string | null;
                    user_id: string | null;
                    variant: string | null;
                    vin: string | null;
                    year: number | null;
                }[];
            };
            get_variants_by_make_and_model_ids: {
                Args: {
                    p_make_ids: number[];
                    p_model_ids: number[];
                };
                Returns: {
                    variant_id: number;
                    variant: string;
                    is_active: boolean;
                }[];
            };
            get_vehicle_details_for_user: {
                Args: {
                    p_listing_id: number;
                    p_user_id: string;
                };
                Returns: Json;
            };
            get_vehicle_filter_options: {
                Args: Record<PropertyKey, never>;
                Returns: Json;
            };
            get_vehicle_makes: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    id: number;
                    name: string;
                }[];
            };
            get_vehicle_models: {
                Args: {
                    p_make_id: number;
                };
                Returns: {
                    is_active: boolean | null;
                    model: string;
                    model_id: number;
                }[];
            };
            get_vehicle_models_by_make: {
                Args: {
                    p_make_id: number;
                };
                Returns: {
                    is_active: boolean | null;
                    model: string;
                    model_id: number;
                }[];
            };
            get_vehicle_variant_details: {
                Args: {
                    p_variant_id: string;
                };
                Returns: Json;
            };
            get_vehicle_variant_options: {
                Args: {
                    p_model_id: string;
                    p_year: number;
                };
                Returns: Json;
            };
            get_vehicle_variant_options_by_variant_id: {
                Args: {
                    p_variant_id: number;
                };
                Returns: Json;
            };
            get_vehicle_years: {
                Args: {
                    p_model_id: number;
                };
                Returns: {
                    year: number;
                }[];
            };
            get_vehicle_years_for_model: {
                Args: {
                    p_model_id: number;
                };
                Returns: {
                    year: number;
                }[];
            };
            get_vehicle_years_for_variant: {
                Args: {
                    p_variant_id: number;
                };
                Returns: {
                    year: number;
                }[];
            };
            ingest_vehicle_from_csv_row: {
                Args: {
                    p_make: string;
                    p_model: string;
                    p_variant: string;
                    p_start_year: number;
                    p_end_year: number;
                    p_doors: string[];
                    p_drivetrains: string[];
                    p_body_types: string[];
                    p_engine_sizes: string[];
                    p_aspirations: string[];
                    p_fuel_types: string[];
                    p_transmission_types: string[];
                };
                Returns: number;
            };
            ingest_vehicle_row: {
                Args: {
                    p_make: string;
                    p_model: string;
                    p_variant: string;
                    p_start_year: number;
                    p_end_year: number;
                    p_doors: string;
                    p_drivetrain: string;
                    p_body_type: string;
                    p_engine_size: string;
                    p_aspiration: string;
                    p_fuel_type: string;
                    p_transmission_type: string;
                } | {
                    p_year: number;
                    p_make: string;
                    p_model: string;
                    p_body: string;
                    p_transmission: string;
                    p_state: string;
                    p_condition: number;
                    p_odometer: number;
                    p_color: string;
                    p_interior: string;
                    p_seller: string;
                    p_mmr: number;
                    p_selling_price: number;
                    p_sale_date: string;
                    p_features: string[];
                };
                Returns: string;
            };
            is_conversation_participant: {
                Args: {
                    p_conversation_id: string;
                    p_user_id: string;
                };
                Returns: boolean;
            };
            search_and_filter_vehicles: {
                Args: {
                    p_search_term?: string;
                    p_makes?: string[];
                    p_models?: string[];
                    p_locations?: string[];
                    p_body_types?: string[];
                    p_transmissions?: string[];
                    p_fuel_types?: string[];
                    p_drivetrains?: string[];
                    p_engine_sizes?: string[];
                    p_features?: string[];
                    p_min_year?: number;
                    p_max_year?: number;
                    p_min_price?: number;
                    p_max_price?: number;
                    p_min_mileage?: number;
                    p_max_mileage?: number;
                    p_page_number?: number;
                    p_page_size?: number;
                    p_sort_by?: string;
                };
                Returns: Json;
            };
            search_listings: {
                Args: {
                    p_search_term?: string;
                    p_make_ids?: number[];
                    p_model_ids?: number[];
                    p_location_ids?: number[];
                    p_body_type_ids?: number[];
                    p_transmission_ids?: number[];
                    p_fuel_type_ids?: number[];
                    p_drivetrain_ids?: number[];
                    p_engine_sizes?: string[];
                    p_features?: string[];
                    p_min_year?: number;
                    p_max_year?: number;
                    p_min_price?: number;
                    p_max_price?: number;
                    p_min_mileage?: number;
                    p_max_mileage?: number;
                    p_sort_by?: string;
                    p_page_number?: number;
                    p_page_size?: number;
                } | {
                    p_search_text?: string;
                    p_make_ids?: number[];
                    p_model_ids?: number[];
                    p_min_price?: number;
                    p_max_price?: number;
                    p_min_year?: number;
                    p_max_year?: number;
                    p_min_mileage?: number;
                    p_max_mileage?: number;
                    p_body_type_ids?: number[];
                    p_transmission_type_ids?: number[];
                    p_fuel_type_ids?: number[];
                    p_drivetrain_ids?: number[];
                    p_sort_by?: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    listing_id: number;
                    make: string;
                    model: string;
                    variant: string;
                    year: number;
                    price: number;
                    mileage: number;
                    body_type: string;
                    fuel_type: string;
                    transmission: string;
                    location: string;
                    created_at: string;
                    images: Json;
                }[];
            };
            send_message: {
                Args: {
                    p_conversation_id: string;
                    p_content: string;
                };
                Returns: {
                    id: string;
                    created_at: string;
                    conversation_id: string;
                    sender_id: string;
                    content: string;
                    is_read: boolean;
                }[];
            };
            toggle_saved_vehicle: {
                Args: {
                    p_listing_id: number;
                    p_user_id: string;
                };
                Returns: Json;
            };
            update_listing_status: {
                Args: {
                    p_listing_id: number;
                    p_new_status: string;
                };
                Returns: undefined;
            };
            update_user_profile: {
                Args: {
                    p_display_name: string;
                    p_first_name: string;
                    p_last_name: string;
                    p_avatar_url: string;
                    p_contact_number: string;
                    p_location_type: Database["public"]["Enums"]["location_type_enum"];
                    p_residential_type: Database["public"]["Enums"]["residential_type_enum"];
                    p_complex_or_estate_name: string;
                    p_unit_number: string;
                    p_street_number: string;
                    p_street_name: string;
                    p_postcode: string;
                    p_province_id: number;
                    p_city_id: number;
                    p_suburb_id: number;
                    p_bio: string;
                } | {
                    p_profile_data: Json;
                };
                Returns: undefined;
            };
            update_vehicle: {
                Args: {
                    p_vehicle_id: string;
                    p_make_id: string;
                    p_model_id: string;
                    p_variant_id: string;
                    p_suburb_id: string;
                    p_year: number;
                    p_price: number;
                    p_mileage: number;
                    p_description: string;
                    p_vin: string;
                    p_images: string[];
                    p_feature_ids: string[];
                };
                Returns: undefined;
            };
            update_vehicle_features: {
                Args: {
                    p_vehicle_id: string;
                    p_feature_ids: string[];
                };
                Returns: undefined;
            };
            update_vehicle_listing: {
                Args: {
                    p_listing_id: number;
                    p_mileage: number;
                    p_price: number;
                    p_vin: string;
                    p_description: string;
                    p_feature_ids: number[];
                    p_new_image_urls: string[];
                    p_deleted_image_urls: string[];
                } | {
                    p_listing_id: number;
                    p_mileage: number;
                    p_price: number;
                    p_vin: string;
                    p_description: string;
                    p_feature_ids: number[];
                    p_new_image_urls: string[];
                    p_deleted_image_urls: string[];
                    p_is_sold: boolean;
                } | {
                    p_listing_id: number;
                    p_price: number;
                    p_mileage: number;
                    p_description: string;
                    p_vin: string;
                    p_feature_ids: number[];
                    p_new_image_urls: string[];
                    p_deleted_image_urls: string[];
                    p_is_sold: boolean;
                } | {
                    p_listing_id: number;
                    p_price?: number;
                    p_mileage?: number;
                    p_description?: string;
                    p_feature_ids?: number[];
                } | {
                    p_listing_id: number;
                    p_price?: number;
                    p_mileage?: number;
                    p_description?: string;
                    p_feature_ids?: number[];
                    p_body_type_id?: number;
                    p_transmission_type_id?: number;
                    p_fuel_type_id?: number;
                    p_drivetrain_id?: number;
                    p_engine_size_id?: number;
                    p_door_id?: number;
                } | {
                    p_listing_id: number;
                    p_price?: number;
                    p_mileage?: number;
                    p_description?: string;
                    p_feature_ids?: number[];
                    p_body_type_id?: number;
                    p_transmission_type_id?: number;
                    p_fuel_type_id?: number;
                    p_drivetrain_id?: number;
                    p_engine_size_id?: number;
                    p_door_id?: number;
                    p_images?: string[];
                } | {
                    p_listing_id: number;
                    p_user_id: string;
                    p_province_id?: number;
                    p_price?: number;
                    p_mileage?: number;
                    p_description?: string;
                    p_is_sold?: boolean;
                    p_feature_ids?: number[];
                };
                Returns: undefined;
            };
            update_vehicle_listing_atomic: {
                Args: {
                    p_listing_id: number;
                    p_price: number;
                    p_mileage: number;
                    p_description: string;
                    p_is_sold: boolean;
                    p_images: string[];
                    p_feature_ids: number[];
                };
                Returns: undefined;
            };
        };
        Enums: {
            location_type: "Residential" | "Commercial";
            location_type_enum: "Urban" | "Rural" | "Suburban";
            offer_status: "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTERED";
            residential_type: "Free Standing" | "Complex" | "Estate";
            residential_type_enum: "House" | "Apartment" | "Complex" | "Estate";
            sa_province: "Eastern Cape" | "Free State" | "Gauteng" | "KwaZulu-Natal" | "Limpopo" | "Mpumalanga" | "Northern Cape" | "North West" | "Western Cape";
            vehicle_status: "AVAILABLE" | "SOLD" | "PENDING";
        };
        CompositeTypes: {
            dashboard_conversation: {
                conversation_id: string | null;
                other_participant_id: string | null;
                other_participant_name: string | null;
                other_participant_avatar_url: string | null;
                last_message_preview: string | null;
                last_message_at: string | null;
                listing_id: number | null;
                listing_title: string | null;
                is_read: boolean | null;
            };
            dashboard_offer: {
                offer_id: number | null;
                listing_id: number | null;
                listing_title: string | null;
                offer_amount: number | null;
                offer_status: Database["public"]["Enums"]["offer_status"] | null;
                created_at: string | null;
                is_seller: boolean | null;
                other_participant_name: string | null;
            };
        };
    };
};
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
type Tables$1<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;

type TypedSupabaseClient = SupabaseClient<Database>;
type Tables<T extends keyof (Database['public']['Tables'] & Database['public']['Views'])> = (Database['public']['Tables'] & Database['public']['Views'])[T]['Row'];
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
type Functions = Database['public']['Functions'];

type Conversation = Tables<'conversations'>;
type VehicleListingDetailed = Tables<'vehicle_listings_detailed'>;
type Listing = Tables<'vehicle_listings'>;
type Profile = Tables<'profiles'>;
type ListingStatus = Enums<'vehicle_status'>;
type FilterOptionsResponse = {
    makes: {
        id: number;
        name: string;
    }[];
    models: {
        id: number;
        name: string;
    }[];
    bodyTypes: {
        id: number;
        name: string;
    }[];
};
type VehicleWithDetails = VehicleListingDetailed & {
    features: {
        feature_name: string;
    }[];
};
type Make = Tables<'vehicle_makes'>;
type Model = Tables<'vehicle_models'>;
type Feature = Tables<'vehicle_features'>;
type VehicleVariant = Tables<'vehicle_variants'>;

type VehicleFeature = Database['public']['Tables']['vehicle_features']['Row'];

type VehicleAspiration = Database['public']['Tables']['vehicle_aspirations']['Row'];
type VehicleBodyType = Database['public']['Tables']['vehicle_body_types']['Row'];
type VehicleDoor = Database['public']['Tables']['vehicle_doors']['Row'];
type VehicleDrivetrain = Database['public']['Tables']['vehicle_drivetrains']['Row'];
type VehicleEngineSize = Database['public']['Tables']['vehicle_engine_sizes']['Row'];
type VehicleFuelType = Database['public']['Tables']['vehicle_fuel_types']['Row'];
type VehicleMake = Database['public']['Tables']['vehicle_makes']['Row'];
type VehicleModel = Database['public']['Tables']['vehicle_models']['Row'];
type VehicleTransmissionType = Database['public']['Tables']['vehicle_transmission_types']['Row'];
type Aspiration = VehicleAspiration;
type BodyType = VehicleBodyType;
type Door = VehicleDoor;
type Drivetrain = VehicleDrivetrain;
type EngineSize = VehicleEngineSize;
type FuelType = VehicleFuelType;
type TransmissionType = VehicleTransmissionType;

type Message = Database['public']['Tables']['messages']['Row'];

type ConversationWithDetails = Tables$1<'conversation_details'>;
type MessageWithSenderDetails = Message & {
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
};
type SendMessagePayload = {
    conversationId: string;
    content: string;
};

type Offer = Database['public']['Tables']['offers']['Row'];

type OfferStatus = Tables$1<'offers'>['status'];
type CreateOfferPayload = {
    conversationId: string;
    amount: number;
    recipientId: string;
};
type CounterOfferPayload = {
    originalOfferId: string;
    newAmount: number;
};

/**
 * Represents a province.
 */
interface Province {
    id: string;
    name: string;
}
/**
 * Represents a city, which belongs to a province.
 */
interface City {
    id: string;
    province_id: string;
    name: string;
}
/**
 * Represents a suburb, which belongs to a city.
 */
interface Suburb {
    id: string;
    city_id: string;
    name: string;
}

/**
 * A helper type to safely extract the element type from a potential array within a Json response.
 * If the type T is an array (like U[]), it returns U. Otherwise, it returns T.
 */
type UnboxJsonArray<T> = T extends (infer U)[] ? U : T;
/**
 * Represents a vehicle listing with its images.
 */
type VehicleWithImages = {
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
type VehicleSearchResult = UnboxJsonArray<Functions['search_and_filter_vehicles']['Returns']> & {
    total_count: number;
};
/**
 * Defines the shape of the filters used for searching and filtering vehicles.
 */
interface VehicleFilters {
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
interface VehicleLookup {
    id?: number;
    vin?: string;
    make?: string;
    model?: string;
    year?: number;
}

/**
 * Defines the validation schema for the user profile form.
 */
declare const profileFormSchema: z.ZodObject<{
    display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    first_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    last_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contact_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    residential_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    complex_or_estate_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    unit_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    street_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    street_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    postcode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    province_id: z.ZodOptional<z.ZodNumber>;
    city_id: z.ZodOptional<z.ZodNumber>;
    suburb_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    province_id?: number | undefined;
    city_id?: number | undefined;
    location_type?: string | null | undefined;
    residential_type?: string | null | undefined;
    complex_or_estate_name?: string | null | undefined;
    contact_number?: string | null | undefined;
    display_name?: string | null | undefined;
    first_name?: string | null | undefined;
    last_name?: string | null | undefined;
    postcode?: string | null | undefined;
    street_name?: string | null | undefined;
    street_number?: string | null | undefined;
    suburb_id?: number | undefined;
    unit_number?: string | null | undefined;
}, {
    province_id?: number | undefined;
    city_id?: number | undefined;
    location_type?: string | null | undefined;
    residential_type?: string | null | undefined;
    complex_or_estate_name?: string | null | undefined;
    contact_number?: string | null | undefined;
    display_name?: string | null | undefined;
    first_name?: string | null | undefined;
    last_name?: string | null | undefined;
    postcode?: string | null | undefined;
    street_name?: string | null | undefined;
    street_number?: string | null | undefined;
    suburb_id?: number | undefined;
    unit_number?: string | null | undefined;
}>;
type ProfileFormValues = z.infer<typeof profileFormSchema>;
/**
 * Defines the validation schema for the vehicle creation/editing form.
 */
declare const vehicleFormSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    make_id: z.ZodNumber;
    model_id: z.ZodNumber;
    year: z.ZodNumber;
    price: z.ZodNumber;
    mileage: z.ZodNumber;
    vin: z.ZodString;
    description: z.ZodString;
    images: z.ZodArray<z.ZodString, "many">;
    feature_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    body_type_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    drivetrain_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    fuel_type_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    transmission_type_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    engine_size_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    aspiration_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    doors_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    make_id: number;
    model_id: number;
    description: string;
    images: string[];
    mileage: number;
    price: number;
    vin: string;
    year: number;
    id?: number | undefined;
    aspiration_id?: number | null | undefined;
    body_type_id?: number | null | undefined;
    drivetrain_id?: number | null | undefined;
    engine_size_id?: number | null | undefined;
    fuel_type_id?: number | null | undefined;
    transmission_type_id?: number | null | undefined;
    feature_ids?: number[] | undefined;
    doors_id?: number | null | undefined;
}, {
    make_id: number;
    model_id: number;
    description: string;
    images: string[];
    mileage: number;
    price: number;
    vin: string;
    year: number;
    id?: number | undefined;
    aspiration_id?: number | null | undefined;
    body_type_id?: number | null | undefined;
    drivetrain_id?: number | null | undefined;
    engine_size_id?: number | null | undefined;
    fuel_type_id?: number | null | undefined;
    transmission_type_id?: number | null | undefined;
    feature_ids?: number[] | undefined;
    doors_id?: number | null | undefined;
}>;
type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
/**
 * Defines the shape of the options returned for vehicle variants.
 */
declare const VariantOptionSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
}, {
    id: number;
    name: string;
}>;
type VehicleVariantOptions = {
    body_types: z.infer<typeof VariantOptionSchema>[];
    drivetrains: z.infer<typeof VariantOptionSchema>[];
    fuel_types: z.infer<typeof VariantOptionSchema>[];
    transmission_types: z.infer<typeof VariantOptionSchema>[];
    engine_sizes: z.infer<typeof VariantOptionSchema>[];
    aspirations: z.infer<typeof VariantOptionSchema>[];
    doors: z.infer<typeof VariantOptionSchema>[];
};

export { type Aspiration, BODY_TYPES, type BodyType, type City, type Conversation, type ConversationWithDetails, type CounterOfferPayload, type CreateOfferPayload, type Database, type Door, type Drivetrain, type EngineSize, type Enums, FUEL_TYPES, type Feature, type FilterOptionsResponse, type FuelType, type Functions, type Json, LOCATION_TYPES, type Listing, type ListingStatus, type Make, type Message, type MessageWithSenderDetails, type Model, type Offer, type OfferStatus, type Profile, type ProfileFormValues, type Province, RESIDENTIAL_TYPES, type SendMessagePayload, type SignInInput, type SignUpInput, type Suburb, TRANSMISSION_TYPES, type Tables, type TablesInsert, type TablesUpdate, type TransmissionType, type TypedSupabaseClient, type UpdatePasswordInput, type VehicleAspiration, type VehicleBodyType, type VehicleDoor, type VehicleDrivetrain, type VehicleEngineSize, type VehicleFeature, type VehicleFilters, type VehicleFormValues, type VehicleFuelType, type VehicleListingDetailed, type VehicleLookup, type VehicleMake, type VehicleModel, type VehicleSearchResult, type VehicleTransmissionType, type VehicleVariant, type VehicleVariantOptions, type VehicleWithDetails, type VehicleWithImages, profileFormSchema, signInSchema, signUpSchema, updatePasswordSchema, vehicleFormSchema };
