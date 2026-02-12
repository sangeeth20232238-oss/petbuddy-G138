import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { BottomTabParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const HomeIcon = ({ focused }: { focused: boolean }) => (
    <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null]}>
        <View style={styles.homeIcon}>
            <View style={styles.homeIconRoof} />
            <View style={styles.homeIconBase} />
        </View>
    </View>
);

const MessagesIcon = ({ focused }: { focused: boolean }) => (
    <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null]}>
        <View style={styles.messagesIcon}>
            <View style={styles.messagesBubble} />
            <View style={styles.messagesLines} />
        </View>
    </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
    <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null]}>
        <View style={styles.profileIcon}>
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
        </View>
    </View>
);

const CustomTabButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={styles.tabButton}
        onPress={onPress}
        activeOpacity={0.7}
    >
        {children}
    </TouchableOpacity>
);

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }: { focused: boolean }) => <HomeIcon focused={focused} />,
                    tabBarButton: (props: any) => <CustomTabButton {...props} />,
                }}
            />
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    tabBarIcon: ({ focused }: { focused: boolean }) => <MessagesIcon focused={focused} />,
                    tabBarButton: (props: any) => (
                        <TouchableOpacity
                            {...props}
                            style={styles.centerButtonContainer}
                            activeOpacity={0.8}
                        >
                            <View style={styles.centerButton}>
                                <MessagesIcon focused={true} />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }: { focused: boolean }) => <ProfileIcon focused={focused} />,
                    tabBarButton: (props: any) => <CustomTabButton {...props} />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        paddingHorizontal: 20,
        borderTopWidth: 0,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerActive: {
        // Active state styling handled by icon color
    },
    centerButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,
    },
    centerButton: {
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
    },
    // Home Icon
    homeIcon: {
        width: 28,
        height: 28,
        position: 'relative',
    },
    homeIconRoof: {
        width: 0,
        height: 0,
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FF8C5A',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    homeIconBase: {
        width: 20,
        height: 16,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        borderColor: '#FF8C5A',
        borderTopWidth: 0,
        borderRadius: 2,
        position: 'absolute',
        bottom: 0,
        left: 4,
    },
    // Messages Icon
    messagesIcon: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesBubble: {
        width: 24,
        height: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    messagesLines: {
        width: 14,
        height: 8,
        backgroundColor: 'transparent',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        position: 'absolute',
    },
    // Profile Icon
    profileIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHead: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF8C5A',
        marginBottom: 2,
    },
    profileBody: {
        width: 18,
        height: 10,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF8C5A',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 0,
    },
});
