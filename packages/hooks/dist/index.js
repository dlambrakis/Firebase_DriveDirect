"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SupabaseProvider: () => SupabaseProvider,
  useAcceptOffer: () => useAcceptOffer,
  useAuth: () => useAuth,
  useConversation: () => useConversation,
  useConversationStream: () => useConversationStream,
  useConversations: () => useConversations,
  useCounterOffer: () => useCounterOffer2,
  useCreateConversation: () => useCreateConversation,
  useCreateOffer: () => useCreateOffer2,
  useCreateVehicleListing: () => useCreateVehicleListing,
  useDebounce: () => useDebounce,
  useDeclineOffer: () => useDeclineOffer,
  useDeleteConversation: () => useDeleteConversation,
  useFetchFullSavedListings: () => useFetchFullSavedListings,
  useFetchSavedVehicleListings: () => useFetchSavedVehicleListings,
  useFilteredVariants: () => useFilteredVariants,
  useForgotPassword: () => useForgotPassword,
  useListing: () => useListing,
  useLocations: () => useLocations,
  useMessages: () => useMessages,
  useNegotiation: () => useNegotiation,
  useOffers: () => useOffers,
  useProfile: () => useProfile,
  useProfileFormLogic: () => useProfileFormLogic,
  useRejectOffer: () => useRejectOffer,
  useRequestPasswordReset: () => useRequestPasswordReset,
  useS3: () => useS3,
  useSendMessage: () => useSendMessage,
  useSignIn: () => useSignIn,
  useSignOut: () => useSignOut,
  useSignUp: () => useSignUp,
  useSupabase: () => useSupabase,
  useToggleSaveVehicle: () => useToggleSaveVehicle,
  useUpdatePassword: () => useUpdatePassword,
  useUpdateProfile: () => useUpdateProfile,
  useUpdateVehicleListing: () => useUpdateVehicleListing,
  useUploadImages: () => useUploadImages,
  useUploadMultipleFiles: () => useUploadMultipleFiles,
  useUserDashboardData: () => useUserDashboardData,
  useUserListings: () => useUserListings,
  useUserLocationProfile: () => useUserLocationProfile,
  useVehicleAttribute: () => useVehicleAttribute,
  useVehicleDetails: () => useVehicleDetails,
  useVehicleFeatures: () => useVehicleFeatures,
  useVehicleFormLogic: () => useVehicleFormLogic,
  useVehicleMakes: () => useVehicleMakes,
  useVehicleModels: () => useVehicleModels,
  useVehicleModelsByMakes: () => useVehicleModelsByMakes,
  useVehicleOptions: () => useVehicleOptions,
  useVehicleSearch: () => useVehicleSearch,
  useVehicleVariantsByMakesAndModels: () => useVehicleVariantsByMakesAndModels,
  useVehicleYearsForModel: () => useVehicleYearsForModel,
  useVehicleYearsForVariant: () => useVehicleYearsForVariant
});
module.exports = __toCommonJS(src_exports);

// src/useAuth.ts
var import_react = require("react");
var import_react_query = require("@tanstack/react-query");
var import_singleton = require("@directdrive/supabase-client/singleton");
var getSession = async () => {
  const supabase6 = (0, import_singleton.getSupabase)();
  const { data, error } = await supabase6.auth.getSession();
  if (error) throw error;
  return data.session;
};
var useAuth = () => {
  const queryClient = (0, import_react_query.useQueryClient)();
  const { data: session, isLoading, isError } = (0, import_react_query.useQuery)({
    queryKey: ["session"],
    queryFn: getSession,
    staleTime: Infinity,
    gcTime: Infinity
  });
  (0, import_react.useEffect)(() => {
    const supabase6 = (0, import_singleton.getSupabase)();
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
  const user = (0, import_react.useMemo)(() => session?.user ?? null, [session]);
  return {
    session,
    user,
    isLoading,
    isError,
    isAuthenticated: !!user
  };
};

// src/useAuthMutations.ts
var import_react_query2 = require("@tanstack/react-query");
var import_singleton2 = require("@directdrive/supabase-client/singleton");
var signIn = async (credentials) => {
  const supabase6 = (0, import_singleton2.getSupabase)();
  const { data, error } = await supabase6.auth.signInWithPassword(credentials);
  if (error) throw error;
  return data;
};
var useSignIn = () => {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
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
  const supabase6 = (0, import_singleton2.getSupabase)();
  const { data, error } = await supabase6.auth.signUp(credentials);
  if (error) throw error;
  return data;
};
var useSignUp = () => {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
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
  const supabase6 = (0, import_singleton2.getSupabase)();
  const { error } = await supabase6.auth.signOut();
  if (error) throw error;
};
var useSignOut = () => {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
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
  const supabase6 = (0, import_singleton2.getSupabase)();
  const redirectTo = `${process.env.EXPO_PUBLIC_WEB_URL || window.location.origin}/update-password`;
  const { error } = await supabase6.auth.resetPasswordForEmail(email, {
    redirectTo
  });
  if (error) throw error;
};
var useForgotPassword = () => {
  return (0, import_react_query2.useMutation)({
    mutationFn: forgotPassword,
    onError: (error) => {
      console.error("Forgot password error:", error.message);
    }
  });
};
var updatePassword = async (credentials) => {
  const supabase6 = (0, import_singleton2.getSupabase)();
  const { data, error } = await supabase6.auth.updateUser(credentials);
  if (error) throw error;
  return data;
};
var useUpdatePassword = () => {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
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
var import_react_query3 = require("@tanstack/react-query");
var import_singleton3 = require("@directdrive/supabase-client/singleton");
var useConversation = (conversationId) => {
  const supabase6 = (0, import_singleton3.getSupabase)();
  return (0, import_react_query3.useQuery)({
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
var import_react_query4 = require("@tanstack/react-query");
var import_singleton4 = require("@directdrive/supabase-client/singleton");
var createConversation = async ({
  listingId,
  sellerId,
  messageContent
}) => {
  const supabase6 = (0, import_singleton4.getSupabase)();
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
  const queryClient = (0, import_react_query4.useQueryClient)();
  return (0, import_react_query4.useMutation)({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var sendMessage = async ({ conversationId, content }) => {
  const supabase6 = (0, import_singleton4.getSupabase)();
  const { data, error } = await supabase6.rpc("send_message", {
    p_conversation_id: conversationId,
    p_content: content
  });
  if (error) throw new Error(error.message);
  return data;
};
var useSendMessage = () => {
  const queryClient = (0, import_react_query4.useQueryClient)();
  return (0, import_react_query4.useMutation)({
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
  const supabase6 = (0, import_singleton4.getSupabase)();
  const { error } = await supabase6.rpc("delete_conversation_for_user", {
    p_conversation_id: conversationId
  });
  if (error) throw new Error(error.message);
  return true;
};
var useDeleteConversation = () => {
  const queryClient = (0, import_react_query4.useQueryClient)();
  return (0, import_react_query4.useMutation)({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};

// src/useConversations.ts
var import_react_query5 = require("@tanstack/react-query");

// src/useSupabase.ts
var import_react2 = __toESM(require("react"));
var SupabaseContext = (0, import_react2.createContext)(null);
var SupabaseProvider = ({ children, client }) => {
  return import_react2.default.createElement(SupabaseContext.Provider, { value: client }, children);
};
var useSupabase = () => {
  const context = (0, import_react2.useContext)(SupabaseContext);
  if (context === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

// src/useConversations.ts
var useConversations = () => {
  const supabase6 = useSupabase();
  const { user } = useAuth();
  return (0, import_react_query5.useQuery)({
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
var import_react_query6 = require("@tanstack/react-query");
var import_singleton5 = require("@directdrive/supabase-client/singleton");
var supabase = (0, import_singleton5.getSupabase)();
var useConversationStream = (conversationId) => {
  const conversationIdAsNumber = conversationId ? parseInt(conversationId, 10) : null;
  return (0, import_react_query6.useQuery)({
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
var import_react3 = require("react");
var useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = (0, import_react3.useState)(value);
  (0, import_react3.useEffect)(() => {
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
var import_react_query7 = require("@tanstack/react-query");
var import_singleton6 = require("@directdrive/supabase-client/singleton");
var fetchSavedVehicleListings = async (userId) => {
  if (!userId) {
    return { listings: [], savedSet: /* @__PURE__ */ new Set() };
  }
  const supabase6 = (0, import_singleton6.getSupabase)();
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
  return (0, import_react_query7.useQuery)({
    queryKey: ["fetchSavedVehicleListings", userId],
    queryFn: () => fetchSavedVehicleListings(userId),
    enabled: !!userId,
    select: (data) => data.savedSet
    // Only return the set for the VehicleCard use case
  });
};
var useFetchFullSavedListings = (userId) => {
  return (0, import_react_query7.useQuery)({
    queryKey: ["fetchSavedVehicleListings", userId],
    queryFn: () => fetchSavedVehicleListings(userId),
    enabled: !!userId,
    select: (data) => data.listings
    // Return the full listings for pages like "My Saved Vehicles"
  });
};

// src/useFilteredVariants.ts
var import_react_query8 = require("@tanstack/react-query");
var import_singleton7 = require("@directdrive/supabase-client/singleton");
var useFilteredVariants = (filters) => {
  const supabase6 = (0, import_singleton7.getSupabase)();
  return (0, import_react_query8.useQuery)({
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
var import_react_query9 = require("@tanstack/react-query");
var useListing = (listingId) => {
  const supabase6 = useSupabase();
  return (0, import_react_query9.useQuery)({
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
var import_react_query10 = require("@tanstack/react-query");
var import_singleton8 = require("@directdrive/supabase-client/singleton");
var supabase2 = (0, import_singleton8.getSupabase)();
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
  return (0, import_react_query10.useQuery)({
    queryKey: [locationType, parentId],
    queryFn: () => fetchLocations(locationType, parentId),
    enabled: locationType === "provinces" || !!parentId
    // Enable for provinces, or for others if parentId exists
  });
};

// src/useMessages.ts
var import_react_query11 = require("@tanstack/react-query");
var useMessages = (conversationId) => {
  const supabase6 = useSupabase();
  return (0, import_react_query11.useQuery)({
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
var import_react_query12 = require("@tanstack/react-query");
var import_singleton9 = require("@directdrive/supabase-client/singleton");
var createOffer = async (params) => {
  const supabase6 = (0, import_singleton9.getSupabase)();
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
  const queryClient = (0, import_react_query12.useQueryClient)();
  return (0, import_react_query12.useMutation)({
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
  const supabase6 = (0, import_singleton9.getSupabase)();
  const { data, error } = await supabase6.from("offers").update({ status: params.newStatus }).eq("id", params.offerId).select().single();
  if (error) throw error;
  return data;
};
var useRespondToOffer = () => {
  const queryClient = (0, import_react_query12.useQueryClient)();
  return (0, import_react_query12.useMutation)({
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
  const supabase6 = (0, import_singleton9.getSupabase)();
  const { data, error } = await supabase6.rpc("create_counter_offer", {
    original_offer_id: String(params.originalOfferId),
    new_amount: params.newAmount
  }).select().single();
  if (error) throw error;
  return data;
};
var useCounterOffer = () => {
  const queryClient = (0, import_react_query12.useQueryClient)();
  return (0, import_react_query12.useMutation)({
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
var import_react_query13 = require("@tanstack/react-query");
var import_supabase_client = require("@directdrive/supabase-client");
var useCreateOffer2 = () => {
  const queryClient = (0, import_react_query13.useQueryClient)();
  return (0, import_react_query13.useMutation)({
    mutationFn: (newOffer) => {
      return (0, import_supabase_client.callRpc)("create_offer", {
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
  const queryClient = (0, import_react_query13.useQueryClient)();
  return (0, import_react_query13.useMutation)({
    mutationFn: (variables) => (0, import_supabase_client.callRpc)("create_counter_offer", {
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
  const queryClient = (0, import_react_query13.useQueryClient)();
  return (0, import_react_query13.useMutation)({
    mutationFn: (variables) => (0, import_supabase_client.callRpc)("accept_offer", { p_offer_id: variables.offerId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};
var useDeclineOffer = () => {
  const queryClient = (0, import_react_query13.useQueryClient)();
  return (0, import_react_query13.useMutation)({
    mutationFn: (variables) => {
      return (0, import_supabase_client.callRpc)("decline_offer", { p_offer_id: variables.offerId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};

// src/useOffers.ts
var import_react_query14 = require("@tanstack/react-query");
var useOffers = (listingId) => {
  const supabase6 = useSupabase();
  return (0, import_react_query14.useQuery)({
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
var import_react_query15 = require("@tanstack/react-query");
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
  return (0, import_react_query15.useQuery)({
    queryKey: ["profile", targetUserId],
    queryFn: fetchProfile,
    enabled: !!targetUserId
  });
};

// src/useProfileFormLogic.ts
var import_react4 = require("react");
var import_react_hook_form = require("react-hook-form");
var import_zod = require("@hookform/resolvers/zod");
var import_core_types = require("@directdrive/core-types");

// src/useUpdateProfile.ts
var import_react_query16 = require("@tanstack/react-query");
var useUpdateProfile = () => {
  const supabase6 = useSupabase();
  const queryClient = (0, import_react_query16.useQueryClient)();
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
  return (0, import_react_query16.useMutation)({
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
  const form = (0, import_react_hook_form.useForm)({
    resolver: (0, import_zod.zodResolver)(import_core_types.profileFormSchema),
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
  (0, import_react4.useEffect)(() => {
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
var import_react_query17 = require("@tanstack/react-query");
var useRejectOffer = () => {
  const supabase6 = useSupabase();
  const queryClient = (0, import_react_query17.useQueryClient)();
  return (0, import_react_query17.useMutation)({
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
var import_react_query18 = require("@tanstack/react-query");
var import_singleton10 = require("@directdrive/supabase-client/singleton");
var useRequestPasswordReset = () => {
  const supabase6 = (0, import_singleton10.getSupabase)();
  return (0, import_react_query18.useMutation)({
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
var import_singleton11 = require("@directdrive/supabase-client/singleton");
var useS3 = () => {
  const supabase6 = (0, import_singleton11.getSupabase)();
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
var import_react_query19 = require("@tanstack/react-query");
var import_singleton12 = require("@directdrive/supabase-client/singleton");
var toggleSaveVehicle = async ({ listingId, isSaved }) => {
  const supabase6 = (0, import_singleton12.getSupabase)();
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
  const queryClient = (0, import_react_query19.useQueryClient)();
  const { user } = useAuth();
  return (0, import_react_query19.useMutation)({
    mutationFn: toggleSaveVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSavedVehicleListings", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicleDetails"] });
    }
  });
};

// src/useUploadImages.ts
var import_react_query20 = require("@tanstack/react-query");

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

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
  return (0, import_react_query20.useMutation)({
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
var import_react5 = require("react");
var useUploadMultipleFiles = (bucket) => {
  const { upload, getPublicUrl } = useS3();
  const [uploading, setUploading] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)(null);
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
var import_react_query21 = require("@tanstack/react-query");
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
  return (0, import_react_query21.useQuery)({
    queryKey: ["dashboardData", userId],
    queryFn: fetchDashboardData,
    enabled: !!userId
  });
};

// src/useUserListings.ts
var import_react_query22 = require("@tanstack/react-query");
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
  return (0, import_react_query22.useQuery)({
    queryKey: ["userListings", userId],
    queryFn: fetchUserListings,
    enabled: !!userId
  });
};

// src/useUserLocationProfile.ts
var import_react_query23 = require("@tanstack/react-query");
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
  return (0, import_react_query23.useQuery)({
    queryKey: ["userLocationProfile", userId],
    queryFn: fetchUserProfile,
    enabled: !!supabase6 && !!userId
  });
};

// src/useVehicleAttribute.ts
var import_react_query24 = require("@tanstack/react-query");
var import_singleton13 = require("@directdrive/supabase-client/singleton");
var useVehicleAttribute = (attributeNamePlural, attributeNameSingular, modelId, year) => {
  const supabase6 = (0, import_singleton13.getSupabase)();
  const rpcName = `get_${attributeNamePlural}_for_model_and_year`;
  const idKey = `${attributeNameSingular}_id`;
  const nameKey = attributeNameSingular;
  return (0, import_react_query24.useQuery)({
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
var import_react_query25 = require("@tanstack/react-query");
var import_singleton14 = require("@directdrive/supabase-client/singleton");
var fetchVehicleDetails = async (listingId, userId) => {
  const supabase6 = (0, import_singleton14.getSupabase)();
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
  return (0, import_react_query25.useQuery)({
    queryKey: ["vehicleDetail", numericListingId, userId],
    queryFn: () => fetchVehicleDetails(numericListingId, userId),
    enabled: !!numericListingId,
    ...options
  });
};

// src/useVehicleFeatures.ts
var import_react_query26 = require("@tanstack/react-query");
var import_singleton15 = require("@directdrive/supabase-client/singleton");
var useVehicleFeatures = () => {
  return (0, import_react_query26.useQuery)({
    queryKey: ["features"],
    queryFn: async () => {
      const supabase6 = (0, import_singleton15.getSupabase)();
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
var import_react_hook_form2 = require("react-hook-form");
var import_zod2 = require("@hookform/resolvers/zod");
var import_react_query27 = require("@tanstack/react-query");
var import_singleton16 = require("@directdrive/supabase-client/singleton");
var import_core_types2 = require("@directdrive/core-types");
var supabase3 = (0, import_singleton16.getSupabase)();
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
  const form = (0, import_react_hook_form2.useForm)({
    resolver: (0, import_zod2.zodResolver)(import_core_types2.vehicleFormSchema),
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
  const { data: makes, isLoading: isLoadingMakes } = (0, import_react_query27.useQuery)({ queryKey: ["makes"], queryFn: fetchMakes });
  const { data: models, isLoading: isLoadingModels } = (0, import_react_query27.useQuery)({ queryKey: ["models", makeId], queryFn: () => fetchModels(makeId), enabled: !!makeId });
  const { data: years, isLoading: isLoadingYears } = (0, import_react_query27.useQuery)({ queryKey: ["years", modelId], queryFn: () => fetchYears(modelId), enabled: !!modelId });
  const { data: features, isLoading: isLoadingFeatures } = (0, import_react_query27.useQuery)({ queryKey: ["features"], queryFn: fetchFeatures });
  const { data: variantOptions, isLoading: isLoadingVariants } = (0, import_react_query27.useQuery)({
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
var import_react_query28 = require("@tanstack/react-query");
var import_singleton17 = require("@directdrive/supabase-client/singleton");
var useVehicleMakes = () => {
  const supabase6 = (0, import_singleton17.getSupabase)();
  return (0, import_react_query28.useQuery)({
    queryKey: ["vehicle_makes"],
    queryFn: async () => {
      const { data, error } = await supabase6.rpc("get_vehicle_makes");
      if (error) throw error;
      return data || [];
    }
  });
};

// src/useVehicleModels.ts
var import_react_query29 = require("@tanstack/react-query");
var import_singleton18 = require("@directdrive/supabase-client/singleton");
var useVehicleModels = (makeId) => {
  const supabase6 = (0, import_singleton18.getSupabase)();
  return (0, import_react_query29.useQuery)({
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
var import_react_query30 = require("@tanstack/react-query");
var import_singleton19 = require("@directdrive/supabase-client/singleton");
var useVehicleModelsByMakes = (makeIds) => {
  const supabase6 = (0, import_singleton19.getSupabase)();
  const integerMakeIds = makeIds?.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
  return (0, import_react_query30.useQuery)({
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
var import_react_query31 = require("@tanstack/react-query");
var import_singleton20 = require("@directdrive/supabase-client/singleton");
var supabase4 = (0, import_singleton20.getSupabase)();
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
  const queryClient = (0, import_react_query31.useQueryClient)();
  return (0, import_react_query31.useMutation)({
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
  const queryClient = (0, import_react_query31.useQueryClient)();
  return (0, import_react_query31.useMutation)({
    mutationFn: updateVehicleListing,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    }
  });
};

// src/useVehicleOptions.ts
var import_react_query32 = require("@tanstack/react-query");
var import_singleton21 = require("@directdrive/supabase-client/singleton");
var optionTypeToColumnMapping = {
  make: { idColumn: "make_id", nameColumn: "make" },
  body_type: { idColumn: "body_type_id", nameColumn: "body_type" },
  fuel_type: { idColumn: "fuel_type_id", nameColumn: "fuel_type" },
  transmission_type: { idColumn: "transmission_type_id", nameColumn: "transmission_type" },
  drivetrain: { idColumn: "drivetrain_id", nameColumn: "drivetrain" }
};
var useVehicleOptions = (optionType) => {
  return (0, import_react_query32.useQuery)({
    queryKey: ["vehicleOptions", optionType],
    queryFn: async () => {
      const supabase6 = (0, import_singleton21.getSupabase)();
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
var import_react_query33 = require("@tanstack/react-query");
var import_singleton22 = require("@directdrive/supabase-client/singleton");
var useVehicleSearch = (filters) => {
  const supabase6 = (0, import_singleton22.getSupabase)();
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
  return (0, import_react_query33.useQuery)({
    queryKey: ["vehicleSearch", filters],
    queryFn: fetchVehicles,
    placeholderData: import_react_query33.keepPreviousData
  });
};

// src/useVehicleVariantsByMakesAndModels.ts
var import_react_query34 = require("@tanstack/react-query");
var import_singleton23 = require("@directdrive/supabase-client/singleton");
var supabase5 = (0, import_singleton23.getSupabase)();
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
  return (0, import_react_query34.useQuery)({
    queryKey: ["vehicleVariants", makeIds, modelIds],
    queryFn: () => fetchVehicleVariants(makeIds, modelIds),
    enabled: makeIds.length > 0 && modelIds.length > 0
  });
};

// src/useVehicleYearsForModel.ts
var import_react_query35 = require("@tanstack/react-query");
var import_singleton24 = require("@directdrive/supabase-client/singleton");
var useVehicleYearsForModel = (modelId, enabled = true) => {
  const supabase6 = (0, import_singleton24.getSupabase)();
  return (0, import_react_query35.useQuery)({
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
var import_react_query36 = require("@tanstack/react-query");
var import_singleton25 = require("@directdrive/supabase-client/singleton");
var useVehicleYearsForVariant = (variantId) => {
  const supabase6 = (0, import_singleton25.getSupabase)();
  return (0, import_react_query36.useQuery)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SupabaseProvider,
  useAcceptOffer,
  useAuth,
  useConversation,
  useConversationStream,
  useConversations,
  useCounterOffer,
  useCreateConversation,
  useCreateOffer,
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
});
