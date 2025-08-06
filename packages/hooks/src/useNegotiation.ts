import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
import { Tables } from '@directdrive/core-types';

type Offer = Tables<'offers'>;

// --- Individual Mutations (Internal) ---

const createOffer = async (params: {
  conversationId: number;
  amount: number;
  recipientId: number;
  vehicleId: string;
}) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('offers')
    .insert({
      conversation_id: params.conversationId,
      amount: params.amount,
      recipient_id: params.recipientId,
      vehicle_id: params.vehicleId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOffer,
    onSuccess: (data: Offer | null) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['conversationStream', data.conversation_id],
        });
      }
    },
  });
};

const respondToOffer = async (params: {
  offerId: number;
  newStatus: 'ACCEPTED' | 'REJECTED';
}) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('offers')
    .update({ status: params.newStatus })
    .eq('id', params.offerId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const useRespondToOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: respondToOffer,
    onSuccess: (data: Offer | null) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['conversationStream', data.conversation_id],
        });
      }
    },
  });
};

const counterOffer = async (params: {
  originalOfferId: number;
  newAmount: number;
}) => {
  const supabase = getSupabase();
  // The RPC function expects the ID as a string, so we convert it here.
  const { data, error } = await supabase
    .rpc('create_counter_offer', {
      original_offer_id: String(params.originalOfferId),
      new_amount: params.newAmount,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

const useCounterOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: counterOffer,
    onSuccess: (data: { conversation_id?: number } | null) => {
      if (data && data.conversation_id) {
        queryClient.invalidateQueries({
          queryKey: ['conversationStream', data.conversation_id],
        });
      }
    },
  });
};

// --- Main Hook ---
export const useNegotiation = () => {
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
    counterOfferError: counterOfferMutation.error,
  };
};
