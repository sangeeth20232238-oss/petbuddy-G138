import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetBuddyConfigScreen({ route, navigation }) {
    const { buddy } = route.params;
    const [tasks, setTasks] = useState({ lift: false, drive: true, wait: false });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.title}>Task Details</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.subTitle}>Specify help needed from {buddy.name}</Text>
                
                {[
                    { id: 'lift', label: 'Help lifting pet into vehicle', icon: 'weight-lifter' },
                    { id: 'drive', label: 'Transport to Clinic', icon: 'car' },
                    { id: 'wait', label: 'Stay during appointment', icon: 'clock-outline' }
                ].map((item) => (
                    <TouchableOpacity 
                        key={item.id}
                        style={[styles.item, tasks[item.id] && styles.itemActive]}
                        onPress={() => setTasks({...tasks, [item.id]: !tasks[item.id]})}
                    >
                        <MaterialCommunityIcons name={item.icon} size={24} color={tasks[item.id] ? 'white' : '#FF741C'} />
                        <Text style={[styles.itemLabel, tasks[item.id] && styles.itemLabelActive]}>{item.label}</Text>
                        <Ionicons name={tasks[item.id] ? "checkbox" : "square-outline"} size={24} color={tasks[item.id] ? 'white' : '#CCC'} />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity 
                    style={styles.confirmBtn} 
                    onPress={() => navigation.navigate('PetBuddyTracking')}
                >
                    <Text style={styles.confirmText}>Send Request</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontFamily: 'Fredoka-Bold', marginLeft: 40 },
    subTitle: { fontSize: 16, fontFamily: 'Fredoka-SemiBold', color: '#666', marginBottom: 25 },
    item: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 15, backgroundColor: '#F9F9F9', marginBottom: 12 },
    itemActive: { backgroundColor: '#FF741C' },
    itemLabel: { flex: 1, marginLeft: 15, fontFamily: 'Fredoka-Medium' },
    itemLabelActive: { color: 'white' },
    confirmBtn: { backgroundColor: '#FF741C', padding: 20, borderRadius: 15, marginTop: 30, alignItems: 'center' },
    confirmText: { color: 'white', fontSize: 18, fontFamily: 'Fredoka-Bold' }
});