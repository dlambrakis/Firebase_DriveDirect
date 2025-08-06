import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { Tables } from '@directdrive/core-types';

type Message = Tables<'messages'>;

export const useMessages = (conversationId: number | undefined) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      if (!supabase || !conversationId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase && !!conversationId,
  });
};
