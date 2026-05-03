/**
 * AuthNavigator
 * Stack navigator for authentication screens (login, register)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
      initialRouteName="Login"
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
