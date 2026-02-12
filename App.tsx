import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <NavigationContainer>
                <BottomTabNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
