import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, Pressable } from 'react-native';
import { useUserListings, useDeleteVehicle, useUpdateListingStatus, ListingStatus, useAuth } from '@directdrive/hooks';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@directdrive/theme';
import { Button } from '@/components/Button';
import MyListingCard from '@/components/MyListingCard';
import { PlusCircle, AlertTriangle, LogIn } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function MyListingsScreen() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  // The hook now works correctly without arguments.
  const { data: listings, isLoading: areListingsLoading, isError, error, refetch } = useUserListings();
  const deleteMutation = useDeleteVehicle();
  const updateStatusMutation = useUpdateListingStatus();

  const isLoading = isAuthLoading || areListingsLoading;

  const handleDelete = (listingId: number) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to permanently delete this listing? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate({ listingId }, {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: 'Listing Deleted',
                  text2: 'Your listing has been successfully removed.',
                });
              },
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'Deletion Failed',
                  text2: err.message || 'Failed to delete listing.',
                });
              },
            });
          },
        },
      ]
    );
  };

  const handleUpdateStatus = (listingId: number, status: ListingStatus) => {
    updateStatusMutation.mutate({ listingId, status }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Your listing has been marked as ${status.toLowerCase()}.`,
        });
      },
      onError: (err) => {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: err.message || 'An unexpected error occurred.',
        });
      },
    });
  };

  const renderContent = () => {
    if (isLoading && !listings) {
      return <ActivityIndicator size="large" color={Colors.primary.DEFAULT} style={styles.centered} />;
    }

    // Handle case where user is not logged in.
    if (!user && !isLoading) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Please log in to see your listings.</Text>
          <Button
            title="Go to Login"
            onPress={() => router.push('/(auth)/login')}
            icon={<LogIn color={Colors.white} size={18} />}
          />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <AlertTriangle color={Colors.danger.DEFAULT} size={48} />
          <Text style={styles.errorText}>Error loading listings</Text>
          <Text style={styles.errorSubText}>{error?.message}</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      );
    }

    if (!listings || listings.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You have no active listings.</Text>
          <Button
            title="List Your First Vehicle"
            onPress={() => router.push('/(tabs)/sell')}
            icon={<PlusCircle color={Colors.white} size={18} />}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MyListingCard
            listing={item}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending && deleteMutation.variables?.listingId === item.id}
            onUpdateStatus={handleUpdateStatus}
            isUpdatingStatus={updateStatusMutation.isPending && updateStatusMutation.variables?.listingId === item.id}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[Colors.primary.DEFAULT]} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <Pressable onPress={() => router.push('/(tabs)/sell')} style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <PlusCircle color={Colors.primary.DEFAULT} size={24} />
        </Pressable>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  addButton: {
    padding: Spacing.xs,
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  listContainer: {
    padding: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    ...Typography.body.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
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
});
