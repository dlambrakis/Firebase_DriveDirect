import { Offer, OfferStatus } from '@directdrive/core-types';
    import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
    import { Colors, Spacing, Typography, Borders, Shadows } from '@directdrive/theme';

    interface OfferCardProps {
      offer: Offer;
      isRecipient: boolean;
      onCounterOffer: (offerId: string) => void;
      onAccept: (offerId: string) => void;
      onDecline: (offerId: string) => void;
      isLoading: boolean;
      isNegotiationConcluded: boolean;
    }

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    const styles = StyleSheet.create({
      card: {
        padding: Spacing.lg,
        marginVertical: Spacing.sm,
        borderRadius: Borders.radius.lg,
        borderWidth: Borders.width.DEFAULT,
        backgroundColor: Colors.white,
        ...Shadows.subtle,
      },
      pendingContainer: { backgroundColor: Colors.warning.muted, borderColor: Colors.warning.border },
      acceptedContainer: { backgroundColor: Colors.success.muted, borderColor: Colors.success.border },
      declinedContainer: { backgroundColor: Colors.danger.muted, borderColor: Colors.danger.border },
      counterOfferedContainer: { backgroundColor: Colors.info.muted, borderColor: Colors.info.border },
      cancelledContainer: { backgroundColor: Colors.danger.muted, borderColor: Colors.danger.border },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
      },
      amount: {
        ...(Typography.heading.h6 as any),
        color: Colors.text.primary,
      },
      statusBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Borders.radius.full,
      },
      pendingBadge: { backgroundColor: Colors.warning.border },
      acceptedBadge: { backgroundColor: Colors.success.border },
      declinedBadge: { backgroundColor: Colors.danger.border },
      counterOfferedBadge: { backgroundColor: Colors.info.border },
      cancelledBadge: { backgroundColor: Colors.danger.border },
      statusText: {
        ...(Typography.body.sm as any),
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
      },
      pendingText: { color: Colors.warning.text },
      acceptedText: { color: Colors.success.text },
      declinedText: { color: Colors.danger.text },
      counterOfferedText: { color: Colors.info.text },
      cancelledText: { color: Colors.danger.text },
      dateText: {
        ...(Typography.body.sm as any),
        color: Colors.text.secondary,
        marginBottom: Spacing.md,
      },
      buttonContainer: {
        marginTop: Spacing.md,
        flexDirection: 'row',
        gap: Spacing.sm,
      },
      button: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: Borders.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.button,
      },
      acceptButton: { backgroundColor: Colors.success.DEFAULT },
      declineButton: { backgroundColor: Colors.danger.DEFAULT },
      counterButton: { backgroundColor: Colors.info.DEFAULT },
      buttonText: {
        ...(Typography.button as any),
        color: Colors.white,
      },
    });

    const statusStyles: Record<OfferStatus, { container: object; badge: object; text: object }> = {
      PENDING: { container: styles.pendingContainer, badge: styles.pendingBadge, text: styles.pendingText },
      ACCEPTED: { container: styles.acceptedContainer, badge: styles.acceptedBadge, text: styles.acceptedText },
      DECLINED: { container: styles.declinedContainer, badge: styles.declinedBadge, text: styles.declinedText },
      COUNTER_OFFERED: { container: styles.counterOfferedContainer, badge: styles.counterOfferedBadge, text: styles.counterOfferedText },
      CANCELLED: { container: styles.cancelledContainer, badge: styles.cancelledBadge, text: styles.cancelledText },
    };

    export const OfferCard = ({ offer, isRecipient, onCounterOffer, onAccept, onDecline, isLoading, isNegotiationConcluded }: OfferCardProps) => {
      const stylesForStatus = statusStyles[offer.status] || statusStyles.PENDING;
      const showButtons = isRecipient && offer.status === 'PENDING' && !isNegotiationConcluded;

      return (
        <View style={[styles.card, stylesForStatus.container]}>
          <View style={styles.header}>
            <Text style={styles.amount}>{formatPrice(Number(offer.amount))}</Text>
            <View style={[styles.statusBadge, stylesForStatus.badge]}>
              <Text style={[styles.statusText, stylesForStatus.text]}>{offer.status.replace('_', ' ')}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>Offer sent at {new Date(offer.created_at).toLocaleString()}</Text>

          {showButtons && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => onAccept(offer.id)} disabled={isLoading} style={[styles.button, styles.acceptButton]}>
                {isLoading ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.buttonText}>Accept</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onCounterOffer(offer.id)} disabled={isLoading} style={[styles.button, styles.counterButton]}>
                {isLoading ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.buttonText}>Counter</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDecline(offer.id)} disabled={isLoading} style={[styles.button, styles.declineButton]}>
                {isLoading ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.buttonText}>Decline</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    };
