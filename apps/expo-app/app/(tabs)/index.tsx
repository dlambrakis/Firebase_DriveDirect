import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth, useProfile } from '@directdrive/hooks';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
import { router } from 'expo-router';
import { Search, PlusCircle, MessageSquare, User, List, LogIn } from 'lucide-react-native';
import FeaturedListings from '@/components/FeaturedListings';
import { Button } from '@/components/Button';

const GuestView = () => (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>Find Your Next Ride</Text>
      <Text style={styles.heroSubtitle}>The best place to buy and sell quality vehicles.</Text>
      <Button
        title="Browse Listings"
        onPress={() => router.push('/search')}
        leftIcon={<Search color={Colors.white} size={20} />}
        style={{ marginTop: Spacing.lg }}
      />
    </View>
    <FeaturedListings />
  </ScrollView>
);

const DashboardView = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>Welcome, {profile?.display_name || 'User'}</Text>
        <Text style={styles.welcomeSubtitle}>Here's a quick look at your account.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton icon={Search} label="Browse Cars" screen="/search" color="#3b82f6" />
          <QuickActionButton icon={PlusCircle} label="Sell Your Car" screen="/(tabs)/sell" color="#22c55e" />
          <QuickActionButton icon={MessageSquare} label="Messages" screen="/(tabs)/messages" color="#8b5cf6" />
          <QuickActionButton icon={User} label="My Profile" screen="/(tabs)/profile" color="#f97316" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Overview</Text>
        <OverviewCard
          icon={List}
          title="Manage Listings"
          description="View, edit, or delete your current vehicle listings."
          buttonText="View My Listings"
          screen="/(tabs)/my-listings"
        />
      </View>
    </ScrollView>
  );
};

const QuickActionButton = ({ icon: Icon, label, screen, color }) => (
  <TouchableOpacity style={styles.quickAction} onPress={() => router.push(screen)}>
    <View style={[styles.quickActionIconContainer, { backgroundColor: `${color}20` }]}>
      <Icon size={28} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const OverviewCard = ({ icon: Icon, title, description, buttonText, screen }) => (
  <View style={styles.overviewCard}>
    <Icon size={32} color={Colors.primary.DEFAULT} />
    <Text style={styles.overviewTitle}>{title}</Text>
    <Text style={styles.overviewDescription}>{description}</Text>
    <Button title={buttonText} onPress={() => router.push(screen)} style={{ width: '100%', marginTop: Spacing.md }} />
  </View>
);

export default function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {user ? <DashboardView /> : <GuestView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  // Guest View
  heroSection: {
    backgroundColor: Colors.primary.DEFAULT,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    ...Typography.heading.h2,
    color: Colors.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.body.lg,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  // Dashboard View
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.light,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  welcomeTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
  },
  welcomeSubtitle: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading.h6,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    ...Typography.body.md,
    color: Colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  overviewCard: {
    backgroundColor: Colors.card,
    borderRadius: Borders.radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overviewTitle: {
    ...Typography.heading.h6,
    color: Colors.text.primary,
    marginTop: Spacing.md,
  },
  overviewDescription: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    minHeight: 40,
  },
});
