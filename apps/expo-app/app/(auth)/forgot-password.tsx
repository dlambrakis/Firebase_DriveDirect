import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useForgotPassword } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { Link } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import StyledInput from '@/components/form/StyledInput';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { mutate: sendResetLink, isPending, error } = useForgotPassword();

  const handleResetRequest = () => {
    setMessage('');
    sendResetLink(email, {
      onSuccess: () => {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </Pressable>
        </Link>
        <View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>We'll email you a link to reset your password.</Text>
        </View>

        <StyledInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

        <Button
          title="Send Reset Link"
          onPress={handleResetRequest}
          isLoading={isPending}
          style={{ marginTop: Spacing.sm }}
        />
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
    top: -Spacing.xl * 2,
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
  successText: {
    ...Typography.body.sm,
    color: Colors.success.DEFAULT,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
