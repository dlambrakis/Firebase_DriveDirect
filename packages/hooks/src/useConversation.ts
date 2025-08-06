import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

export const useConversation = (conversationId: string | undefined) => {
  const supabase = getSupabase();

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      const { data, error } = await supabase
        .from('conversation_details')
        .select('*')
        .eq('id', parseInt(conversationId))
        .single();

      if (error) {
        console.error(`Error fetching conversation ${conversationId}:`, error);
        throw error;
      }

      return data;
    },
    enabled: !!conversationId,
  });
};
