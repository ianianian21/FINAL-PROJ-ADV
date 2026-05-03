/**
 * AppNavigator
 * Bottom tab navigator with stack navigators for each tab
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppStackParamList, MainTabParamList } from '../types';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import TasksScreen from '../screens/main/TasksScreen';
import GoalsScreen from '../screens/main/GoalsScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import TaskDetailScreen from '../screens/main/TaskDetailScreen';
import GoalDetailScreen from '../screens/main/GoalDetailScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabNavigator
 * Bottom tab navigator with 5 tabs: Dashboard, Tasks, Goals, Progress, Profile
 */
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: LIGHT_THEME.accentTeal,
        tabBarInactiveTintColor: LIGHT_THEME.textSecondary,
        tabBarStyle: {
          backgroundColor: LIGHT_THEME.background,
          borderTopColor: LIGHT_THEME.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          ...TEXT_STYLES.caption,
          marginTop: -6,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="target" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * AppNavigator
 * Stack navigator wrapping the tab navigator and detail screens
 */
const AppNavigator: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <AppStack.Screen
        name="MainNavigator"
        component={MainTabNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <AppStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
