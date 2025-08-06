import React from 'react';
import { ConversationDetails } from '@directdrive/core-types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@directdrive/ui';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListItemProps {
  conversation: ConversationDetails;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  currentUserId?: string;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  currentUserId,
}) => {
  // Determine the 'other' participant's details from the conversation view
  const isCurrentUserTheBuyer = String(conversation.buyer_id) === currentUserId;
  const otherUserName = isCurrentUserTheBuyer
    ? conversation.seller_name
    : conversation.buyer_name;
  const otherUserAvatar = isCurrentUserTheBuyer
    ? conversation.seller_avatar
    : conversation.buyer_avatar;

  const lastMessageTimestamp = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), {
        addSuffix: true,
      })
    : '';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the onSelect from firing when deleting
    onDelete();
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex items-start p-3 rounded-lg cursor-pointer hover:bg-muted group',
        isSelected && 'bg-muted'
      )}
    >
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage
          src={otherUserAvatar || undefined}
          alt={otherUserName || 'User'}
        />
        <AvatarFallback>
          {otherUserName?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold truncate">{otherUserName}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {lastMessageTimestamp}
          </p>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.last_message_preview}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default ConversationListItem;
