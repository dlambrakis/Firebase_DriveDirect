import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callRpc } from '@directdrive/supabase-client';

// --- Create Offer ---

interface CreateOfferVariables {
  conversationId: string; // The public_id of the conversation
  recipientId: string;  // The public_id of the recipient
  amount: number;
}

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newOffer: CreateOfferVariables) => {
      return callRpc('create_offer', {
        p_conversation_id: newOffer.conversationId,
        p_recipient_id: newOffer.recipientId,
        p_amount: newOffer.amount,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// --- Counter Offer ---

interface CounterOfferVariables {
  offerId: string;
  newAmount: number;
  conversationId: string; // The public_id of the conversation
}

export const useCounterOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CounterOfferVariables) => 
      callRpc('create_counter_offer', {
        original_offer_id: variables.offerId,
        new_amount: variables.newAmount,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// --- Accept Offer ---

interface AcceptOfferVariables {
  offerId: string;
  conversationId: string; // The public_id of the conversation
}

export const useAcceptOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AcceptOfferVariables) => 
      callRpc('accept_offer', { p_offer_id: variables.offerId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// --- Decline Offer ---

interface DeclineOfferVariables {
  offerId: string;
  conversationId: string; // The public_id of the conversation
}

export const useDeclineOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeclineOfferVariables) => {
      return callRpc('decline_offer', { p_offer_id: variables.offerId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
