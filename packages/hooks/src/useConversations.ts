import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { useAuth } from './useAuth';
import { Conversation } from '@directdrive/core-types';

export const useConversations = () => {
  const supabase = useSupabase();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!supabase && !!user,
  });
};
