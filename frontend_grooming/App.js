import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GroomingMain from './src/screens/GroomingMain';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <GroomingMain />
    </SafeAreaProvider>
  );
}
