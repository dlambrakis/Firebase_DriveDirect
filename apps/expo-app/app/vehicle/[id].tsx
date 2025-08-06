import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useVehicleDetail, useCreateConversation, useOfferMutations } from '@directdrive/hooks';
import { useAuth } from '@/providers/AuthProvider';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import VehicleDetail from '@/components/VehicleDetail';
import { Button } from '@/components/Button';
import ContactSellerModal from '@/components/ContactSellerModal';
import MakeOfferModal from '@/components/MakeOfferModal';
import { AlertTriangle, Edit } from 'lucide-react-native';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = parseInt(id || '0', 10);

  const { data: vehicle, isLoading, isError, error, refetch } = useVehicleDetail(listingId);
  const { createOffer } = useOfferMutations();
  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversation();

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);

  const handleContactSeller = (message: string) => {
    if (!vehicle?.seller_id) return;
    createConversation(
      { listingId, sellerId: vehicle.seller_id, message },
      {
        onSuccess: (data) => {
          setContactModalVisible(false);
          Alert.alert('Success', 'Your message has been sent.');
          const newConversationId = data?.new_conversation_id;
          if (newConversationId) {
            router.push(`/conversation/${newConversationId}`);
          } else {
            router.push('/(tabs)/messages');
          }
        },
        onError: (err) => {
          Alert.alert('Error', err.message || 'Failed to send message.');
        },
      }
    );
  };

  const handleMakeOffer = (amount: number) => {
    createOffer.mutate(
      { listingId, amount },
      {
        onSuccess: () => {
          setOfferModalVisible(false);
          Alert.alert('Success', 'Your offer has been submitted.');
          refetch();
        },
        onError: (err) => {
          Alert.alert('Error', err.message || 'Failed to submit offer.');
        },
      }
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary.DEFAULT} style={styles.centered} />;
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <AlertTriangle color={Colors.danger.DEFAULT} size={48} />
        <Text style={styles.errorText}>Error loading vehicle</Text>
        <Text style={styles.errorSubText}>{error?.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Vehicle not found.</Text>
      </View>
    );
  }

  const isOwner = user?.id === vehicle.seller_id;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <VehicleDetail vehicle={vehicle} />
      </ScrollView>
      
      <View style={styles.footer}>
        {isOwner ? (
          <Link href={`/my-listings/edit/${vehicle.id}`} asChild>
            <TouchableOpacity style={[styles.button, styles.singleButton]}>
              <Edit size={18} color={Colors.white} />
              <Text style={styles.buttonText}>Edit Listing</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <>
            <Button
              title="Contact Seller"
              onPress={() => setContactModalVisible(true)}
              style={styles.buttonFlex}
              variant="outline"
            />
            <Button
              title="Make an Offer"
              onPress={() => setOfferModalVisible(true)}
              style={styles.buttonFlex}
            />
          </>
        )}
      </View>

      <ContactSellerModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        onSubmit={handleContactSeller}
        isLoading={isCreatingConversation}
      />
      <MakeOfferModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onSubmit={handleMakeOffer}
        isLoading={createOffer.isPending}
        vehiclePrice={vehicle.price}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  contentContainer: {
    paddingBottom: 100, // Space for the footer
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    ...Typography.heading.h4,
    color: Colors.danger.DEFAULT,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorSubText: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.xl, // Safe area padding
  },
  buttonFlex: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  singleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.DEFAULT,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    marginHorizontal: Spacing.sm,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
});
