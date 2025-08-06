import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

interface CreateConversationPayload {
  listingId: number;
  sellerId: string;
  messageContent: string;
}

const createConversation = async ({
  listingId,
  sellerId,
  messageContent,
}: CreateConversationPayload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc(
    'create_conversation_and_message',
    {
      p_listing_id: listingId,
      p_seller_id: sellerId,
      p_message_content: messageContent,
    }
  );

  if (error) throw new Error(error.message);
  return data;
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, CreateConversationPayload>({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

const sendMessage = async ({ conversationId, content }: SendMessagePayload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('send_message', {
    p_conversation_id: conversationId,
    p_content: content,
  });

  if (error) throw new Error(error.message);
  return data;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, SendMessagePayload>({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

const deleteConversation = async (conversationId: string) => {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('delete_conversation_for_user', {
    p_conversation_id: conversationId,
  });

  if (error) throw new Error(error.message);
  return true;
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
