/**
 * RootNavigator
 * Top-level navigator that switches between auth and app based on user authentication state
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import LoadingOverlay from '../components/LoadingOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator
 * Conditionally renders:
 * - AuthNavigator if user is not authenticated
 * - AppNavigator if user is authenticated
 * - Loading overlay while auth state is being determined
 */
const RootNavigator: React.FC = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {user ? (
          // User is logged in - show app
          <Stack.Screen
            name="AppNavigator"
            component={AppNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          // User is not logged in - show auth
          <Stack.Screen
            name="AuthNavigator"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
