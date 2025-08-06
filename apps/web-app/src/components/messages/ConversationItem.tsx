import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ConversationDetails } from '@directdrive/core-types';
import { Car, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox, Avatar, AvatarFallback, AvatarImage } from '@directdrive/ui';

interface ConversationItemProps {
  conversation: ConversationDetails;
  currentUserId: string;
  isSelected: boolean;
  isSelectionMode: boolean;
  onToggleSelect: (id: number) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  isSelected,
  isSelectionMode,
  onToggleSelect,
}) => {
  const { conversationId: activeConversationId } = useParams();

  // Determine the 'other' participant's details from the conversation view
  const isCurrentUserTheBuyer = currentUserId === String(conversation.buyer_id);
  const otherParticipantName = isCurrentUserTheBuyer
    ? conversation.seller_name
    : conversation.buyer_name;
  const otherParticipantAvatar = isCurrentUserTheBuyer
    ? conversation.seller_avatar
    : conversation.buyer_avatar;

  const vehicleTitle = `${conversation.year} ${conversation.vehicle_make} ${conversation.vehicle_model}`;
  const vehicleImage = conversation.images?.[0];

  const content = (
    <>
      <div className="flex-shrink-0 mr-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center relative">
          {vehicleImage ? (
            <img
              src={vehicleImage}
              alt="Vehicle"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Car className="w-6 h-6 text-gray-500" />
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
            {otherParticipantAvatar ? (
              <img
                src={otherParticipantAvatar}
                alt={otherParticipantName || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold truncate">
            {otherParticipantName || 'Unknown User'}
          </p>
          {conversation.last_message_at && (
            <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatDistanceToNow(new Date(conversation.last_message_at), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">{vehicleTitle}</p>
        <p
          className={cn(
            'text-sm text-gray-500 truncate',
            // Highlight if the message is unread and the current user was not the sender
            !conversation.last_message_read &&
              String(conversation.last_message_sender_id) !== currentUserId &&
              'font-bold text-gray-800'
          )}
        >
          {conversation.last_message ? (
            <>
              {String(conversation.last_message_sender_id) === currentUserId &&
                'You: '}
              {conversation.last_message}
            </>
          ) : (
            <span className="italic">No messages yet.</span>
          )}
        </p>
      </div>
    </>
  );

  return (
    <div
      className={cn(
        'flex items-center p-2 rounded-lg cursor-pointer',
        isSelected ? 'bg-blue-100' : 'hover:bg-gray-100',
        String(conversation.id) === activeConversationId &&
          !isSelected &&
          'bg-gray-200'
      )}
      onClick={() =>
        isSelectionMode && conversation.id && onToggleSelect(conversation.id)
      }
    >
      {isSelectionMode && conversation.id && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(conversation.id!)}
          className="mr-4 ml-2"
          aria-label={`Select conversation with ${otherParticipantName}`}
        />
      )}
      {isSelectionMode ? (
        <div className="flex-grow flex items-center min-w-0">{content}</div>
      ) : (
        <Link
          to={`/messages/${conversation.id}`}
          className="flex-grow flex items-center min-w-0"
        >
          {content}
        </Link>
      )}
    </div>
  );
};

export default ConversationItem;
