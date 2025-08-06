import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useSignIn } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Link } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import StyledInput from '@/components/form/StyledInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: signIn, isPending, error } = useSignIn();

  const handleLogin = () => {
    signIn({ email, password });
    // On success, the AuthProvider and RootLayout will handle the redirect.
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Link href="/(public)" asChild>
          <Pressable style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </Pressable>
        </Link>
        <View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to DirectDrive</Text>
        </View>

        <StyledInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <StyledInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

        <Button
          title="Sign In"
          onPress={handleLogin}
          isLoading={isPending}
          style={{ marginTop: Spacing.sm }}
        />
        
        <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
                <Pressable>
                    <Text style={styles.footerLink}>Sign Up</Text>
                </Pressable>
            </Link>
        </View>

        <View style={styles.forgotPasswordContainer}>
            <Link href="/(auth)/forgot-password" asChild>
                <Pressable>
                    <Text style={styles.footerLink}>Forgot Password?</Text>
                </Pressable>
            </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: -Spacing.xl,
    left: Spacing.lg,
    padding: Spacing.xs,
  },
  title: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorText: {
    ...Typography.body.sm,
    color: Colors.danger.DEFAULT,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.body.sm,
    color: Colors.text.secondary,
  },
  footerLink: {
    ...Typography.body.sm,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary.DEFAULT,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
