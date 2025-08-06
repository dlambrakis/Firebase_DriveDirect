import { useQuery } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

const supabase = getSupabase();

export const useConversationStream = (conversationId?: string | null) => {
  // The database ID is a number, so we must parse the string parameter.
  const conversationIdAsNumber = conversationId
    ? parseInt(conversationId, 10)
    : null;

  return useQuery({
    queryKey: ['conversationStream', conversationIdAsNumber],
    queryFn: async () => {
      if (!conversationIdAsNumber || isNaN(conversationIdAsNumber)) return null;
      const { data, error } = await supabase
        .from('conversation_details')
        .select('*')
        .eq('id', conversationIdAsNumber)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!conversationIdAsNumber && !isNaN(conversationIdAsNumber),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
