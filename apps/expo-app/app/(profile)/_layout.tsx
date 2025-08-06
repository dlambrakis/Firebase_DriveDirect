import { Stack } from 'expo-router';
import React from 'react';
import { Colors } from '@directdrive/theme';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background.DEFAULT,
        },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
        }}
      />
    </Stack>
  );
}
