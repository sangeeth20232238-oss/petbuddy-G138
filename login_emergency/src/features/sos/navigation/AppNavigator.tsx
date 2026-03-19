import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AllAlertsScreen from '../screens/AllAlertsScreen/AllAlertsScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen/AlertDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen/CreatePostScreen';
import ShareNotifyScreen from '../screens/ShareNotifyScreen/ShareNotifyScreen';

const Stack = createStackNavigator();

export default function SOSNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FFF5EC' } }}>
      <Stack.Screen name="SOSHome" component={HomeScreen} />
      <Stack.Screen name="AllAlerts" component={AllAlertsScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="ShareNotify" component={ShareNotifyScreen} />
    </Stack.Navigator>
  );
}
