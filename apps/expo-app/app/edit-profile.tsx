import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import { useAuth, useProfileFormLogic } from '@directdrive/hooks';
import { Colors, Typography } from '@directdrive/theme';
import { Button } from '@/components/Button';
import StyledSelect from '@/components/form/StyledSelect';
import { Save, ShieldCheck } from 'lucide-react-native';
import { ProfileForm } from '@directdrive/features';

// --- Platform-specific Components for the Shared Form ---

const NativeInput = ({ name, label, control, error, keyboardType = 'default', ...props }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={styles.input}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value ?? ''}
          placeholderTextColor={Colors.text.tertiary}
          keyboardType={keyboardType}
          {...props}
        />
      )}
    />
    {error && <Text style={styles.errorMessage}>{error.message}</Text>}
  </View>
);

const NativeSelect = ({ name, label, control, error, options, placeholder, isLoading, disabled }: any) => (
  <View style={styles.inputContainer}>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <StyledSelect
          label={label}
          selectedValue={value}
          onValueChange={onChange}
          options={[{ label: isLoading ? 'Loading...' : placeholder, value: null }, ...options]}
          disabled={disabled || isLoading}
        />
      )}
    />
    {error && <Text style={styles.errorMessage}>{error.message}</Text>}
  </View>
);

const GridWrapper = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

// --- Main Screen Component ---

export default function EditProfileScreen() {
  const { user, supabase } = useAuth();
  const {
    form,
    onSubmit,
    isUpdating,
    isLoadingProfile,
    provinces, isLoadingProvinces,
    cities, isLoadingCities,
    suburbs, isLoadingSuburbs,
  } = useProfileFormLogic();

  const { control, handleSubmit, watch, formState: { errors } } = form;
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleFormSubmit = (data: any) => {
    setMessage('');
    onSubmit(
      data,
      () => setMessage('Profile updated successfully!'),
      (error) => setMessage(`Failed to update profile: ${error.message}`)
    );
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setPasswordMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${process.env.EXPO_PUBLIC_WEB_URL}/update-password` });
    if (error) {
      setPasswordMessage('Failed to send password reset email.');
    } else {
      setPasswordMessage('Password reset email sent. Please check your inbox.');
    }
  };

  if (isLoadingProfile) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary.DEFAULT} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <NativeInput name="display_name" label="Display Name" control={control} error={errors.display_name} placeholder="e.g. John D." />
        <NativeInput name="first_name" label="First Name" control={control} error={errors.first_name} placeholder="e.g. John" />
        <NativeInput name="last_name" label="Last Name" control={control} error={errors.last_name} placeholder="e.g. Doe" />
        <NativeInput name="contact_number" label="Contact Number" control={control} error={errors.contact_number} placeholder="e.g. 0821234567" keyboardType="numeric" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <ProfileForm
          InputComponent={NativeInput}
          SelectComponent={NativeSelect}
          GridWrapper={GridWrapper}
          control={control}
          watch={watch}
          errors={errors}
          provinces={provinces ?? []}
          isLoadingProvinces={isLoadingProvinces}
          cities={cities ?? []}
          isLoadingCities={isLoadingCities}
          suburbs={suburbs ?? []}
          isLoadingSuburbs={isLoadingSuburbs}
        />
      </View>

      <Button
        title="Save Changes"
        onPress={handleSubmit(handleFormSubmit)}
        isLoading={isUpdating}
        leftIcon={<Save color={Colors.white} size={20} />}
        style={{ marginBottom: 16 }}
      />
      {message ? <Text style={[styles.message, message.includes('Failed') ? styles.errorMessageText : styles.successMessage]}>{message}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.securityInfo}>An email will be sent to {user?.email} with instructions to reset your password.</Text>
        <Button title="Send Reset Email" onPress={handlePasswordReset} variant="outline" leftIcon={<ShieldCheck color={Colors.primary.DEFAULT} size={20} />} />
        {passwordMessage ? <Text style={[styles.message, passwordMessage.includes('Failed') ? styles.errorMessageText : styles.successMessage]}>{passwordMessage}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.DEFAULT },
  contentContainer: { padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.DEFAULT, padding: 24 },
  section: { marginBottom: 24, backgroundColor: Colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { ...Typography.heading.h4, color: Colors.text.primary, marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { ...Typography.body.sm, fontFamily: 'Inter_500Medium', color: Colors.text.secondary, marginBottom: 8 },
  input: { ...Typography.body.md, height: 50, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16, backgroundColor: Colors.background.DEFAULT, color: Colors.text.primary },
  message: { ...Typography.body.md, textAlign: 'center', marginTop: 16 },
  successMessage: { color: Colors.success.DEFAULT },
  errorMessage: { ...Typography.body.sm, color: Colors.danger.DEFAULT, marginTop: 4 },
  errorMessageText: { color: Colors.danger.DEFAULT, textAlign: 'center' },
  securityInfo: { ...Typography.body.md, color: Colors.text.secondary, marginBottom: 16 },
});
