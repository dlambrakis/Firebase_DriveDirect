import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useSignUp } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import StyledInput from '@/components/form/StyledInput';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { mutate: signUp, isPending, error } = useSignUp();
  const router = useRouter();

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    setValidationError('');

    signUp(
      { email, password },
      {
        onSuccess: (data) => {
          if (!data.session) {
            // This case occurs if email confirmation is enabled in Supabase project settings
            Alert.alert(
              "Check your email",
              "A confirmation link has been sent to your email address. Please verify your email to continue.",
              [{ text: "OK", onPress: () => router.replace('/(auth)/login') }]
            );
          }
          // On successful sign-up with a session, the AuthProvider will handle the redirect.
        },
      }
    );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your journey with DirectDrive</Text>
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
          placeholder="Min. 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <StyledInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}
        {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

        <Button
          title="Create Account"
          onPress={handleSignUp}
          isLoading={isPending}
          style={{ marginTop: Spacing.sm }}
        />
        
        <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
                <Pressable>
                    <Text style={styles.footerLink}>Sign In</Text>
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
  }
});
