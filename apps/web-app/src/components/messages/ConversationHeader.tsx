import React from 'react';
import { ConversationDetails, Profile } from '@directdrive/core-types';
import { useAuth } from '@/providers/AuthProvider';

interface ConversationHeaderProps {
  conversation: ConversationDetails | null | undefined;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
}) => {
  const { user } = useAuth();

  // Determine the 'other' participant based on the current user's ID
  const otherParticipantName =
    user?.id === conversation?.seller_id
      ? conversation?.buyer_name
      : conversation?.seller_name;

  if (!conversation) {
    return (
      <div className="p-4 border-b bg-white">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-2"></div>
      </div>
    );
  }

  const vehicleTitle = `${conversation.year} ${conversation.vehicle_make} ${conversation.vehicle_model}`;

  return (
    <div className="p-4 border-b bg-white">
      <h2 className="font-bold text-lg">{vehicleTitle}</h2>
      <p className="text-sm text-gray-500">
        Conversation with {otherParticipantName || 'user'}
      </p>
    </div>
  );
};

export default ConversationHeader;
