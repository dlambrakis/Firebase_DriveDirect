import React from 'react';
import { Message } from '@directdrive/core-types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  // Using cn utility for cleaner conditional class management
  const bubbleClasses = cn(
    'max-w-md md:max-w-lg lg:max-w-xl px-4 py-2 rounded-2xl shadow-sm',
    {
      'bg-primary text-primary-foreground self-end rounded-br-none':
        isCurrentUser,
      'bg-muted text-muted-foreground self-start rounded-bl-none':
        !isCurrentUser,
    }
  );

  const containerClasses = cn('flex flex-col mb-4', {
    'items-end': isCurrentUser,
    'items-start': !isCurrentUser,
  });

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        <p className="text-sm">{message.content}</p>
      </div>
      <p className="text-xs text-gray-400 mt-1 px-1">
        {format(new Date(message.created_at), 'p')}
      </p>
    </div>
  );
};

export default MessageBubble;
