import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ConversationList from '../components/messages/ConversationList';
import SelectConversation from '../components/messages/SelectConversation';

/**
 * A layout component for the main messaging interface.
 * It displays a list of conversations and the content of the selected conversation.
 * On mobile, it responsively shows either the list or the content, but not both.
 */
const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    // This calculation depends on a CSS variable `--header-height` being set globally.
    <div className="container-fluid mx-auto h-[calc(100vh-var(--header-height))]">
      <div className="flex h-full border rounded-lg bg-white shadow-lg overflow-hidden">
        <aside
          className={`w-full md:w-1/3 xl:w-1/4 border-r overflow-y-auto ${
            conversationId ? 'hidden md:block' : 'block'
          }`}
        >
          <ConversationList />
        </aside>
        <main
          className={`flex-1 flex flex-col ${
            conversationId ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* The Outlet will render the selected conversation view,
              or we can show a placeholder if no conversation is selected. */}
          {conversationId ? <Outlet /> : <SelectConversation />}
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
