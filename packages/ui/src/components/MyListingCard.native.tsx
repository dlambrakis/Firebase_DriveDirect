import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { VehicleListingDetailed } from '@directdrive/core-types';
import { ListingStatus } from '@directdrive/hooks';
import { formatPrice, formatMileage } from '@directdrive/utils';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
import { Eye, Edit, Trash2, Tag, RotateCcw } from 'lucide-react-native';

interface MyListingCardProps {
  listing: VehicleListingDetailed;
  onDelete: (listingId: number) => void;
  isDeleting: boolean;
  onUpdateStatus: (listingId: number, status: ListingStatus) => void;
  isUpdatingStatus: boolean;
}

export const MyListingCard: React.FC<MyListingCardProps> = ({ listing, onDelete, isDeleting, onUpdateStatus, isUpdatingStatus }) => {
  const router = useRouter();
  const isSold = listing.status === 'SOLD';

  const handleDeletePress = () => {
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone. This will permanently delete your listing.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => onDelete(listing.id), style: "destructive" }
      ]
    );
  };

  const ActionButton: React.FC<{
    onPress: () => void;
    icon: React.ReactNode;
    label: string;
    color?: string;
    disabled?: boolean;
  }> = ({ onPress, icon, label, color = Colors.text.secondary, disabled }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.actionButton, (pressed || disabled) && styles.actionButtonPressed]}
    >
      {icon}
      <Text style={[styles.actionButtonText, { color: disabled ? Colors.text.disabled : color }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.images?.[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Image' }}
          style={[styles.image, isSold && styles.soldImage]}
        />
        {isSold && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldBadgeText}>SOLD</Text>
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{`${listing.year} ${listing.make} ${listing.model}`}</Text>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <Text style={styles.mileage}>{formatMileage(listing.mileage)}</Text>
      </View>
      <View style={styles.footer}>
        <ActionButton
          onPress={() => router.push(`/vehicle/${listing.id}`)}
          icon={<Eye size={16} color={Colors.primary.DEFAULT} />}
          label="View"
          color={Colors.primary.DEFAULT}
        />

        {isSold ? (
          <ActionButton
            onPress={() => onUpdateStatus(listing.id, 'ACTIVE')}
            icon={isUpdatingStatus ? <ActivityIndicator size="small" color={Colors.text.secondary} /> : <RotateCcw size={16} color={Colors.text.secondary} />}
            label={isUpdatingStatus ? 'Updating...' : 'Mark Active'}
            disabled={isUpdatingStatus}
          />
        ) : (
          <ActionButton
            onPress={() => onUpdateStatus(listing.id, 'SOLD')}
            icon={isUpdatingStatus ? <ActivityIndicator size="small" color={Colors.text.secondary} /> : <Tag size={16} color={Colors.text.secondary} />}
            label={isUpdatingStatus ? 'Updating...' : 'Mark Sold'}
            disabled={isUpdatingStatus || isDeleting}
          />
        )}

        <ActionButton
          onPress={() => router.push(`/edit-listing/${listing.id}`)}
          icon={<Edit size={16} color={isSold ? Colors.text.disabled : Colors.text.secondary} />}
          label="Edit"
          disabled={isSold || isUpdatingStatus || isDeleting}
        />
        <Pressable
          onPress={handleDeletePress}
          disabled={isDeleting || isSold || isUpdatingStatus}
          style={({ pressed }) => [styles.actionButton, (pressed || isDeleting || isSold) && styles.actionButtonPressed]}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={Colors.danger.DEFAULT} />
          ) : (
            <Trash2 size={16} color={isSold ? Colors.text.disabled : Colors.danger.DEFAULT} />
          )}
          <Text style={[styles.actionButtonText, { color: isSold || isDeleting ? Colors.text.disabled : Colors.danger.DEFAULT }]}>
            {isDeleting ? 'Deleting' : 'Delete'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Borders.radius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  soldImage: {
    opacity: 0.5,
  },
  soldBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }, { rotate: '-15deg' }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radius.md,
  },
  soldBadgeText: {
    ...Typography.heading.h4,
    color: Colors.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.heading.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  price: {
    ...Typography.heading.h4,
    color: Colors.primary.DEFAULT,
    marginBottom: Spacing.xs,
  },
  mileage: {
    ...Typography.body.md,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
  actionButtonText: {
    ...Typography.body.sm,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
});
