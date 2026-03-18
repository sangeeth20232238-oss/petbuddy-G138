import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroomingMain from './src/screens/GroomingMain';
import GroomingLocation from './src/screens/GroomingLocation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Grooming" component={GroomingMain} />
          <Stack.Screen name="GroomingLocation" component={GroomingLocation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
