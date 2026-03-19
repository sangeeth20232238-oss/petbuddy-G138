import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import PetDetailScreen from './src/screens/PetDetailScreen';
import AdoptionFormScreen from './src/screens/AdoptionFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="PetDetails" component={PetDetailScreen} />
        <Stack.Screen name="AdoptionForm" component={AdoptionFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
