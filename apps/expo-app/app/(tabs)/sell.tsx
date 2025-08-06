import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateVehicle } from '@directdrive/hooks';
import { VehicleFormValues } from '@directdrive/core-types';
import { VehicleForm } from '@/components/VehicleForm';
import { Colors, Spacing, Typography } from '@directdrive/theme';

export default function SellScreen() {
  const router = useRouter();
  const { mutate: createVehicle, isPending } = useCreateVehicle();

  const handleSubmit = (
    vehicleData: VehicleFormValues,
    newImageUris: string[]
    // deletedUrls is unused in create context, but the signature must match
  ) => {
    if (newImageUris.length === 0) {
      Alert.alert('Missing Images', 'Please select at least one image for your listing.');
      return;
    }

    createVehicle(
      { vehicleData, image_uris: newImageUris },
      {
        onSuccess: (data) => {
          Alert.alert('Success', 'Your vehicle has been listed successfully.', [
            { text: 'OK', onPress: () => router.push(`/vehicle/${data.new_listing_id}`) },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', `Failed to list vehicle: ${error.message}`);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>List Your Vehicle</Text>
          <Text style={styles.subtitle}>Fill out the details below to create your listing.</Text>
        </View>
        <VehicleForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitButtonText="Create Listing"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body.lg,
    color: Colors.text.secondary,
  },
});
