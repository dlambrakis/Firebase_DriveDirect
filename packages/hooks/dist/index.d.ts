import * as _supabase_supabase_js from '@supabase/supabase-js';
import { Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, UserAttributes, SupabaseClient } from '@supabase/supabase-js';
import * as _tanstack_react_query from '@tanstack/react-query';
import { UseQueryOptions } from '@tanstack/react-query';
import * as _directdrive_core_types from '@directdrive/core-types';
import { VehicleWithImages, ProfileFormValues, Database, Offer, Profile, VehicleListingDetailed, VehicleFormValues, VehicleVariantOptions, VehicleLookup, VehicleFilters, VehicleSearchResult } from '@directdrive/core-types';
import * as react_hook_form from 'react-hook-form';
import React from 'react';

declare const useAuth: () => {
    session: Session | null | undefined;
    user: _supabase_supabase_js.AuthUser | null;
    isLoading: boolean;
    isError: boolean;
    isAuthenticated: boolean;
};

declare const useSignIn: () => _tanstack_react_query.UseMutationResult<{
    user: _supabase_supabase_js.AuthUser;
    session: _supabase_supabase_js.AuthSession;
    weakPassword?: _supabase_supabase_js.WeakPassword;
}, Error, SignInWithPasswordCredentials, unknown>;
declare const useSignUp: () => _tanstack_react_query.UseMutationResult<{
    user: _supabase_supabase_js.AuthUser | null;
    session: _supabase_supabase_js.AuthSession | null;
}, Error, SignUpWithPasswordCredentials, unknown>;
declare const useSignOut: () => _tanstack_react_query.UseMutationResult<void, Error, void, unknown>;
declare const useForgotPassword: () => _tanstack_react_query.UseMutationResult<void, Error, string, unknown>;
declare const useUpdatePassword: () => _tanstack_react_query.UseMutationResult<{
    user: _supabase_supabase_js.AuthUser;
}, Error, UserAttributes, unknown>;

declare const useConversation: (conversationId: string | undefined) => _tanstack_react_query.UseQueryResult<{
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
} | null, Error>;

interface CreateConversationPayload {
    listingId: number;
    sellerId: string;
    messageContent: string;
}
declare const useCreateConversation: () => _tanstack_react_query.UseMutationResult<string, Error, CreateConversationPayload, unknown>;
interface SendMessagePayload {
    conversationId: string;
    content: string;
}
declare const useSendMessage: () => _tanstack_react_query.UseMutationResult<any, Error, SendMessagePayload, unknown>;
declare const useDeleteConversation: () => _tanstack_react_query.UseMutationResult<boolean, Error, string, unknown>;

declare const useConversations: () => _tanstack_react_query.UseQueryResult<{
    buyer_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    seller_id: number | null;
    updated_at: string;
    vehicle_id: string;
    vehicle_listing_id: number | null;
}[], Error>;

declare const useConversationStream: (conversationId?: string | null) => _tanstack_react_query.UseQueryResult<{
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
} | null, Error>;

declare const useDebounce: <T>(value: T, delay: number) => T;

declare const useFetchSavedVehicleListings: (userId: string | undefined) => _tanstack_react_query.UseQueryResult<Set<number>, Error>;
declare const useFetchFullSavedListings: (userId: string | undefined) => _tanstack_react_query.UseQueryResult<VehicleWithImages[], Error>;

type SimpleVariant = {
    id: number;
    name: string;
};
interface VariantFilters {
    modelId?: number;
    year?: number;
    bodyTypeId?: number;
    transmissionTypeId?: number;
    fuelTypeId?: number;
    drivetrainId?: number;
    engineSizeId?: number;
    aspirationId?: number;
    doorId?: number;
}
declare const useFilteredVariants: (filters: VariantFilters) => _tanstack_react_query.UseQueryResult<SimpleVariant[], Error>;

declare const useListing: (listingId: string | undefined) => _tanstack_react_query.UseQueryResult<{
    created_at: string | null;
    description: string | null;
    features: _directdrive_core_types.Json | null;
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
} | null, Error>;

type LocationType = 'provinces' | 'cities' | 'suburbs';
declare const useLocations: (locationType: LocationType, parentId?: number | null) => _tanstack_react_query.UseQueryResult<{
    id: number;
    name: string;
}[], Error>;

declare const useMessages: (conversationId: number | undefined) => _tanstack_react_query.UseQueryResult<{
    content: string;
    conversation_id: number | null;
    created_at: string;
    id: number;
    is_read: boolean;
    is_system_message: boolean;
    public_id: string;
    sender_id: number | null;
}[], Error>;

declare const useNegotiation: () => {
    createOffer: _tanstack_react_query.UseMutateFunction<{
        amount: number;
        conversation_id: number | null;
        created_at: string;
        id: number;
        public_id: string;
        recipient_id: number | null;
        sender_id: number | null;
        status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
        updated_at: string | null;
        vehicle_id: string | null;
    } | null, Error, {
        conversationId: number;
        amount: number;
        recipientId: number;
        vehicleId: string;
    }, unknown>;
    isCreatingOffer: boolean;
    createOfferError: Error | null;
    respondToOffer: _tanstack_react_query.UseMutateFunction<{
        amount: number;
        conversation_id: number | null;
        created_at: string;
        id: number;
        public_id: string;
        recipient_id: number | null;
        sender_id: number | null;
        status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
        updated_at: string | null;
        vehicle_id: string | null;
    } | null, Error, {
        offerId: number;
        newStatus: "ACCEPTED" | "REJECTED";
    }, unknown>;
    isRespondingToOffer: boolean;
    respondToOfferError: Error | null;
    counterOffer: _tanstack_react_query.UseMutateFunction<{
        conversation_id?: number;
    } | null, Error, {
        originalOfferId: number;
        newAmount: number;
    }, unknown>;
    isCounteringOffer: boolean;
    counterOfferError: Error | null;
};

interface CreateOfferVariables {
    conversationId: string;
    recipientId: string;
    amount: number;
}
declare const useCreateOffer: () => _tanstack_react_query.UseMutationResult<{
    amount: number;
    conversation_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    recipient_id: number | null;
    sender_id: number | null;
    status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
    updated_at: string | null;
    vehicle_id: string | null;
}, Error, CreateOfferVariables, unknown>;
interface CounterOfferVariables {
    offerId: string;
    newAmount: number;
    conversationId: string;
}
declare const useCounterOffer: () => _tanstack_react_query.UseMutationResult<{
    amount: number;
    conversation_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    recipient_id: number | null;
    sender_id: number | null;
    status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
    updated_at: string | null;
    vehicle_id: string | null;
}, Error, CounterOfferVariables, unknown>;
interface AcceptOfferVariables {
    offerId: string;
    conversationId: string;
}
declare const useAcceptOffer: () => _tanstack_react_query.UseMutationResult<{
    amount: number;
    conversation_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    recipient_id: number | null;
    sender_id: number | null;
    status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
    updated_at: string | null;
    vehicle_id: string | null;
}, Error, AcceptOfferVariables, unknown>;
interface DeclineOfferVariables {
    offerId: string;
    conversationId: string;
}
declare const useDeclineOffer: () => _tanstack_react_query.UseMutationResult<{
    amount: number;
    conversation_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    recipient_id: number | null;
    sender_id: number | null;
    status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
    updated_at: string | null;
    vehicle_id: string | null;
}, Error, DeclineOfferVariables, unknown>;

declare const useOffers: (listingId: number | undefined) => _tanstack_react_query.UseQueryResult<{
    amount: number;
    conversation_id: number | null;
    created_at: string;
    id: number;
    public_id: string;
    recipient_id: number | null;
    sender_id: number | null;
    status: _directdrive_core_types.Database["public"]["Enums"]["offer_status"];
    updated_at: string | null;
    vehicle_id: string | null;
}[], Error>;

/**
 * Fetches the public profile of a specific user.
 * If no userId is provided, it fetches the profile of the currently authenticated user.
 * The query is disabled if no user is specified or authenticated.
 */
declare const useProfile: (userId?: string) => _tanstack_react_query.UseQueryResult<{
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
    location_type: _directdrive_core_types.Database["public"]["Enums"]["location_type_enum"] | null;
    postcode: string | null;
    province_id: number | null;
    public_id: string;
    residential_type: _directdrive_core_types.Database["public"]["Enums"]["residential_type_enum"] | null;
    street_name: string | null;
    street_number: string | null;
    suburb_id: number | null;
    unit_number: string | null;
    updated_at: string | null;
    user_id: string;
} | null, Error>;

declare const useProfileFormLogic: () => {
    form: react_hook_form.UseFormReturn<{
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
    }, any, {
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
    onSubmit: (data: ProfileFormValues, onSuccess?: () => void, onError?: (error: Error) => void) => void;
    isUpdating: boolean;
    isLoadingProfile: boolean;
    provinces: {
        id: number;
        name: string;
    }[] | undefined;
    isLoadingProvinces: boolean;
    cities: {
        id: number;
        name: string;
    }[] | undefined;
    isLoadingCities: boolean;
    suburbs: {
        id: number;
        name: string;
    }[] | undefined;
    isLoadingSuburbs: boolean;
};

declare const useRejectOffer: () => _tanstack_react_query.UseMutationResult<{
    success: boolean;
}, Error, {
    offerId: number;
    listingId: number;
}, unknown>;

interface RequestPasswordResetVariables {
    email: string;
    redirectTo: string;
}
declare const useRequestPasswordReset: () => _tanstack_react_query.UseMutationResult<void, Error, RequestPasswordResetVariables, unknown>;

declare const useS3: () => {
    upload: (bucket: string, path: string, file: File) => Promise<{
        id: string;
        path: string;
        fullPath: string;
    }>;
    getPublicUrl: (bucket: string, path: string) => string;
};

type DirectDriveSupabaseClient = SupabaseClient<Database>;
interface SupabaseProviderProps {
    children: React.ReactNode;
    client: DirectDriveSupabaseClient;
}
declare const SupabaseProvider: React.FC<SupabaseProviderProps>;
declare const useSupabase: () => DirectDriveSupabaseClient;

interface ToggleSaveVehiclePayload {
    listingId: number;
    isSaved: boolean;
}
declare const useToggleSaveVehicle: () => _tanstack_react_query.UseMutationResult<boolean, Error, ToggleSaveVehiclePayload, unknown>;

/**
 * Provides a mutation function to update the currently authenticated user's profile.
 * The RPC 'update_user_profile' does not exist; this uses a standard table update.
 */
declare const useUpdateProfile: () => _tanstack_react_query.UseMutationResult<void, Error, {
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
}, unknown>;

declare const useUploadImages: () => _tanstack_react_query.UseMutationResult<string[], Error, File[], unknown>;

declare const useUploadMultipleFiles: (bucket: string) => {
    uploadFiles: (files: File[], basePath: string) => Promise<string[]>;
    uploading: boolean;
    error: string | null;
};

interface DashboardSummary {
    active_listings_count: number;
    unread_messages_count: number;
    active_offers_count: number;
}
interface RecentListing {
    listing_id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    province_name: string;
    status: string;
    created_at: string;
}
interface RecentConversation {
    id: string;
    listing_id: number | null;
    last_message_preview: string | null;
    last_message_at: string | null;
    last_message_sender_id: number | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    vehicle_image: string | null;
    other_user_name: string | null;
    other_user_avatar: string | null;
    unread_count: number;
}
interface RecentOffer {
    id: string;
    listing_id: number;
    amount: number;
    status: Offer['status'];
    created_at: string;
    sender_id: number | null;
    recipient_id: number | null;
    listing_title: string | null;
    listing_image_url: string | null;
}
interface DashboardData {
    summary: DashboardSummary;
    recent_listings: RecentListing[];
    recent_conversations: RecentConversation[];
    recent_offers: RecentOffer[];
}
declare const useUserDashboardData: () => _tanstack_react_query.UseQueryResult<DashboardData | null, Error>;

/**
 * Fetches all vehicle listings created by the currently authenticated user.
 */
declare const useUserListings: () => _tanstack_react_query.UseQueryResult<{
    created_at: string | null;
    description: string | null;
    features: _directdrive_core_types.Json | null;
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
}[], Error>;

interface UserLocationProfile extends Profile {
    province_name: string | null;
}
declare const useUserLocationProfile: (userId: string | undefined) => _tanstack_react_query.UseQueryResult<UserLocationProfile | null, Error>;

type SimpleAttribute = {
    id: number;
    name: string;
};
declare const useVehicleAttribute: (attributeNamePlural: string, attributeNameSingular: string, modelId: number | undefined, year: number | undefined) => _tanstack_react_query.UseQueryResult<SimpleAttribute[], Error>;

type VehicleDetailsForUser = VehicleListingDetailed & {
    is_saved: boolean;
};
declare const useVehicleDetails: (listingId: string | undefined, userId?: string, options?: Omit<UseQueryOptions<VehicleDetailsForUser, Error>, "queryKey" | "queryFn" | "enabled">) => _tanstack_react_query.UseQueryResult<VehicleDetailsForUser, Error>;

declare const useVehicleFeatures: () => _tanstack_react_query.UseQueryResult<{
    feature_id: number;
    feature_name: string;
    is_active: boolean | null;
}[], Error>;

declare const useVehicleFormLogic: ({ defaultValues }: {
    defaultValues?: Partial<VehicleFormValues>;
}) => {
    form: react_hook_form.UseFormReturn<{
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
    }, any, {
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
    makes: {
        is_active: boolean | null;
        make: string;
        make_id: number;
    }[] | undefined;
    isLoadingMakes: boolean;
    models: {
        is_active: boolean | null;
        model: string;
        model_id: number;
    }[] | undefined;
    isLoadingModels: boolean;
    years: {
        year: number;
    }[] | undefined;
    isLoadingYears: boolean;
    features: {
        feature_id: number;
        feature_name: string;
        is_active: boolean | null;
    }[] | undefined;
    isLoadingFeatures: boolean;
    variantOptions: VehicleVariantOptions | undefined;
    isLoadingVariants: boolean;
    attributesDisabled: boolean;
};

type SimpleMake = {
    id: number;
    name: string;
};
declare const useVehicleMakes: () => _tanstack_react_query.UseQueryResult<SimpleMake[], Error>;

declare const useVehicleModels: (makeId: number | undefined) => _tanstack_react_query.UseQueryResult<VehicleLookup[], Error>;

declare const useVehicleModelsByMakes: (makeIds: string[] | undefined) => _tanstack_react_query.UseQueryResult<VehicleLookup[], Error>;

declare const useCreateVehicleListing: () => _tanstack_react_query.UseMutationResult<_directdrive_core_types.Json, Error, {
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
}, unknown>;
declare const useUpdateVehicleListing: () => _tanstack_react_query.UseMutationResult<undefined, Error, {
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
}, unknown>;

type VehicleOptionType = 'make' | 'body_type' | 'fuel_type' | 'transmission_type' | 'drivetrain';
/**
 * Fetches vehicle lookup options.
 * This has been refactored to use a switch statement to avoid the TS2769 error,
 * ensuring that supabase.from() is called with a string literal.
 */
declare const useVehicleOptions: (optionType: VehicleOptionType) => _tanstack_react_query.UseQueryResult<VehicleLookup[], Error>;

declare const useVehicleSearch: (filters: VehicleFilters) => _tanstack_react_query.UseQueryResult<VehicleSearchResult[], Error>;

declare const useVehicleVariantsByMakesAndModels: (makeIds: string[], modelIds: string[]) => _tanstack_react_query.UseQueryResult<{
    is_active: boolean | null;
    variant: string;
    variant_id: number;
}[], Error>;

declare const useVehicleYearsForModel: (modelId: number | null, enabled?: boolean) => _tanstack_react_query.UseQueryResult<number[], Error>;

declare const useVehicleYearsForVariant: (variantId: number | null) => _tanstack_react_query.UseQueryResult<number[], Error>;

export { type DashboardData, type DashboardSummary, type DirectDriveSupabaseClient, type RecentConversation, type RecentListing, type RecentOffer, type SimpleAttribute, type SimpleMake, type SimpleVariant, SupabaseProvider, type VariantFilters, useAcceptOffer, useAuth, useConversation, useConversationStream, useConversations, useCounterOffer, useCreateConversation, useCreateOffer, useCreateVehicleListing, useDebounce, useDeclineOffer, useDeleteConversation, useFetchFullSavedListings, useFetchSavedVehicleListings, useFilteredVariants, useForgotPassword, useListing, useLocations, useMessages, useNegotiation, useOffers, useProfile, useProfileFormLogic, useRejectOffer, useRequestPasswordReset, useS3, useSendMessage, useSignIn, useSignOut, useSignUp, useSupabase, useToggleSaveVehicle, useUpdatePassword, useUpdateProfile, useUpdateVehicleListing, useUploadImages, useUploadMultipleFiles, useUserDashboardData, useUserListings, useUserLocationProfile, useVehicleAttribute, useVehicleDetails, useVehicleFeatures, useVehicleFormLogic, useVehicleMakes, useVehicleModels, useVehicleModelsByMakes, useVehicleOptions, useVehicleSearch, useVehicleVariantsByMakesAndModels, useVehicleYearsForModel, useVehicleYearsForVariant };
