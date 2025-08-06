import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VehicleForm from '@/components/VehicleForm';
import { Colors, Typography, Spacing } from '@directdrive/theme';
import { VehicleFormValues, useVehicle, useUpdateVehicle } from '@directdrive/hooks';

export default function EditVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listingId = Number(id);

  const { data: vehicle, isLoading, isError } = useVehicle(listingId);
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const handleSubmit = (
    formData: VehicleFormValues,
    newImageUris: string[],
    deletedImageUrls: string[]
  ) => {
    const payload = {
      p_listing_id: listingId,
      vehicleData: formData,
      new_image_uris: newImageUris,
      deleted_image_urls: deletedImageUrls,
    };

    updateVehicle(payload, {
      onSuccess: () => {
        Alert.alert('Success!', 'Your vehicle has been updated.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (error: Error) => {
        Alert.alert('Update Failed', error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Vehicle...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !vehicle) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error loading vehicle data.</Text>
      </SafeAreaView>
    );
  }

  const defaultValues = {
    ...vehicle,
    feature_ids: vehicle.features?.map(f => f.id) || [],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Your Vehicle</Text>
          <Text style={styles.headerSubtitle}>Update the details for your listing.</Text>
        </View>
        <VehicleForm
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          defaultValues={defaultValues}
          existingImageUrls={vehicle.images || []}
          submitButtonText="Save Changes"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.heading.h3,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.danger,
  },
});
