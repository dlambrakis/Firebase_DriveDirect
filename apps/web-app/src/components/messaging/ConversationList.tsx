import React from 'react';
import { ScrollArea, Separator } from '@directdrive/ui';
import { Conversation } from '@directdrive/core-types';
import ConversationListItem from './ConversationListItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  currentUserId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation,
  currentUserId,
}) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-background">
      <ScrollArea className="h-full">
        <div className="p-2">
          <h2 className="text-lg font-semibold p-2">Chats</h2>
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <React.Fragment key={convo.public_id}>
                <ConversationListItem
                  conversation={convo}
                  isSelected={selectedConversationId === convo.public_id}
                  onSelect={() => onSelectConversation(convo.public_id)}
                  onDelete={() => onDeleteConversation(convo.public_id)}
                  currentUserId={currentUserId}
                />
                <Separator />
              </React.Fragment>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
