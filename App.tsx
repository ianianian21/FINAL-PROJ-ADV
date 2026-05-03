/**
 * App.tsx
 * Main entry point for the Taskly application
 * 
 * Architecture:
 * 1. AuthProvider wraps the app with authentication context
 * 2. RootNavigator handles conditional navigation based on auth state
 * 3. Firebase is initialized in firebase/config.ts
 * 4. All screens have access to user state and auth methods via useAppContext hook
 */

import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ← Add this
import { AuthProvider } from './app/context/AuthContext';
import RootNavigator from './app/navigation/RootNavigator';
import { View, ActivityIndicator } from 'react-native';

// Keep the splash screen visible while loading
SplashScreen.preventAutoHideAsync();

/**
 * App Component
 * 
 * This component:
 * 1. Loads Google Fonts (Inter, Poppins) from expo-google-fonts
 * 2. Wraps the app with AuthProvider for authentication context
 * 3. Renders RootNavigator which handles conditional routing
 */
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
    </SafeAreaProvider>
  );
}
