import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Offer } from '@directdrive/core-types';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Tag, HandCoins, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react-native';
import { Button } from './Button';

interface OfferBubbleProps {
  offer: Offer;
  currentUserId: string;
  onRespond: (offerId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  onCounter: (offerId: string) => void;
  isResponding: boolean;
  isConcluded: boolean;
}

const OfferBubble: React.FC<OfferBubbleProps> = ({ offer, currentUserId, onRespond, onCounter, isResponding, isConcluded }) => {
  const isOfferSender = offer.sender_id === currentUserId;
  const isOfferRecipient = offer.recipient_id === currentUserId;
  const canRespond = isOfferRecipient && offer.status === 'PENDING' && !isConcluded;

  const getStatusInfo = () => {
    switch (offer.status) {
      case 'PENDING':
        return { text: 'Offer Pending', color: Colors.warning.DEFAULT, Icon: HandCoins };
      case 'ACCEPTED':
        return { text: 'Offer Accepted', color: Colors.success.DEFAULT, Icon: CheckCircle2 };
      case 'DECLINED':
        return { text: 'Offer Declined', color: Colors.danger.DEFAULT, Icon: XCircle };
      default:
        return { text: 'Offer', color: Colors.text.secondary, Icon: Tag };
    }
  };

  const { text, color, Icon } = getStatusInfo();
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(offer.amount);

  return (
    <View style={[styles.container, isOfferSender ? styles.senderContainer : styles.recipientContainer]}>
      <View style={styles.header}>
        <Icon size={20} color={color} />
        <Text style={[styles.statusText, { color }]}>{text}</Text>
      </View>
      <Text style={styles.amountText}>{formattedAmount}</Text>
      <Text style={styles.senderInfo}>
        {isOfferSender ? 'You sent an offer.' : `${offer.sender_profile?.full_name || 'They'} sent an offer.`}
      </Text>
      
      {canRespond && (
        <View style={styles.actionsContainer}>
          <Button
            title="Decline"
            onPress={() => onRespond(offer.id, 'DECLINED')}
            variant="destructive"
            size="sm"
            isLoading={isResponding}
            style={styles.actionButton}
          />
          <Button
            title="Counter"
            onPress={() => onCounter(offer.id)}
            variant="outline"
            size="sm"
            isLoading={isResponding}
            style={styles.actionButton}
            icon={<ArrowRightLeft size={16} color={Colors.primary.DEFAULT} />}
          />
          <Button
            title="Accept"
            onPress={() => onRespond(offer.id, 'ACCEPTED')}
            variant="success"
            size="sm"
            isLoading={isResponding}
            style={styles.actionButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 12,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  senderContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.DEFAULT,
  },
  recipientContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusText: {
    ...Typography.body.md_bold,
    marginLeft: Spacing.sm,
  },
  amountText: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  senderInfo: {
    ...Typography.body.sm,
    color: Colors.text.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});

export default OfferBubble;
