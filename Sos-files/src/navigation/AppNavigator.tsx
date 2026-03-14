// App Navigator - Stack navigation for all screens (React Navigation v7)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createStaticNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AllAlertsScreen from '../screens/AllAlertsScreen/AllAlertsScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen/AlertDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen/CreatePostScreen';
import ShareNotifyScreen from '../screens/ShareNotifyScreen/ShareNotifyScreen';

const RootStack = createStackNavigator({
  screenOptions: {
    headerShown: false,
    cardStyle: { backgroundColor: '#FFF5EC' },
    gestureEnabled: true,
  },
  screens: {
    Home: {
      screen: HomeScreen,
    },
    AllAlerts: {
      screen: AllAlertsScreen,
    },
    AlertDetail: {
      screen: AlertDetailScreen,
    },
    CreatePost: {
      screen: CreatePostScreen,
    },
    ShareNotify: {
      screen: ShareNotifyScreen,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

export default Navigation;
