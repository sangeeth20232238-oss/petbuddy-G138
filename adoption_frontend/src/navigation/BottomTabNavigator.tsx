import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
            <View style={styles.bottomNav}>
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() =>
                            Alert.alert(
                                "PetBot AI",
                                "Ask PetBot AI questions about pet adoption and care. This feature is coming soon."
                            )
                        }
                    >
                        <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    fab: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF741C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF741C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 5,
        borderColor: '#FFFFFF',
    },
});
