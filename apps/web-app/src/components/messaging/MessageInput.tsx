import React from 'react';
import { Textarea, Button } from '@directdrive/ui';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSubmit: (content: string) => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, isSending }) => {
  const [content, setContent] = React.useState('');

  const triggerSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-2 p-4 border-t bg-background"
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none"
        rows={1}
        disabled={isSending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isSending || !content.trim()}
        aria-label="Send message"
        className="flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
