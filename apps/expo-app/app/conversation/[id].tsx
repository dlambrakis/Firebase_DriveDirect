import React, { useLayoutEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useConversationStream, useSendMessage, useNegotiation, useConversations, useAuth } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import MessageBubble from '@/components/MessageBubble';
import MessageInput from '@/components/MessageInput';
import OfferBubble from '@/components/OfferBubble';
import OfferModal from '@/components/OfferModal';
import { useHeaderHeight } from '@react-navigation/elements';
import { AlertTriangle } from 'lucide-react-native';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'new' | 'counter'; offerId?: string }>({ type: 'new' });

  const { data: conversations } = useConversations(user?.id);
  const { content, isLoading, isError, error, isNegotiationConcluded } = useConversationStream(id || '');
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { createOffer, isCreatingOffer, respondToOffer, isRespondingToOffer, counterOffer, isCounteringOffer } = useNegotiation();

  const conversation = conversations?.find(c => c.public_id === id);
  const isBuyer = user?.id === conversation?.participant1_id; // Assuming participant1 is buyer

  useLayoutEffect(() => {
    if (conversation) {
      const otherParticipant = user?.id === conversation.participant1_id ? conversation.participant2_profile : conversation.participant1_profile;
      navigation.setOptions({ title: otherParticipant?.full_name || 'Conversation' });
    }
  }, [navigation, conversation, user?.id]);

  const handleSend = (messageContent: string) => {
    if (!id) return;
    sendMessage({ conversationId: id, content: messageContent });
  };

  const handleMakeOffer = () => {
    setModalConfig({ type: 'new' });
    setOfferModalOpen(true);
  };

  const handleCounterOffer = (offerId: string) => {
    setModalConfig({ type: 'counter', offerId });
    setOfferModalOpen(true);
  };

  const handleRespondToOffer = (offerId: string, status: 'ACCEPTED' | 'DECLINED') => {
    respondToOffer({ offerId, newStatus: status });
  };

  const handleOfferSubmit = (amount: number) => {
    if (!id || !conversation) return;
    const onSuccess = () => setOfferModalOpen(false);

    if (modalConfig.type === 'new') {
      createOffer({
        conversationId: id,
        amount,
        recipientId: conversation.participant2_id, // Assuming participant2 is seller
        vehicleId: conversation.listing_id,
      }, { onSuccess });
    } else if (modalConfig.type === 'counter' && modalConfig.offerId) {
      counterOffer({ originalOfferId: modalConfig.offerId, newAmount: amount }, { onSuccess });
    }
  };

  const renderItem = useCallback(({ item }: { item: (typeof content)[0] }) => {
    if (item.contentType === 'message') {
      return <MessageBubble message={item} currentUserId={user?.id || ''} />;
    }
    if (item.contentType === 'offer') {
      return (
        <OfferBubble
          offer={item}
          currentUserId={user?.id || ''}
          onRespond={handleRespondToOffer}
          onCounter={handleCounterOffer}
          isResponding={isRespondingToOffer || isCounteringOffer}
          isConcluded={!!isNegotiationConcluded}
        />
      );
    }
    return null;
  }, [user?.id, isNegotiationConcluded, isRespondingToOffer, isCounteringOffer]);

  if (isLoading && content.length === 0) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.centered} />;
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <AlertTriangle color={Colors.danger} size={48} />
        <Text style={styles.errorText}>Error loading conversation</Text>
        <Text style={styles.errorSubText}>{error?.message}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={headerHeight}>
      <FlatList
        data={content}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.contentType}-${item.id}`}
        contentContainerStyle={styles.listContent}
        inverted
        style={styles.list}
      />
      <MessageInput
        onSend={handleSend}
        isSending={isSending}
        onMakeOffer={handleMakeOffer}
        isBuyer={isBuyer}
        disabled={isNegotiationConcluded}
      />
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setOfferModalOpen(false)}
        onSubmit={handleOfferSubmit}
        isSubmitting={isCreatingOffer || isCounteringOffer}
        title={modalConfig.type === 'counter' ? 'Make a Counter Offer' : 'Make an Offer'}
        description={
          modalConfig.type === 'counter'
            ? "Propose a new amount for this vehicle."
            : "Submit a formal offer to the seller. They can accept, decline, or counter."
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    transform: [{ scaleY: -1 }],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  listContent: {
    padding: Spacing.md,
    transform: [{ scaleY: -1 }],
  },
  errorText: {
    ...Typography.heading.h4,
    color: Colors.danger,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorSubText: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
