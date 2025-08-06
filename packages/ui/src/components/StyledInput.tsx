import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';

interface StyledInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const StyledInput: React.FC<StyledInputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={Colors.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: Borders.radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    ...Typography.body.md,
    color: Colors.text.primary,
  },
  inputError: {
    borderColor: Colors.danger.DEFAULT,
  },
  errorText: {
    ...Typography.body.sm,
    color: Colors.danger.DEFAULT,
    marginTop: Spacing.xs,
  },
});

export default StyledInput;
