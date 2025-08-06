import React from 'react';
import { MessageSquare } from 'lucide-react';

/**
 * A component to display when no conversation is selected in the messages view.
 */
const MessagesEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-8">
      <MessageSquare className="w-24 h-24 text-gray-300" />
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Select a conversation
      </h2>
      <p className="mt-2 max-w-sm text-gray-500">
        Choose a conversation from the list to see messages and offers, or start
        a new one by contacting a seller on a vehicle listing.
      </p>
    </div>
  );
};

export default MessagesEmptyState;
