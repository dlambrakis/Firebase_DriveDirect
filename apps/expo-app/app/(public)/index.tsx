import React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Pressable, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
import { Car, Users, Star, TrendingUp, ShieldCheck, Zap, ArrowRight, ArrowRightLeft } from 'lucide-react-native';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2940&auto=format&fit=crop';

const stats = [
  { icon: Users, value: '10k+', label: 'USERS' },
  { icon: Car, value: '2.5k+', label: 'CARS SOLD' },
  { icon: Star, value: '4.9', label: 'RATING' },
  { icon: TrendingUp, value: '98%', label: 'SUCCESS' },
];

const features = [
  { icon: ArrowRightLeft, title: 'Direct P2P Sales', description: 'Buy and sell cars directly with other users.', iconBgColor: '#DBEAFE' },
  { icon: ShieldCheck, title: 'Secure & Verified', description: 'A safe and verified transaction process.', iconBgColor: '#D1FAE5' },
  { icon: Users, title: 'Community Driven', description: 'Join a community of car enthusiasts.', iconBgColor: '#E9D5FF' },
  { icon: Zap, title: 'Fast & Easy', description: 'A streamlined process for buying and selling.', iconBgColor: '#FEF9C3' },
];

const LandingHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + Spacing.xs }]}>
      <View style={styles.logoContainer}>
        <Car color={Colors.primary.DEFAULT} size={24} />
        <Text style={styles.logoText}>DriveDirect</Text>
      </View>
      <View style={styles.headerActions}>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.headerLink}>Sign In</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/signup" asChild>
          <Pressable style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const StatItem = ({ icon: Icon, value, label, isLast }: { icon: React.ElementType, value: string, label: string, isLast?: boolean }) => (
  <View style={[styles.statItem, isLast && styles.statItemLast]}>
    <Icon color={Colors.primary.DEFAULT} size={22} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const FeatureCard = ({ icon: Icon, title, description, iconBgColor }: { icon: React.ElementType, title: string, description: string, iconBgColor: string }) => (
  <View style={styles.featureCard}>
    <View style={[styles.featureIconContainer, { backgroundColor: iconBgColor }]}>
      <Icon color={Colors.primary.DEFAULT} size={20} />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <LandingHeader />
      <View style={styles.container}>
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroContainer} testID="landing-screen">
          <View style={styles.overlay} />
          <View style={styles.heroContent}>
            <Text style={styles.title}>
              Buy & Sell Cars {'\n'}
              <Text style={{ color: Colors.primary.DEFAULT }}>Person to Person</Text>
            </Text>
            <Text style={styles.subtitle}>
              Skip the dealership and connect directly with owners.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.heroButton, pressed && styles.buttonPressed]}
              onPress={() => router.push({ pathname: '/(tabs)/', params: { guest: 'true' } })}
            >
              <Text style={styles.heroButtonText}>Browse Cars</Text>
              <ArrowRight color={Colors.text.white} size={18} />
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <StatItem key={index} {...stat} isLast={index === stats.length - 1} />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose DriveDirect?</Text>
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }
    })
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    ...Typography.heading.h6,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.text.white,
    marginLeft: Spacing.sm,
    ...Platform.select({
      native: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      web: {
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
      },
    }),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerLink: {
    ...Typography.body.md,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.white,
    ...Platform.select({
      native: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      web: {
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
      },
    }),
  },
  signUpButton: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Borders.radius.md,
  },
  signUpButtonText: {
    ...Typography.body.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.white,
  },
  heroContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60, // Space for header
  },
  title: {
    ...Typography.heading.h2,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    ...Platform.select({
      native: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
      },
      web: {
        textShadow: '0px 2px 10px rgba(0, 0, 0, 0.75)',
      },
    }),
  },
  subtitle: {
    ...Typography.body.md,
    fontFamily: 'Inter_400Regular',
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    maxWidth: '95%',
    marginBottom: Spacing.lg,
    ...Platform.select({
      native: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
      },
      web: {
        textShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
      },
    }),
  },
  heroButton: {
    backgroundColor: Colors.primary.DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  heroButtonText: {
    ...Typography.body.md,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.white,
    marginRight: Spacing.sm,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  contentContainer: {
    flex: 0.5,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.DEFAULT,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Borders.radius.lg,
    marginTop: -50,
    paddingVertical: Spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
      web: {
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  statItem: {
    flex: 1,
    padding: Spacing.sm,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statItemLast: {
    borderRightWidth: 0,
  },
  statValue: {
    ...Typography.heading.h5,
    fontFamily: 'Inter_700Bold',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  statLabel: {
    ...Typography.body.xs,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  section: {
    paddingTop: Spacing.lg,
    flex: 1,
  },
  sectionTitle: {
    ...Typography.heading.h4,
    textAlign: 'center',
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: Spacing.md,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.card,
    padding: Spacing.sm,
    borderRadius: Borders.radius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    ...Typography.body.md,
    fontFamily: 'Inter_700Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    ...Typography.body.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
