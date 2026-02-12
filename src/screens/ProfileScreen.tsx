import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Your profile information will appear here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
    },
});
