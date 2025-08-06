import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAuth,
  useConversationStream,
  useSendMessage,
  useNegotiation,
} from '@directdrive/hooks';
import { ConversationDetails } from '@directdrive/core-types';
import { Alert, AlertDescription, AlertTitle } from '@directdrive/ui';
import { Loader2 } from 'lucide-react';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OfferModal from './OfferModal';

const ConversationView: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'new' | 'counter';
    offerId?: number;
  }>({ type: 'new' });

  const conversationIdAsNumber = conversationId
    ? parseInt(conversationId, 10)
    : null;

  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversationStream(conversationId);

  const sendMessageMutation = useSendMessage();
  const {
    createOffer,
    isCreatingOffer,
    counterOffer,
    isCounteringOffer,
    respondToOffer,
    isRespondingToOffer,
  } = useNegotiation();

  const handleRespondToOffer = (
    offerId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    respondToOffer({ offerId, newStatus: status });
  };

  const handleCounterOfferClick = (offerId: number) => {
    setModalConfig({ type: 'counter', offerId });
    setOfferModalOpen(true);
  };

  const handleMakeOfferClick = () => {
    setModalConfig({ type: 'new' });
    setOfferModalOpen(true);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() && conversationId) {
      sendMessageMutation.mutate({
        conversationId: conversationId,
        content: messageContent.trim(),
      });
      setMessageContent('');
    }
  };

  const handleOfferSubmit = (amount: number) => {
    if (!conversation || !user || !conversation.seller_id) return;

    const onSuccess = () => setOfferModalOpen(false);

    if (modalConfig.type === 'new' && conversation.id && conversation.vehicle_id) {
      createOffer(
        {
          conversationId: conversation.id,
          amount,
          recipientId: conversation.seller_id,
          vehicleId: conversation.vehicle_id,
        },
        { onSuccess }
      );
    } else if (modalConfig.type === 'counter' && modalConfig.offerId) {
      counterOffer(
        { originalOfferId: modalConfig.offerId, newAmount: amount },
        { onSuccess }
      );
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        'div[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [conversation?.messages]); // Trigger scroll on new messages

  if (isConversationLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (conversationError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{conversationError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isBuyer = user?.id === String(conversation?.buyer_id);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ConversationHeader conversation={conversation} />
      <MessageList
        ref={scrollAreaRef}
        messages={conversation?.messages || []}
        userId={user?.id}
        onRespondToOffer={handleRespondToOffer}
        onCounterOffer={handleCounterOfferClick}
        isResponding={isRespondingToOffer || isCounteringOffer}
      />
      <MessageInput
        value={messageContent}
        onChange={setMessageContent}
        onSendMessage={handleSendMessage}
        onMakeOffer={handleMakeOfferClick}
        isSending={sendMessageMutation.isPending}
        disabled={false} // Add logic for when this should be disabled
        isBuyer={isBuyer}
      />
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setOfferModalOpen(false)}
        onSubmit={handleOfferSubmit}
        isSubmitting={isCreatingOffer || isCounteringOffer}
        title={
          modalConfig.type === 'counter'
            ? 'Make a Counter Offer'
            : 'Make an Offer'
        }
        description={
          modalConfig.type === 'counter'
            ? 'Propose a new amount for this vehicle.'
            : 'Submit a formal offer to the seller. They can accept, decline, or counter.'
        }
      />
    </div>
  );
};

export default ConversationView;
