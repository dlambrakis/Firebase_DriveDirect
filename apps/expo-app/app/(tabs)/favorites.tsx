import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { useFetchSavedVehicleListings } from '@directdrive/hooks';
import { VehicleCard, Button } from '@directdrive/ui';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { HeartOff } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const { data: vehicles, isLoading, isError, error } = useFetchSavedVehicleListings(user?.id);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>Error fetching saved vehicles.</Text>
          <Text style={styles.errorSubText}>{error?.message}</Text>
        </View>
      );
    }

    if (!vehicles || vehicles.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <HeartOff size={48} color={Colors.text.secondary} />
          <Text style={styles.emptyTitle}>No Saved Vehicles Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any listing to save it here.
          </Text>
          <Link href="/(tabs)/search" asChild>
            <Button title="Find Your Next Car" />
          </Link>
        </View>
      );
    }

    return (
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.listing_id.toString()}
        renderItem={({ item }) => <VehicleCard vehicle={item} LinkComponent={Link} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Vehicles</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  listContent: {
    padding: Spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    ...Typography.heading.h4,
    color: Colors.destructive.DEFAULT,
    marginBottom: Spacing.sm,
  },
  errorSubText: {
    ...Typography.body.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptyTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
