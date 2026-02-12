import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Your conversations will appear here</Text>
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
