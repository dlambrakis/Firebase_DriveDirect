import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useVehicleSearch } from '@directdrive/hooks';
import { VehicleCard } from '@directdrive/ui';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Link } from 'expo-router';

const FeaturedListings = () => {
  const { data, isLoading, error } = useVehicleSearch({ pageSize: 5, sortBy: 'created_at', sortDirection: 'desc' });

  const vehicles = data?.pages.flatMap(page => page.data) || [];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Could not load featured listings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Listings</Text>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} LinkComponent={Link} />}
        keyExtractor={(item) => item.listing_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
  },
  centered: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    ...Typography.body.lg,
    color: Colors.destructive.DEFAULT,
    textAlign: 'center',
    padding: Spacing.lg,
  }
});

export default FeaturedListings;
