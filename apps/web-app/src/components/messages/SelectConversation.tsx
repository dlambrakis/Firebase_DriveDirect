import React from 'react';
import { MessageSquare } from 'lucide-react';

/**
 * A component to display as a placeholder in the main message view
 * when no conversation has been selected yet.
 */
const SelectConversation: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full bg-muted/50 text-center p-8">
      <MessageSquare className="w-24 h-24 text-muted-foreground/20" />
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        Select a conversation
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose from your existing conversations to start chatting.
      </p>
    </div>
  );
};

export default SelectConversation;
