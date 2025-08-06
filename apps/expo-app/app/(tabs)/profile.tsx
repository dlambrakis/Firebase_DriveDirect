import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useProfile, useProvinces, useCities, useSuburbs } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Button } from '@/components/Button';
import { router, useFocusEffect } from 'expo-router';
import { User, MapPin, Pencil } from 'lucide-react-native';

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

export default function ProfileScreen() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  
  // Pre-fetch location data for display
  const { data: provinces } = useProvinces();
  const { data: cities } = useCities(profile?.province_id);
  const { data: suburbs } = useSuburbs(profile?.city_id);

  // Refetch profile data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const provinceName = provinces?.find(p => p.id === profile?.province_id)?.name;
  const cityName = cities?.find(c => c.id === profile?.city_id)?.name;
  const suburbName = suburbs?.find(s => s.id === profile?.suburb_id)?.name;

  const formatAddress = () => {
    if (!profile) return 'No address information provided.';
    const parts = [
      profile.complex_or_estate_name ? `${profile.unit_number || ''} ${profile.complex_or_estate_name}`.trim() : null,
      `${profile.street_number || ''} ${profile.street_name || ''}`.trim(),
      suburbName,
      cityName,
      provinceName,
      profile.postcode,
      profile.country || 'South Africa'
    ];
    return parts.filter(Boolean).join(', ');
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMessage}>Error: {error.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>No Profile Found</Text>
        <Text style={styles.subtitle}>Please create your profile to continue.</Text>
        <Button
          title="Create Profile"
          onPress={() => router.push('/edit-profile')}
          style={{ marginTop: Spacing.lg }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary.DEFAULT} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Button
          title="Edit"
          onPress={() => router.push('/edit-profile')}
          variant="outline"
          size="sm"
          leftIcon={<Pencil color={Colors.primary.DEFAULT} size={16} />}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color={Colors.primary.DEFAULT} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        <InfoRow label="Display Name" value={profile.display_name} />
        <InfoRow label="Full Name" value={`${profile.first_name || ''} ${profile.last_name || ''}`.trim()} />
        <InfoRow label="Contact Number" value={profile.contact_number} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={24} color={Colors.primary.DEFAULT} />
          <Text style={styles.sectionTitle}>Address</Text>
        </View>
        <InfoRow label="Location Type" value={profile.location_type} />
        <InfoRow label="Residential Type" value={profile.residential_type} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Address</Text>
          <Text style={[styles.value, { lineHeight: 22 }]}>{formatAddress()}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  infoRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    ...Typography.body.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.body.md,
    color: Colors.text.primary,
  },
  title: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  errorMessage: {
    ...Typography.body.md,
    color: Colors.danger.DEFAULT,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
