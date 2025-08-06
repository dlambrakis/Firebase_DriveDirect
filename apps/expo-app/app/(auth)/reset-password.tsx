import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth, useUpdatePassword } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { router } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { Button } from '@/components/Button';
import StyledInput from '@/components/form/StyledInput';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: updatePassword, isPending, isSuccess, error, isError } = useUpdatePassword();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handlePasswordUpdate = () => {
    if (password) {
      updatePassword({ password });
    }
  };

  if (isAuthLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  }

  if (!user && !isSuccess) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Invalid Link</Text>
          <Text style={styles.subtitle}>
            This password reset link is invalid or has expired. Please request a new one.
          </Text>
          <Button
            title="Request New Link"
            onPress={() => router.replace('/(auth)/forgot-password')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <KeyRound size={48} color={Colors.primary.DEFAULT} />
          <Text style={styles.title}>Update Password</Text>
          <Text style={styles.subtitle}>
            {isSuccess
              ? 'Password updated! Redirecting...'
              : 'Please enter your new password.'}
          </Text>
        </View>

        {isSuccess ? (
          <View style={styles.center}>
            <Button
              title="Go to Home"
              onPress={() => router.replace('/(tabs)/')}
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        ) : (
          <>
            <StyledInput
              label="New Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {isError ? <Text style={styles.errorText}>{error?.message}</Text> : null}

            <Button
              title="Update Password"
              onPress={handlePasswordUpdate}
              isLoading={isPending}
              style={{ marginTop: Spacing.sm }}
            />
          </>
        )}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
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
    marginTop: Spacing.md,
  },
});
