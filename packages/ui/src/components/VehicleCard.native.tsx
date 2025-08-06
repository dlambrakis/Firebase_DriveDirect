import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { VehicleWithImages } from '@directdrive/core-types';
import { useAuth, useSavedVehicles, useToggleSaveVehicle } from '@directdrive/hooks';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
import { Tag, Fuel, Gauge, GitMerge, MapPin, Heart } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: VehicleWithImages;
  LinkComponent: React.ElementType;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatMileage = (mileage: number) => {
  return `${Math.round(mileage / 1000)} 000 km`;
};

const InfoItem: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <View style={styles.infoItem}>
    <Icon size={16} color={Colors.primary.DEFAULT} />
    <Text style={styles.infoText}>{label}</Text>
  </View>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, LinkComponent }) => {
  const { user } = useAuth();
  const { data: savedVehicles } = useSavedVehicles(user?.id);
  const { mutate: toggleSave, isPending: isTogglingSave } = useToggleSaveVehicle();

  const isSaved = savedVehicles?.has(vehicle.listing_id) || false;

  const handleSaveClick = () => {
    if (user) {
      toggleSave({
        listingId: vehicle.listing_id,
        userId: user.id,
        isSaved,
      });
    }
  };

  const SaveButton = () => (
    <Pressable
      onPress={handleSaveClick}
      style={styles.saveButton}
      disabled={!user || isTogglingSave}
    >
      {isTogglingSave ? (
        <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
      ) : (
        <Heart size={20} color={isSaved ? Colors.red[500] : Colors.white} fill={isSaved ? Colors.red[500] : 'transparent'} />
      )}
    </Pressable>
  );

  return (
    <LinkComponent href={`/vehicle/${vehicle.listing_id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: vehicle.images?.[0]?.image_url || 'https://placehold.co/400x300/1a1a1a/ffffff?text=No+Image' }}
            style={styles.image}
          />
          <SaveButton />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
          <Text style={styles.variant} numberOfLines={1}>{vehicle.variant}</Text>
          <Text style={styles.price}>{formatPrice(vehicle.price)}</Text>
          <View style={styles.infoGrid}>
            <InfoItem icon={Gauge} label={formatMileage(vehicle.mileage)} />
            <InfoItem icon={GitMerge} label={vehicle.transmission} />
            <InfoItem icon={Fuel} label={vehicle.fuel_type} />
            <InfoItem icon={MapPin} label={vehicle.location} />
          </View>
        </View>
      </Pressable>
    </LinkComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Borders.radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.heading.h6,
    color: Colors.text.primary,
  },
  variant: {
    ...Typography.body.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  price: {
    ...Typography.heading.h5,
    color: Colors.primary.DEFAULT,
    marginBottom: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
});
