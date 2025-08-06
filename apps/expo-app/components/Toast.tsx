import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors, Spacing, Typography, Borders } from '@directdrive/theme';
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native';

const toastStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: Borders.radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderLeftWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  text1: {
    ...Typography.body.md,
    fontWeight: '600',
  },
  text2: {
    ...Typography.body.sm,
  },
  success: {
    backgroundColor: Colors.success.background,
  },
  error: {
    backgroundColor: Colors.danger.background,
  },
  info: {
    backgroundColor: Colors.info.background,
  },
});

export const toastConfig = {
  success: (props: any) => (
    <View style={[toastStyles.base, toastStyles.success]}>
      <CheckCircle color={Colors.success.DEFAULT} size={24} />
      <View style={toastStyles.contentContainer}>
        <Text style={[toastStyles.text1, { color: Colors.success.DEFAULT }]}>{props.text1}</Text>
        {props.text2 && <Text style={[toastStyles.text2, { color: Colors.text.secondary }]}>{props.text2}</Text>}
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={[toastStyles.base, toastStyles.error]}>
      <AlertCircle color={Colors.danger.DEFAULT} size={24} />
      <View style={toastStyles.contentContainer}>
        <Text style={[toastStyles.text1, { color: Colors.danger.DEFAULT }]}>{props.text1}</Text>
        {props.text2 && <Text style={[toastStyles.text2, { color: Colors.text.secondary }]}>{props.text2}</Text>}
      </View>
    </View>
  ),
  info: (props: any) => (
    <View style={[toastStyles.base, toastStyles.info]}>
      <Info color={Colors.info.DEFAULT} size={24} />
      <View style={toastStyles.contentContainer}>
        <Text style={[toastStyles.text1, { color: Colors.info.DEFAULT }]}>{props.text1}</Text>
        {props.text2 && <Text style={[toastStyles.text2, { color: Colors.text.secondary }]}>{props.text2}</Text>}
      </View>
    </View>
  ),
};
