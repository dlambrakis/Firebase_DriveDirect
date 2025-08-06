import type { Message } from './message'; 
import { Tables } from './database.types'; 

export type ConversationWithDetails = Tables<'conversation_details'>;

export type MessageWithSenderDetails = Message & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type SendMessagePayload = {
  conversationId: string;
  content: string;
};
