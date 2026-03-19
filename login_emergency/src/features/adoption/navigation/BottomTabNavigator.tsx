import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import AdoptionFormScreen from '../screens/AdoptionFormScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function BottomTabNavigator() {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PetDetails" component={PetDetailScreen} />
                <Stack.Screen name="AdoptionForm" component={AdoptionFormScreen} />
            </Stack.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({});
