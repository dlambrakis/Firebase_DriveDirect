import React from 'react';
import { Message as MessageType } from '@directdrive/core-types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn(
        'flex items-end gap-2',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-sm',
          isCurrentUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-background border rounded-bl-none'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            'text-xs mt-1 text-right',
            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {format(new Date(message.created_at), 'p')}
        </p>
      </div>
    </div>
  );
};

export default Message;
