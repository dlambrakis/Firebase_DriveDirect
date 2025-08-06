import React, { forwardRef } from 'react';
import { ScrollArea } from '@directdrive/ui';
import MessageBubble from './MessageBubble';
import OfferCard from './OfferCard';
import { Offer, Message } from '@directdrive/core-types';

// This union type allows the list to render both messages and offers seamlessly.
type ContentItem = (Message & { type?: 'message' }) | (Offer & { type: 'offer' });

interface MessageListProps {
  content: ContentItem[];
  userId?: string;
  isNegotiationConcluded: boolean;
  // Corrected function signatures to use 'number' for IDs and the correct status enum.
  onRespondToOffer: (offerId: number, status: 'ACCEPTED' | 'REJECTED') => void;
  onCounterOffer: (offerId: number) => void;
  isResponding: boolean;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  (
    {
      content,
      userId,
      isNegotiationConcluded,
      onRespondToOffer,
      onCounterOffer,
      isResponding,
    },
    ref
  ) => {
    return (
      <ScrollArea className="flex-1 bg-white" ref={ref}>
        <div className="p-4 flex flex-col gap-2">
          {content.map((item) => {
            if (item.type === 'offer') {
              const offer = item as Offer;
              // Correctly compare the string user ID with the number sender ID.
              const isMyOffer = String(offer.sender_id) === userId;
              const canRespond =
                String(offer.recipient_id) === userId &&
                offer.status === 'PENDING' &&
                !isNegotiationConcluded;

              return (
                <OfferCard
                  key={`offer-${offer.id}`}
                  offer={offer}
                  onAccept={(id) => onRespondToOffer(id, 'ACCEPTED')}
                  // Corrected 'DECLINED' to 'REJECTED' to match the database enum.
                  onDecline={(id) => onRespondToOffer(id, 'REJECTED')}
                  onCounterOffer={onCounterOffer}
                  isMyOffer={isMyOffer}
                  canRespond={canRespond}
                  isResponding={isResponding}
                />
              );
            }
            const message = item as Message;
            return (
              <MessageBubble
                key={`message-${message.id}`}
                message={message}
                // Correctly compare the string user ID with the number sender ID.
                isCurrentUser={String(message.sender_id) === userId}
              />
            );
          })}
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = 'MessageList';

export default MessageList;
