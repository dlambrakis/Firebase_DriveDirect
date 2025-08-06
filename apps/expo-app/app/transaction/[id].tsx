import React from 'react';
    import { View, Text, StyleSheet, ScrollView } from 'react-native';
    import { useLocalSearchParams, Stack, Link } from 'expo-router';
    import { ShieldCheck, Car, Wrench } from 'lucide-react-native';
    import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
    import { Button } from '@/components/Button';

    const PlaceholderCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
      <View style={styles.card}>
        <Icon size={48} color={Colors.primary.DEFAULT} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <Button title="Coming Soon" disabled style={{ marginTop: Spacing.md }} />
      </View>
    );

    export default function TransactionScreen() {
      const { id } = useLocalSearchParams<{ id: string }>();

      return (
        <>
          <Stack.Screen options={{ title: 'Deal Finalized' }} />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
              <ShieldCheck size={64} color={Colors.success.DEFAULT} />
              <Text style={styles.title}>Deal Finalized!</Text>
              <Text style={styles.subtitle}>
                Congratulations on your vehicle deal.
              </Text>
              <Text style={styles.transactionId}>
                Transaction ID: {id}
              </Text>
            </View>

            <PlaceholderCard
              icon={Wrench}
              title="Pre-Purchase Inspection"
              description="Schedule an independent inspection to ensure vehicle quality."
            />

            <PlaceholderCard
              icon={Car}
              title="Transaction Facilitation"
              description="Securely handle payments and ownership transfer."
            />

            <Link href="/(tabs)/my-listings" asChild>
              <Text style={styles.link}>Back to My Listings</Text>
            </Link>
          </ScrollView>
        </>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: Colors.background.DEFAULT,
      },
      contentContainer: {
        padding: Spacing.lg,
        alignItems: 'center',
      },
      header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
      },
      title: {
        ...Typography.heading.h3,
        color: Colors.text.primary,
        marginTop: Spacing.md,
      },
      subtitle: {
        ...Typography.body.lg,
        color: Colors.text.secondary,
        marginTop: Spacing.sm,
        textAlign: 'center',
      },
      transactionId: {
        ...Typography.body.sm,
        color: Colors.text.tertiary,
        marginTop: Spacing.xs,
      },
      card: {
        backgroundColor: Colors.background.light,
        borderRadius: Borders.radius.lg,
        padding: Spacing.lg,
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
      },
      cardTitle: {
        ...Typography.heading.h6,
        color: Colors.text.primary,
        marginTop: Spacing.md,
      },
      cardDescription: {
        ...Typography.body.md,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: Spacing.xs,
      },
      link: {
        ...Typography.body.md,
        color: Colors.primary.DEFAULT,
        fontWeight: '600',
        marginTop: Spacing.lg,
      },
    });
