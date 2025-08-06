import React from 'react';
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@directdrive/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@directdrive/theme';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/Toast';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ 
              headerShown: true,
              title: 'Search Listings',
              headerStyle: { backgroundColor: Colors.background.DEFAULT },
              headerTintColor: Colors.text.primary,
              headerTitleStyle: { color: Colors.text.primary },
            }} />
            <Stack.Screen name="edit-profile" options={{ 
              headerShown: true,
              title: 'Edit Profile',
              headerStyle: { backgroundColor: Colors.background.DEFAULT },
              headerTintColor: Colors.text.primary,
              headerTitleStyle: { color: Colors.text.primary },
            }} />
          </Stack>
          <Toast config={toastConfig} />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
