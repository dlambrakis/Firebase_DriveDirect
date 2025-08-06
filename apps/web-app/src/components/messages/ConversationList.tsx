import React, { useState } from 'react';
import { useAuth, useConversations, useDeleteConversation } from '@directdrive/hooks';
import {
  ScrollArea,
  Separator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Alert,
  AlertDescription,
  AlertTitle,
} from '@directdrive/ui';
import { ConversationDetails } from '@directdrive/core-types';
import ConversationListItem from './ConversationListItem';
import { toast } from 'sonner';
import { MessageSquare, Terminal } from 'lucide-react';

const ConversationList: React.FC = () => {
  const { user } = useAuth();
  const { data: conversations, isLoading, isError, error } = useConversations(user?.id);
  const { mutate: deleteConversation, isPending: isDeleting } = useDeleteConversation();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const handleDeleteRequest = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!conversationToDelete) return;

    deleteConversation(conversationToDelete, {
      onSuccess: () => {
        toast.success('Conversation deleted.');
        setConversationToDelete(null);
      },
      onError: (err) => {
        toast.error(`Failed to delete conversation: ${err.message}`);
      },
      onSettled: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <h2 className="text-lg font-semibold p-2">Chats</h2>
        <div className="space-y-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="ml-3 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Conversations</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full">
        <ScrollArea className="h-full">
          <div className="p-2">
            <h2 className="text-lg font-semibold p-2">Chats</h2>
            {conversations && conversations.length > 0 ? (
              conversations.map((convo) => (
                <React.Fragment key={convo.id}>
                  <ConversationListItem
                    conversation={convo}
                    currentUserId={user?.id || ''}
                    onDelete={() => handleDeleteRequest(convo.public_id)}
                  />
                  <Separator />
                </React.Fragment>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <MessageSquare className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                No conversations yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationList;
