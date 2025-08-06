import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVehicleDetail, useUpdateVehicle } from '@directdrive/hooks';
import { VehicleFormValues } from '@directdrive/core-types';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { Colors, Spacing, Typography } from '@directdrive/theme';

const EditVehicleScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listingId = parseInt(id || '0', 10);

  const { data: vehicle, isLoading: isLoadingVehicle, error: vehicleError } = useVehicleDetail(listingId);
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const handleSubmit = (
    vehicleData: VehicleFormValues,
    newImageUris: string[],
    deletedImageUrls: string[]
  ) => {
    updateVehicle(
      {
        p_listing_id: listingId,
        vehicleData,
        new_image_uris: newImageUris,
        deleted_image_urls: deletedImageUrls,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Vehicle updated successfully!');
          router.push('/(tabs)/my-listings');
        },
        onError: (error) => {
          Alert.alert('Error', `Failed to update vehicle: ${error.message}`);
        },
      }
    );
  };

  if (isLoadingVehicle) {
    return <ActivityIndicator size="large" color={Colors.primary.DEFAULT} style={styles.centered} />;
  }

  if (vehicleError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {vehicleError.message}</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.centered}>
        <Text>Vehicle not found.</Text>
      </View>
    );
  }

  const defaultValues: Partial<VehicleFormValues> = {
    make_id: vehicle.make_id,
    model_id: vehicle.model_id,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    vin: vehicle.vin,
    description: vehicle.description,
    feature_ids: vehicle.features?.map(f => f.feature_id) || [],
    body_type_id: vehicle.body_type_id,
    transmission_type_id: vehicle.transmission_type_id,
    fuel_type_id: vehicle.fuel_type_id,
    drivetrain_id: vehicle.drivetrain_id,
    engine_size_id: vehicle.engine_size_id,
    aspiration_id: vehicle.aspiration_id,
    doors_id: vehicle.doors_id,
    isSold: vehicle.status === 'sold',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Edit Listing</Text>
      <VehicleForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        existingImageUrls={vehicle.images || []}
        isSubmitting={isUpdating}
        submitButtonText="Save Changes"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    ...Typography.body.lg,
  },
});

export default EditVehicleScreen;
