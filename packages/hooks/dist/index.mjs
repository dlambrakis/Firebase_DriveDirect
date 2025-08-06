// src/useAuth.ts
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@directdrive/supabase-client/singleton";
var getSession = async () => {
  const supabase6 = getSupabase();
  const { data, error } = await supabase6.auth.getSession();
  if (error) throw error;
  return data.session;
};
var useAuth = () => {
  const queryClient = useQueryClient();
  const { data: session, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    staleTime: Infinity,
    gcTime: Infinity
  });
  useEffect(() => {
    const supabase6 = getSupabase();
    const {
      data: { subscription }
    } = supabase6.auth.onAuthStateChange(
      (_event, session2) => {
        queryClient.setQueryData(["session"], session2);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
  const user = useMemo(() => session?.user ?? null, [session]);
  return {
    session,
    user,
    isLoading,
    isError,
    isAuthenticated: !!user
  };
};

// src/useAuthMutations.ts
import { useMutation, useQueryClient as useQueryClient2 } from "@tanstack/react-query";
import { getSupabase as getSupabase2 } from "@directdrive/supabase-client/singleton";
var signIn = async (credentials) => {
  const supabase6 = getSupabase2();
  const { data, error } = await supabase6.auth.signInWithPassword(credentials);
  if (error) throw error;
  return data;
};
var useSignIn = () => {
  const queryClient = useQueryClient2();
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Sign-in error:", error.message);
    }
  });
};
var signUp = async (credentials) => {
  const supabase6 = getSupabase2();
  const { data, error } = await supabase6.auth.signUp(credentials);
  if (error) throw error;
  return data;
};
var useSignUp = () => {
  const queryClient = useQueryClient2();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data.session) {
        queryClient.setQueryData(["session"], data.session);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
    onError: (error) => {
      console.error("Sign-up error:", error.message);
    }
  });
};
var signOut = async () => {
  const supabase6 = getSupabase2();
  const { error } = await supabase6.auth.signOut();
  if (error) throw error;
};
var useSignOut = () => {
  const queryClient = useQueryClient2();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign-out error:", error.message);
    }
  });
};
var forgotPassword = async (email) => {
  const supabase6 = getSupabase2();
  const redirectTo = `${process.env.EXPO_PUBLIC_WEB_URL || window.location.origin}/update-password`;
  const { error } = await supabase6.auth.resetPasswordForEmail(email, {
    redirectTo
  });
  if (error) throw error;
};
var useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      console.error("Forgot password error:", error.message);
    }
  });
};
var updatePassword = async (credentials) => {
  const supabase6 = getSupabase2();
  const { data, error } = await supabase6.auth.updateUser(credentials);
  if (error) throw error;
  return data;
};
var useUpdatePassword = () => {
  const queryClient = useQueryClient2();
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Update password error:", error.message);
    }
  });
};

// src/useConversation.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
import { getSupabase as getSupabase3 } from "@directdrive/supabase-client/singleton";
var useConversation = (conversationId) => {
  const supabase6 = getSupabase3();
  return useQuery2({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase6.from("conversation_details").select("*").eq("id", parseInt(conversationId)).single();
      if (error) {
        console.error(`Error fetching conversation ${conversationId}:`, error);
        throw error;
      }
      return data;
    },
    enabled: !!conversationId
  });
};

// src/useConversationMutations.ts
import { useMutation as useMutation2, useQueryClient as useQueryClient3 } from "@tanstack/react-query";
import { getSupabase as getSupabase4 } from "@directdrive/supabase-client/singleton";
var createConversation = async ({
  listingId,
  sellerId,
  messageContent
}) => {
  const supabase6 = getSupabase4();
  const { data, error } = await supabase6.rpc(
    "create_conversation_and_message",
    {
      p_listing_id: listingId,
      p_seller_id: sellerId,
      p_message_content: messageContent
    }
  );
  if (error) throw new Error(error.message);
  return data;
};
var useCreateConversation = () => {
  const queryClient = useQueryClient3();
  return useMutation2({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var sendMessage = async ({ conversationId, content }) => {
  const supabase6 = getSupabase4();
  const { data, error } = await supabase6.rpc("send_message", {
    p_conversation_id: conversationId,
    p_content: content
  });
  if (error) throw new Error(error.message);
  return data;
};
var useSendMessage = () => {
  const queryClient = useQueryClient3();
  return useMutation2({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId]
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var deleteConversation = async (conversationId) => {
  const supabase6 = getSupabase4();
  const { error } = await supabase6.rpc("delete_conversation_for_user", {
    p_conversation_id: conversationId
  });
  if (error) throw new Error(error.message);
  return true;
};
var useDeleteConversation = () => {
  const queryClient = useQueryClient3();
  return useMutation2({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};

// src/useConversations.ts
import { useQuery as useQuery3 } from "@tanstack/react-query";

// src/useSupabase.ts
import React, { createContext, useContext } from "react";
var SupabaseContext = createContext(null);
var SupabaseProvider = ({ children, client }) => {
  return React.createElement(SupabaseContext.Provider, { value: client }, children);
};
var useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

// src/useConversations.ts
var useConversations = () => {
  const supabase6 = useSupabase();
  const { user } = useAuth();
  return useQuery3({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!supabase6 || !user) return [];
      const { data, error } = await supabase6.from("conversations").select("*").or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`);
      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase6 && !!user
  });
};

// src/useConversationStream.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import { getSupabase as getSupabase5 } from "@directdrive/supabase-client/singleton";
var supabase = getSupabase5();
var useConversationStream = (conversationId) => {
  const conversationIdAsNumber = conversationId ? parseInt(conversationId, 10) : null;
  return useQuery4({
    queryKey: ["conversationStream", conversationIdAsNumber],
    queryFn: async () => {
      if (!conversationIdAsNumber || isNaN(conversationIdAsNumber)) return null;
      const { data, error } = await supabase.from("conversation_details").select("*").eq("id", conversationIdAsNumber).single();
      if (error) throw error;
      return data;
    },
    enabled: !!conversationIdAsNumber && !isNaN(conversationIdAsNumber),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};

// src/useDebounce.ts
import { useState, useEffect as useEffect2 } from "react";
var useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect2(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// src/useFetchSavedVehicleListings.ts
import { useQuery as useQuery5 } from "@tanstack/react-query";
import { getSupabase as getSupabase6 } from "@directdrive/supabase-client/singleton";
var fetchSavedVehicleListings = async (userId) => {
  if (!userId) {
    return { listings: [], savedSet: /* @__PURE__ */ new Set() };
  }
  const supabase6 = getSupabase6();
  const { data: savedData, error: savedError } = await supabase6.from("saved_vehicles").select("listing_id").eq("user_id", userId);
  if (savedError) {
    console.error("Error fetching saved vehicle IDs:", savedError);
    throw new Error(savedError.message);
  }
  if (!savedData || savedData.length === 0) {
    return { listings: [], savedSet: /* @__PURE__ */ new Set() };
  }
  const listingIds = savedData.map((item) => item.listing_id);
  const { data: vehicleData, error: vehicleError } = await supabase6.from("vehicle_listings").select(`
      listing_id,
      price,
      mileage,
      year,
      description,
      is_sold,
      created_at,
      province_id,
      images:vehicle_images(image_url),
      make:vehicle_makes(name),
      model:vehicle_models(name),
      variant:vehicle_variants(name),
      body_type:vehicle_body_types(name),
      transmission:vehicle_transmissions(name),
      fuel_type:vehicle_fuel_types(name),
      location:provinces(name)
    `).in("listing_id", listingIds);
  if (vehicleError) {
    console.error("Error fetching saved vehicles:", vehicleError);
    throw new Error(vehicleError.message);
  }
  if (!vehicleData) {
    return { listings: [], savedSet: /* @__PURE__ */ new Set() };
  }
  const listings = vehicleData.map((v) => ({
    ...v,
    images: v.images ? v.images.map((img) => img.image_url) : [],
    make: v.make?.name,
    model: v.model?.name,
    variant: v.variant?.name,
    body_type: v.body_type?.name,
    transmission: v.transmission?.name,
    fuel_type: v.fuel_type?.name,
    location: v.location?.name
  }));
  const savedSet = new Set(listingIds);
  return { listings, savedSet };
};
var useFetchSavedVehicleListings = (userId) => {
  return useQuery5({
    queryKey: ["fetchSavedVehicleListings", userId],
    queryFn: () => fetchSavedVehicleListings(userId),
    enabled: !!userId,
    select: (data) => data.savedSet
    // Only return the set for the VehicleCard use case
  });
};
var useFetchFullSavedListings = (userId) => {
  return useQuery5({
    queryKey: ["fetchSavedVehicleListings", userId],
    queryFn: () => fetchSavedVehicleListings(userId),
    enabled: !!userId,
    select: (data) => data.listings
    // Return the full listings for pages like "My Saved Vehicles"
  });
};

// src/useFilteredVariants.ts
import { useQuery as useQuery6 } from "@tanstack/react-query";
import { getSupabase as getSupabase7 } from "@directdrive/supabase-client/singleton";
var useFilteredVariants = (filters) => {
  const supabase6 = getSupabase7();
  return useQuery6({
    queryKey: ["filtered_variants", filters],
    queryFn: async () => {
      if (!filters.modelId) {
        return [];
      }
      const { data, error } = await supabase6.rpc("get_filtered_variants", {
        p_model_id: filters.modelId,
        p_year: filters.year,
        p_body_type_id: filters.bodyTypeId,
        p_transmission_type_id: filters.transmissionTypeId,
        p_fuel_type_id: filters.fuelTypeId,
        p_drivetrain_id: filters.drivetrainId,
        p_engine_size_id: filters.engineSizeId,
        p_aspiration_id: filters.aspirationId,
        p_door_id: filters.doorId
      });
      if (error) {
        console.error("Error fetching filtered variants:", error);
        throw error;
      }
      const variants = data;
      return (variants || []).map((v) => ({
        id: v.variant_id,
        name: v.variant
      }));
    },
    enabled: !!filters.modelId
  });
};

// src/useListing.ts
import { useQuery as useQuery7 } from "@tanstack/react-query";
var useListing = (listingId) => {
  const supabase6 = useSupabase();
  return useQuery7({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      if (!supabase6 || !listingId) {
        return null;
      }
      const parsedId = parseInt(listingId, 10);
      if (isNaN(parsedId)) {
        console.error("Invalid listing ID provided:", listingId);
        return null;
      }
      const { data, error } = await supabase6.from("vehicle_listings_detailed").select("*").eq("listing_id", parsedId).single();
      if (error) {
        console.error("Error fetching listing:", error);
        throw error;
      }
      return data;
    },
    enabled: !!supabase6 && !!listingId
  });
};

// src/useLocations.ts
import { useQuery as useQuery8 } from "@tanstack/react-query";
import { getSupabase as getSupabase8 } from "@directdrive/supabase-client/singleton";
var supabase2 = getSupabase8();
var fetchLocations = async (locationType, parentId) => {
  let query = supabase2.from(locationType).select("id, name");
  if (parentId) {
    if (locationType === "cities") {
      query = query.eq("province_id", parentId);
    } else if (locationType === "suburbs") {
      query = query.eq("city_id", parentId);
    }
  }
  const { data, error } = await query.order("name");
  if (error) throw new Error(error.message);
  return data || [];
};
var useLocations = (locationType, parentId) => {
  return useQuery8({
    queryKey: [locationType, parentId],
    queryFn: () => fetchLocations(locationType, parentId),
    enabled: locationType === "provinces" || !!parentId
    // Enable for provinces, or for others if parentId exists
  });
};

// src/useMessages.ts
import { useQuery as useQuery9 } from "@tanstack/react-query";
var useMessages = (conversationId) => {
  const supabase6 = useSupabase();
  return useQuery9({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!supabase6 || !conversationId) return [];
      const { data, error } = await supabase6.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase6 && !!conversationId
  });
};

// src/useNegotiation.ts
import { useMutation as useMutation3, useQueryClient as useQueryClient4 } from "@tanstack/react-query";
import { getSupabase as getSupabase9 } from "@directdrive/supabase-client/singleton";
var createOffer = async (params) => {
  const supabase6 = getSupabase9();
  const { data, error } = await supabase6.from("offers").insert({
    conversation_id: params.conversationId,
    amount: params.amount,
    recipient_id: params.recipientId,
    vehicle_id: params.vehicleId
  }).select().single();
  if (error) throw error;
  return data;
};
var useCreateOffer = () => {
  const queryClient = useQueryClient4();
  return useMutation3({
    mutationFn: createOffer,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["conversationStream", data.conversation_id]
        });
      }
    }
  });
};
var respondToOffer = async (params) => {
  const supabase6 = getSupabase9();
  const { data, error } = await supabase6.from("offers").update({ status: params.newStatus }).eq("id", params.offerId).select().single();
  if (error) throw error;
  return data;
};
var useRespondToOffer = () => {
  const queryClient = useQueryClient4();
  return useMutation3({
    mutationFn: respondToOffer,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["conversationStream", data.conversation_id]
        });
      }
    }
  });
};
var counterOffer = async (params) => {
  const supabase6 = getSupabase9();
  const { data, error } = await supabase6.rpc("create_counter_offer", {
    original_offer_id: String(params.originalOfferId),
    new_amount: params.newAmount
  }).select().single();
  if (error) throw error;
  return data;
};
var useCounterOffer = () => {
  const queryClient = useQueryClient4();
  return useMutation3({
    mutationFn: counterOffer,
    onSuccess: (data) => {
      if (data && data.conversation_id) {
        queryClient.invalidateQueries({
          queryKey: ["conversationStream", data.conversation_id]
        });
      }
    }
  });
};
var useNegotiation = () => {
  const createOfferMutation = useCreateOffer();
  const respondToOfferMutation = useRespondToOffer();
  const counterOfferMutation = useCounterOffer();
  return {
    createOffer: createOfferMutation.mutate,
    isCreatingOffer: createOfferMutation.isPending,
    createOfferError: createOfferMutation.error,
    respondToOffer: respondToOfferMutation.mutate,
    isRespondingToOffer: respondToOfferMutation.isPending,
    respondToOfferError: respondToOfferMutation.error,
    counterOffer: counterOfferMutation.mutate,
    isCounteringOffer: counterOfferMutation.isPending,
    counterOfferError: counterOfferMutation.error
  };
};

// src/useOfferMutations.ts
import { useMutation as useMutation4, useQueryClient as useQueryClient5 } from "@tanstack/react-query";
import { callRpc } from "@directdrive/supabase-client";
var useCreateOffer2 = () => {
  const queryClient = useQueryClient5();
  return useMutation4({
    mutationFn: (newOffer) => {
      return callRpc("create_offer", {
        p_conversation_id: newOffer.conversationId,
        p_recipient_id: newOffer.recipientId,
        p_amount: newOffer.amount
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var useCounterOffer2 = () => {
  const queryClient = useQueryClient5();
  return useMutation4({
    mutationFn: (variables) => callRpc("create_counter_offer", {
      original_offer_id: variables.offerId,
      new_amount: variables.newAmount
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var useAcceptOffer = () => {
  const queryClient = useQueryClient5();
  return useMutation4({
    mutationFn: (variables) => callRpc("accept_offer", { p_offer_id: variables.offerId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var useDeclineOffer = () => {
  const queryClient = useQueryClient5();
  return useMutation4({
    mutationFn: (variables) => {
      return callRpc("decline_offer", { p_offer_id: variables.offerId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};

// src/useOffers.ts
import { useQuery as useQuery10 } from "@tanstack/react-query";
var useOffers = (listingId) => {
  const supabase6 = useSupabase();
  return useQuery10({
    queryKey: ["offers", listingId],
    queryFn: async () => {
      if (!supabase6 || !listingId) return [];
      const { data, error } = await supabase6.from("offers").select("*").eq("listing_id", listingId).order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching offers:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase6 && !!listingId
  });
};

// src/useProfile.ts
import { useQuery as useQuery11 } from "@tanstack/react-query";
var useProfile = (userId) => {
  const supabase6 = useSupabase();
  const { user: authUser } = useAuth();
  const targetUserId = userId || authUser?.id;
  const fetchProfile = async () => {
    if (!targetUserId) return null;
    const { data, error } = await supabase6.from("profiles").select("*").eq("user_id", targetUserId).single();
    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching profile:", error);
      throw error;
    }
    return data;
  };
  return useQuery11({
    queryKey: ["profile", targetUserId],
    queryFn: fetchProfile,
    enabled: !!targetUserId
  });
};

// src/useProfileFormLogic.ts
import { useEffect as useEffect3 } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema } from "@directdrive/core-types";

// src/useUpdateProfile.ts
import { useMutation as useMutation5, useQueryClient as useQueryClient6 } from "@tanstack/react-query";
var useUpdateProfile = () => {
  const supabase6 = useSupabase();
  const queryClient = useQueryClient6();
  const { user } = useAuth();
  const updateProfile = async (profileData) => {
    if (!user?.id) {
      throw new Error("User not authenticated.");
    }
    const { error } = await supabase6.from("profiles").update(profileData).eq("user_id", user.id);
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
  return useMutation5({
    mutationFn: updateProfile,
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
        queryClient.invalidateQueries({ queryKey: ["dashboardData", user.id] });
      }
    }
  });
};

// src/useProfileFormLogic.ts
var useProfileFormLogic = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    // Default values now perfectly match the Zod schema
    defaultValues: {
      display_name: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      location_type: null,
      residential_type: null,
      complex_or_estate_name: null,
      unit_number: null,
      street_number: "",
      street_name: "",
      province_id: void 0,
      city_id: void 0,
      suburb_id: void 0,
      postcode: ""
    }
  });
  useEffect3(() => {
    if (profile) {
      const profileData = { ...profile };
      for (const key in profileData) {
        if (profileData[key] === null) {
          profileData[key] = "";
        }
      }
      form.reset(profileData);
    }
  }, [profile, form]);
  const provinceId = form.watch("province_id");
  const cityId = form.watch("city_id");
  const { data: provinces, isLoading: isLoadingProvinces } = useLocations("provinces");
  const { data: cities, isLoading: isLoadingCities } = useLocations("cities", provinceId);
  const { data: suburbs, isLoading: isLoadingSuburbs } = useLocations("suburbs", cityId);
  const onSubmit = (data, onSuccess, onError) => {
    updateProfile(data, {
      onSuccess,
      onError
    });
  };
  return {
    form,
    onSubmit,
    isUpdating,
    isLoadingProfile,
    provinces,
    isLoadingProvinces,
    cities,
    isLoadingCities,
    suburbs,
    isLoadingSuburbs
  };
};

// src/useRejectOffer.ts
import { useMutation as useMutation6, useQueryClient as useQueryClient7 } from "@tanstack/react-query";
var useRejectOffer = () => {
  const supabase6 = useSupabase();
  const queryClient = useQueryClient7();
  return useMutation6({
    mutationFn: async ({ offerId }) => {
      if (!supabase6) throw new Error("Supabase client not available");
      const { error } = await supabase6.from("offers").update({ status: "REJECTED" }).eq("id", offerId);
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.listingId] });
    }
  });
};

// src/useRequestPasswordReset.ts
import { useMutation as useMutation7 } from "@tanstack/react-query";
import { getSupabase as getSupabase10 } from "@directdrive/supabase-client/singleton";
var useRequestPasswordReset = () => {
  const supabase6 = getSupabase10();
  return useMutation7({
    mutationFn: async ({ email, redirectTo }) => {
      const { error } = await supabase6.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      if (error) {
        throw error;
      }
    }
  });
};

// src/useS3.ts
import { getSupabase as getSupabase11 } from "@directdrive/supabase-client/singleton";
var useS3 = () => {
  const supabase6 = getSupabase11();
  const upload = async (bucket, path, file) => {
    const { data, error } = await supabase6.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return data;
  };
  const getPublicUrl = (bucket, path) => {
    const { data } = supabase6.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };
  return { upload, getPublicUrl };
};

// src/useToggleSaveVehicle.ts
import { useMutation as useMutation8, useQueryClient as useQueryClient8 } from "@tanstack/react-query";
import { getSupabase as getSupabase12 } from "@directdrive/supabase-client/singleton";
var toggleSaveVehicle = async ({ listingId, isSaved }) => {
  const supabase6 = getSupabase12();
  const { data: { user } } = await supabase6.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated.");
  }
  if (isSaved) {
    const { error } = await supabase6.from("saved_vehicles").delete().eq("listing_id", listingId).eq("user_id", user.id);
    if (error) {
      console.error("Error unsaving vehicle:", error);
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase6.from("saved_vehicles").insert({ listing_id: listingId, user_id: user.id });
    if (error) {
      console.error("Error saving vehicle:", error);
      throw new Error(error.message);
    }
  }
  return true;
};
var useToggleSaveVehicle = () => {
  const queryClient = useQueryClient8();
  const { user } = useAuth();
  return useMutation8({
    mutationFn: toggleSaveVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSavedVehicleListings", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicleDetails"] });
    }
  });
};

// src/useUploadImages.ts
import { useMutation as useMutation9 } from "@tanstack/react-query";

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/rng.js
import { randomFillSync } from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/native.js
import { randomUUID } from "crypto";
var native_default = { randomUUID };

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/useUploadImages.ts
var useUploadImages = () => {
  const supabase6 = useSupabase();
  return useMutation9({
    mutationFn: async (files) => {
      if (!supabase6) throw new Error("Supabase client not available");
      if (!files || files.length === 0) return [];
      const uploadPromises = files.map((file) => {
        const fileName = `${v4_default()}-${file.name}`;
        return supabase6.storage.from("vehicle-images").upload(fileName, file);
      });
      const results = await Promise.all(uploadPromises);
      const uploadedImageUrls = [];
      for (const result of results) {
        if (result.error) {
          console.error("Error uploading image:", result.error);
          throw result.error;
        }
        if (result.data?.path) {
          const { data: { publicUrl } } = supabase6.storage.from("vehicle-images").getPublicUrl(result.data.path);
          uploadedImageUrls.push(publicUrl);
        }
      }
      return uploadedImageUrls;
    }
  });
};

// src/useUploadMultipleFiles.ts
import { useState as useState2 } from "react";
var useUploadMultipleFiles = (bucket) => {
  const { upload, getPublicUrl } = useS3();
  const [uploading, setUploading] = useState2(false);
  const [error, setError] = useState2(null);
  const uploadFiles = async (files, basePath) => {
    setUploading(true);
    setError(null);
    try {
      const uploadPromises = files.map((file) => {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        const uniqueFileName = `${timestamp}-${file.name}`;
        const filePath = `${basePath}/${uniqueFileName}`;
        return upload(bucket, filePath, file).then((data) => getPublicUrl(bucket, data.path));
      });
      const urls = await Promise.all(uploadPromises);
      setUploading(false);
      return urls;
    } catch (e) {
      setError(e.message);
      setUploading(false);
      return [];
    }
  };
  return { uploadFiles, uploading, error };
};

// src/useUserDashboardData.ts
import { useQuery as useQuery12 } from "@tanstack/react-query";
var useUserDashboardData = () => {
  const supabase6 = useSupabase();
  const { user } = useAuth();
  const userId = user?.id;
  const fetchDashboardData = async () => {
    if (!userId) return null;
    const { data: profile, error: profileError } = await supabase6.from("profiles").select("id").eq("user_id", userId).single();
    if (profileError || !profile) {
      console.error("Dashboard Error: Could not fetch user profile.", profileError);
      throw new Error("Could not fetch user profile for dashboard.");
    }
    const profileId = profile.id;
    const [
      listingsSummary,
      offersSummary,
      conversationsResult,
      recentListingsResult,
      recentOffersResult
    ] = await Promise.all([
      supabase6.from("vehicle_listings").select("listing_id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "AVAILABLE"),
      supabase6.from("offers").select("id", { count: "exact", head: true }).eq("recipient_id", profileId).eq("status", "PENDING"),
      supabase6.rpc("get_conversations_for_user", { p_user_id: userId }),
      supabase6.from("vehicle_listings_detailed").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase6.from("offers").select("*, conversation:conversations(listing:vehicle_listings_detailed(*))").or(`recipient_id.eq.${profileId},sender_id.eq.${profileId}`).order("created_at", { ascending: false }).limit(3)
    ]);
    const errors = [listingsSummary.error, offersSummary.error, conversationsResult.error, recentListingsResult.error, recentOffersResult.error].filter(Boolean);
    if (errors.length > 0) {
      console.error("Error fetching dashboard data parts:", errors);
      throw new Error("One or more dashboard queries failed.");
    }
    const conversations = conversationsResult.data || [];
    const summary = {
      active_listings_count: listingsSummary.count ?? 0,
      unread_messages_count: conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0),
      active_offers_count: offersSummary.count ?? 0
    };
    const recent_listings = (recentListingsResult.data || []).map((l) => ({
      listing_id: l.listing_id,
      make: l.make,
      model: l.model,
      year: l.year,
      price: l.price,
      images: l.images || [],
      province_name: l.province_name,
      status: l.status,
      created_at: l.created_at
    }));
    const recent_conversations = conversations.slice(0, 3).map((c) => ({
      id: c.id,
      listing_id: null,
      // The RPC does not provide this.
      last_message_preview: c.last_message_preview,
      last_message_at: c.last_message_at,
      last_message_sender_id: c.last_message_sender_id ? parseInt(c.last_message_sender_id, 10) : null,
      vehicle_make: c.vehicle_make,
      vehicle_model: c.vehicle_model,
      vehicle_image: c.vehicle_image,
      other_user_name: c.other_user_name,
      other_user_avatar: c.other_user_avatar,
      unread_count: c.unread_count
    }));
    const recent_offers = (recentOffersResult.data || []).map((o) => {
      const listing = o.conversation?.listing;
      return {
        id: o.public_id,
        listing_id: listing?.listing_id ?? 0,
        amount: o.amount,
        status: o.status,
        created_at: o.created_at,
        sender_id: o.sender_id,
        recipient_id: o.recipient_id,
        listing_title: listing ? `${listing.year} ${listing.make} ${listing.model}` : "Listing details unavailable",
        listing_image_url: listing?.images?.[0] ?? null
      };
    });
    return { summary, recent_listings, recent_conversations, recent_offers };
  };
  return useQuery12({
    queryKey: ["dashboardData", userId],
    queryFn: fetchDashboardData,
    enabled: !!userId
  });
};

// src/useUserListings.ts
import { useQuery as useQuery13 } from "@tanstack/react-query";
var useUserListings = () => {
  const supabase6 = useSupabase();
  const { user } = useAuth();
  const userId = user?.id;
  const fetchUserListings = async () => {
    if (!userId) return [];
    const { data, error } = await supabase6.rpc("get_user_listings", { p_user_id: userId });
    if (error) {
      console.error("Error fetching user listings:", error);
      throw error;
    }
    return data || [];
  };
  return useQuery13({
    queryKey: ["userListings", userId],
    queryFn: fetchUserListings,
    enabled: !!userId
  });
};

// src/useUserLocationProfile.ts
import { useQuery as useQuery14 } from "@tanstack/react-query";
var useUserLocationProfile = (userId) => {
  const supabase6 = useSupabase();
  const fetchUserProfile = async () => {
    if (!supabase6 || !userId) {
      return null;
    }
    const { data, error } = await supabase6.from("profiles").select(`
        *,
        provinces (name)
      `).eq("user_id", userId).single();
    if (error && error.code !== "PGRST116") {
      throw error;
    }
    if (!data) {
      return null;
    }
    const province_name = data.provinces?.name ?? null;
    const { provinces, ...rest } = data;
    return { ...rest, province_name };
  };
  return useQuery14({
    queryKey: ["userLocationProfile", userId],
    queryFn: fetchUserProfile,
    enabled: !!supabase6 && !!userId
  });
};

// src/useVehicleAttribute.ts
import { useQuery as useQuery15 } from "@tanstack/react-query";
import { getSupabase as getSupabase13 } from "@directdrive/supabase-client/singleton";
var useVehicleAttribute = (attributeNamePlural, attributeNameSingular, modelId, year) => {
  const supabase6 = getSupabase13();
  const rpcName = `get_${attributeNamePlural}_for_model_and_year`;
  const idKey = `${attributeNameSingular}_id`;
  const nameKey = attributeNameSingular;
  return useQuery15({
    queryKey: [`vehicle_${attributeNamePlural}`, modelId, year],
    queryFn: async () => {
      if (!modelId || !year) return [];
      const { data, error } = await supabase6.rpc(rpcName, {
        p_model_id: modelId,
        p_year: year
      });
      if (error) throw error;
      const items = data;
      return (items || []).map((item) => ({
        id: item[idKey],
        name: item[nameKey]
      }));
    },
    enabled: !!modelId && !!year
  });
};

// src/useVehicleDetails.ts
import { useQuery as useQuery16 } from "@tanstack/react-query";
import { getSupabase as getSupabase14 } from "@directdrive/supabase-client/singleton";
var fetchVehicleDetails = async (listingId, userId) => {
  const supabase6 = getSupabase14();
  const { data: vehicleData, error: vehicleError } = await supabase6.from("vehicle_listings_detailed").select("*").eq("listing_id", listingId).single();
  if (vehicleError) {
    console.error("Error fetching vehicle details:", vehicleError);
    throw new Error(vehicleError.message);
  }
  if (!vehicleData) {
    throw new Error("Vehicle not found.");
  }
  let isSaved = false;
  if (userId) {
    const { data: savedData, error: savedError } = await supabase6.from("saved_vehicles").select("listing_id").eq("user_id", userId).eq("listing_id", listingId).maybeSingle();
    if (savedError) {
      console.error("Error checking saved vehicle status:", savedError);
    }
    if (savedData) {
      isSaved = true;
    }
  }
  return { ...vehicleData, is_saved: isSaved };
};
var useVehicleDetails = (listingId, userId, options) => {
  const numericListingId = listingId ? parseInt(listingId, 10) : void 0;
  return useQuery16({
    queryKey: ["vehicleDetail", numericListingId, userId],
    queryFn: () => fetchVehicleDetails(numericListingId, userId),
    enabled: !!numericListingId,
    ...options
  });
};

// src/useVehicleFeatures.ts
import { useQuery as useQuery17 } from "@tanstack/react-query";
import { getSupabase as getSupabase15 } from "@directdrive/supabase-client/singleton";
var useVehicleFeatures = () => {
  return useQuery17({
    queryKey: ["features"],
    queryFn: async () => {
      const supabase6 = getSupabase15();
      const { data, error } = await supabase6.rpc("get_features");
      if (error) {
        console.error("Error fetching vehicle features:", error);
        throw new Error(error.message);
      }
      return data || [];
    }
  });
};

// src/useVehicleFormLogic.ts
import { useForm as useForm2 } from "react-hook-form";
import { zodResolver as zodResolver2 } from "@hookform/resolvers/zod";
import { useQuery as useQuery18 } from "@tanstack/react-query";
import { getSupabase as getSupabase16 } from "@directdrive/supabase-client/singleton";
import {
  vehicleFormSchema
} from "@directdrive/core-types";
var supabase3 = getSupabase16();
var fetchMakes = async () => {
  const { data, error } = await supabase3.from("vehicle_makes").select("*").order("make");
  if (error) throw new Error(error.message);
  return data || [];
};
var fetchModels = async (makeId) => {
  const { data, error } = await supabase3.from("vehicle_models").select("*").eq("make_id", makeId).order("model");
  if (error) throw new Error(error.message);
  return data || [];
};
var fetchYears = async (modelId) => {
  const { data, error } = await supabase3.rpc("get_vehicle_years_for_model", { p_model_id: modelId });
  if (error) throw new Error(error.message);
  return data || [];
};
var fetchFeatures = async () => {
  const { data, error } = await supabase3.from("vehicle_features").select("*");
  if (error) throw new Error(error.message);
  return data || [];
};
var fetchVariantOptionsForForm = async (modelId, year) => {
  const { data, error } = await supabase3.rpc("get_form_variant_options", {
    p_model_id: modelId,
    p_year: year
  });
  if (error) throw new Error(error.message);
  return data;
};
var useVehicleFormLogic = ({ defaultValues }) => {
  const form = useForm2({
    resolver: zodResolver2(vehicleFormSchema),
    defaultValues: {
      ...defaultValues,
      feature_ids: defaultValues?.feature_ids || []
    }
  });
  const { watch } = form;
  const makeId = watch("make_id");
  const modelId = watch("model_id");
  const year = watch("year");
  const isEditMode = !!defaultValues?.id;
  const { data: makes, isLoading: isLoadingMakes } = useQuery18({ queryKey: ["makes"], queryFn: fetchMakes });
  const { data: models, isLoading: isLoadingModels } = useQuery18({ queryKey: ["models", makeId], queryFn: () => fetchModels(makeId), enabled: !!makeId });
  const { data: years, isLoading: isLoadingYears } = useQuery18({ queryKey: ["years", modelId], queryFn: () => fetchYears(modelId), enabled: !!modelId });
  const { data: features, isLoading: isLoadingFeatures } = useQuery18({ queryKey: ["features"], queryFn: fetchFeatures });
  const { data: variantOptions, isLoading: isLoadingVariants } = useQuery18({
    queryKey: ["formVariantOptions", modelId, year],
    queryFn: () => fetchVariantOptionsForForm(modelId, year),
    enabled: !!modelId && !!year && !isEditMode
  });
  const attributesDisabled = !modelId || !year;
  return {
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
    attributesDisabled
  };
};

// src/useVehicleMakes.ts
import { useQuery as useQuery19 } from "@tanstack/react-query";
import { getSupabase as getSupabase17 } from "@directdrive/supabase-client/singleton";
var useVehicleMakes = () => {
  const supabase6 = getSupabase17();
  return useQuery19({
    queryKey: ["vehicle_makes"],
    queryFn: async () => {
      const { data, error } = await supabase6.rpc("get_vehicle_makes");
      if (error) throw error;
      return data || [];
    }
  });
};

// src/useVehicleModels.ts
import { useQuery as useQuery20 } from "@tanstack/react-query";
import { getSupabase as getSupabase18 } from "@directdrive/supabase-client/singleton";
var useVehicleModels = (makeId) => {
  const supabase6 = getSupabase18();
  return useQuery20({
    queryKey: ["vehicle_models", makeId],
    queryFn: async () => {
      if (!makeId) return [];
      const { data, error } = await supabase6.rpc("get_vehicle_models_by_make", {
        p_make_id: makeId
      });
      if (error) throw error;
      return (data || []).map((m) => ({
        id: m.model_id,
        name: m.model
      }));
    },
    enabled: !!makeId
  });
};

// src/useVehicleModelsByMakes.ts
import { useQuery as useQuery21 } from "@tanstack/react-query";
import { getSupabase as getSupabase19 } from "@directdrive/supabase-client/singleton";
var useVehicleModelsByMakes = (makeIds) => {
  const supabase6 = getSupabase19();
  const integerMakeIds = makeIds?.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
  return useQuery21({
    queryKey: ["vehicle_models_by_makes", integerMakeIds],
    queryFn: async () => {
      if (!integerMakeIds || integerMakeIds.length === 0) {
        return [];
      }
      const { data, error } = await supabase6.rpc("get_models_by_make_ids", {
        p_make_ids: integerMakeIds
      });
      if (error) {
        console.error("Error fetching models by makes:", error);
        throw error;
      }
      return (data || []).map((m) => ({
        id: m.model_id,
        name: m.model
      }));
    },
    enabled: !!integerMakeIds && integerMakeIds.length > 0
  });
};

// src/useVehicleMutations.ts
import { useMutation as useMutation10, useQueryClient as useQueryClient9 } from "@tanstack/react-query";
import { getSupabase as getSupabase20 } from "@directdrive/supabase-client/singleton";
var supabase4 = getSupabase20();
var createVehicleListing = async (formData) => {
  const { data, error } = await supabase4.rpc("create_vehicle_listing_atomic", {
    p_user_id: (await supabase4.auth.getUser()).data.user?.id,
    p_vehicle_main_id: 1,
    // This likely needs to be determined dynamically
    p_price: formData.price,
    p_mileage: formData.mileage,
    p_vin: formData.vin,
    p_description: formData.description,
    p_images: formData.images,
    // We now handle the case where feature_ids might be undefined from the form.
    p_feature_ids: formData.feature_ids || []
  });
  if (error) throw error;
  return data;
};
var useCreateVehicleListing = () => {
  const queryClient = useQueryClient9();
  return useMutation10({
    mutationFn: createVehicleListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
    }
  });
};
var updateVehicleListing = async (formData) => {
  if (!formData.id) throw new Error("Listing ID is required for updates.");
  const { data, error } = await supabase4.rpc("update_vehicle_listing_atomic", {
    p_listing_id: formData.id,
    p_price: formData.price,
    p_mileage: formData.mileage,
    p_description: formData.description,
    p_is_sold: false,
    p_images: formData.images,
    // We also handle the undefined case here for updates.
    p_feature_ids: formData.feature_ids || []
  });
  if (error) throw error;
  return data;
};
var useUpdateVehicleListing = () => {
  const queryClient = useQueryClient9();
  return useMutation10({
    mutationFn: updateVehicleListing,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    }
  });
};

// src/useVehicleOptions.ts
import { useQuery as useQuery22 } from "@tanstack/react-query";
import { getSupabase as getSupabase21 } from "@directdrive/supabase-client/singleton";
var optionTypeToColumnMapping = {
  make: { idColumn: "make_id", nameColumn: "make" },
  body_type: { idColumn: "body_type_id", nameColumn: "body_type" },
  fuel_type: { idColumn: "fuel_type_id", nameColumn: "fuel_type" },
  transmission_type: { idColumn: "transmission_type_id", nameColumn: "transmission_type" },
  drivetrain: { idColumn: "drivetrain_id", nameColumn: "drivetrain" }
};
var useVehicleOptions = (optionType) => {
  return useQuery22({
    queryKey: ["vehicleOptions", optionType],
    queryFn: async () => {
      const supabase6 = getSupabase21();
      const { idColumn, nameColumn } = optionTypeToColumnMapping[optionType];
      let query;
      switch (optionType) {
        case "make":
          query = supabase6.from("vehicle_makes").select(`${idColumn}, ${nameColumn}`);
          break;
        case "body_type":
          query = supabase6.from("vehicle_body_types").select(`${idColumn}, ${nameColumn}`);
          break;
        case "fuel_type":
          query = supabase6.from("vehicle_fuel_types").select(`${idColumn}, ${nameColumn}`);
          break;
        case "transmission_type":
          query = supabase6.from("vehicle_transmission_types").select(`${idColumn}, ${nameColumn}`);
          break;
        case "drivetrain":
          query = supabase6.from("vehicle_drivetrains").select(`${idColumn}, ${nameColumn}`);
          break;
        default:
          throw new Error(`Invalid vehicle option type: ${optionType}`);
      }
      const { data, error } = await query.eq("is_active", true);
      if (error) {
        throw new Error(error.message);
      }
      return data.map((item) => ({
        id: item[idColumn],
        name: item[nameColumn]
      }));
    }
  });
};

// src/useVehicleSearch.ts
import { useQuery as useQuery23, keepPreviousData } from "@tanstack/react-query";
import { getSupabase as getSupabase22 } from "@directdrive/supabase-client/singleton";
var useVehicleSearch = (filters) => {
  const supabase6 = getSupabase22();
  const fetchVehicles = async () => {
    const { data, error } = await supabase6.rpc("search_and_filter_vehicles", {
      p_search_term: filters.searchTerm,
      // Corrected all filter properties to use the plural form (e.g., 'makes' instead of 'make')
      p_makes: filters.makes,
      p_models: filters.models,
      p_locations: filters.locations,
      p_body_types: filters.bodyTypes,
      p_transmissions: filters.transmissions,
      p_fuel_types: filters.fuelTypes,
      p_drivetrains: filters.drivetrains,
      p_engine_sizes: filters.engineSizes,
      p_features: filters.features,
      p_min_year: filters.minYear,
      p_max_year: filters.maxYear,
      p_min_price: filters.minPrice,
      p_max_price: filters.maxPrice,
      p_min_mileage: filters.minMileage,
      p_max_mileage: filters.maxMileage,
      p_page_number: filters.pageNumber,
      p_page_size: filters.pageSize,
      p_sort_by: filters.sortBy
    });
    if (error) {
      console.error("Error searching vehicles:", error);
      throw new Error(error.message);
    }
    return data || [];
  };
  return useQuery23({
    queryKey: ["vehicleSearch", filters],
    queryFn: fetchVehicles,
    placeholderData: keepPreviousData
  });
};

// src/useVehicleVariantsByMakesAndModels.ts
import { useQuery as useQuery24 } from "@tanstack/react-query";
import { getSupabase as getSupabase23 } from "@directdrive/supabase-client/singleton";
var supabase5 = getSupabase23();
var fetchVehicleVariants = async (makeIds, modelIds) => {
  if (!makeIds.length || !modelIds.length) {
    return [];
  }
  const { data, error } = await supabase5.rpc("get_variants_by_make_and_model_ids", {
    p_make_ids: makeIds.map(Number),
    p_model_ids: modelIds.map(Number)
  });
  if (error) {
    console.error("Error fetching vehicle variants:", error);
    throw new Error(error.message);
  }
  return data || [];
};
var useVehicleVariantsByMakesAndModels = (makeIds, modelIds) => {
  return useQuery24({
    queryKey: ["vehicleVariants", makeIds, modelIds],
    queryFn: () => fetchVehicleVariants(makeIds, modelIds),
    enabled: makeIds.length > 0 && modelIds.length > 0
  });
};

// src/useVehicleYearsForModel.ts
import { useQuery as useQuery25 } from "@tanstack/react-query";
import { getSupabase as getSupabase24 } from "@directdrive/supabase-client/singleton";
var useVehicleYearsForModel = (modelId, enabled = true) => {
  const supabase6 = getSupabase24();
  return useQuery25({
    queryKey: ["vehicleYearsForModel", modelId],
    queryFn: async () => {
      if (!modelId) return [];
      const { data, error } = await supabase6.rpc("get_vehicle_years_for_model", {
        p_model_id: modelId
      });
      if (error) {
        throw new Error(error.message);
      }
      return data?.map((item) => item.year) || [];
    },
    enabled: !!modelId && enabled
  });
};

// src/useVehicleYearsForVariant.ts
import { useQuery as useQuery26 } from "@tanstack/react-query";
import { getSupabase as getSupabase25 } from "@directdrive/supabase-client/singleton";
var useVehicleYearsForVariant = (variantId) => {
  const supabase6 = getSupabase25();
  return useQuery26({
    queryKey: ["vehicleYearsForVariant", variantId],
    queryFn: async () => {
      if (!variantId) return [];
      const { data, error } = await supabase6.rpc("get_vehicle_years_for_variant", {
        p_variant_id: variantId
      });
      if (error) {
        throw new Error(error.message);
      }
      return data?.map((item) => item.year) || [];
    },
    enabled: !!variantId
  });
};
export {
  SupabaseProvider,
  useAcceptOffer,
  useAuth,
  useConversation,
  useConversationStream,
  useConversations,
  useCounterOffer2 as useCounterOffer,
  useCreateConversation,
  useCreateOffer2 as useCreateOffer,
  useCreateVehicleListing,
  useDebounce,
  useDeclineOffer,
  useDeleteConversation,
  useFetchFullSavedListings,
  useFetchSavedVehicleListings,
  useFilteredVariants,
  useForgotPassword,
  useListing,
  useLocations,
  useMessages,
  useNegotiation,
  useOffers,
  useProfile,
  useProfileFormLogic,
  useRejectOffer,
  useRequestPasswordReset,
  useS3,
  useSendMessage,
  useSignIn,
  useSignOut,
  useSignUp,
  useSupabase,
  useToggleSaveVehicle,
  useUpdatePassword,
  useUpdateProfile,
  useUpdateVehicleListing,
  useUploadImages,
  useUploadMultipleFiles,
  useUserDashboardData,
  useUserListings,
  useUserLocationProfile,
  useVehicleAttribute,
  useVehicleDetails,
  useVehicleFeatures,
  useVehicleFormLogic,
  useVehicleMakes,
  useVehicleModels,
  useVehicleModelsByMakes,
  useVehicleOptions,
  useVehicleSearch,
  useVehicleVariantsByMakesAndModels,
  useVehicleYearsForModel,
  useVehicleYearsForVariant
};
