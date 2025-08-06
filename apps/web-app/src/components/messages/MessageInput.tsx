import React from 'react';
import { Send, DollarSign } from 'lucide-react';
import { Button, Input } from '@directdrive/ui';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onMakeOffer?: () => void;
  isSending: boolean;
  disabled: boolean;
  isBuyer: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSendMessage,
  onMakeOffer,
  isSending,
  disabled,
  isBuyer,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSendMessage();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {isBuyer && onMakeOffer && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onMakeOffer}
            disabled={disabled || isSending}
            aria-label="Make an offer"
            className="flex-shrink-0"
          >
            <DollarSign className="h-5 w-5" />
          </Button>
        )}
        <Input
          type="text"
          placeholder={
            disabled ? 'Negotiation has concluded' : 'Type your message...'
          }
          className="flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending || disabled}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full flex-shrink-0"
          disabled={isSending || disabled || !value.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
