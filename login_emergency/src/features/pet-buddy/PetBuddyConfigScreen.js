import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetBuddyConfigScreen({ route, navigation }) {
    const { buddy, fullCare } = route.params;
    const [tasks, setTasks] = useState({ lift: false, drive: true, wait: false });

    const handleCall = () => {
        const phone = buddy.phone;
        if (!phone) {
            Alert.alert("No number", "This buddy has no phone number on file.");
            return;
        }
        Linking.openURL(`tel:${phone}`).catch(() =>
            Alert.alert("Error", "Unable to make a call from this device.")
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} />
                </TouchableOpacity>
                <Text style={styles.title}>Confirm Your Buddy</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

                {/* Buddy Info Card */}
                <View style={styles.buddyCard}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarLetter}>{buddy.name?.[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={styles.buddyInfo}>
                        <Text style={styles.buddyName}>{buddy.name}</Text>
                        <Text style={styles.buddyRole}>{buddy.role || 'Verified Volunteer'}</Text>
                        {buddy.breeds ? <Text style={styles.buddyBreeds}>🐾 {buddy.breeds}</Text> : null}
                    </View>
                </View>

                {/* Tappable Phone Number */}
                <TouchableOpacity style={styles.phoneRow} onPress={handleCall}>
                    <View style={styles.phoneIcon}>
                        <Ionicons name="call" size={20} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.phoneLabel}>Phone Number</Text>
                        <Text style={styles.phoneNumber}>{buddy.phone || 'Not available'}</Text>
                    </View>
                    <Text style={styles.callNow}>Tap to Call</Text>
                </TouchableOpacity>

                {/* Care Type Badge */}
                {fullCare && (
                    <View style={styles.careBadge}>
                        <MaterialCommunityIcons name="shield-star-outline" size={20} color="#FF741C" />
                        <Text style={styles.careBadgeText}>🐾 PawGuard Complete Care Selected</Text>
                    </View>
                )}

                <Text style={styles.subTitle}>Specify help needed from {buddy.name}</Text>

                {[
                    { id: 'lift', label: 'Help lifting pet into vehicle', icon: 'weight-lifter' },
                    { id: 'drive', label: 'Transport to Clinic', icon: 'car' },
                    { id: 'wait', label: 'Stay during appointment', icon: 'clock-outline' },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.item, tasks[item.id] && styles.itemActive]}
                        onPress={() => setTasks({ ...tasks, [item.id]: !tasks[item.id] })}
                    >
                        <MaterialCommunityIcons name={item.icon} size={24} color={tasks[item.id] ? 'white' : '#FF741C'} />
                        <Text style={[styles.itemLabel, tasks[item.id] && styles.itemLabelActive]}>{item.label}</Text>
                        <Ionicons name={tasks[item.id] ? "checkbox" : "square-outline"} size={24} color={tasks[item.id] ? 'white' : '#CCC'} />
                    </TouchableOpacity>
                ))}

                {/* All Set Card */}
                <View style={styles.allSetCard}>
                    <Text style={styles.allSetEmoji}>🐾</Text>
                    <Text style={styles.allSetTitle}>You're all set!</Text>
                    <Text style={styles.allSetDesc}>
                        {buddy.name} is ready to help. Give them a call and coordinate directly.
                    </Text>
                    <TouchableOpacity style={styles.callBigBtn} onPress={handleCall}>
                        <Ionicons name="call" size={22} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.callBigText}>Call {buddy.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.doneBtn}>
                        <Text style={styles.doneText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontFamily: 'Fredoka-Bold', marginLeft: 20 },
    buddyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EF', borderRadius: 20, padding: 18, marginBottom: 16 },
    avatarCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FF741C', alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { color: 'white', fontSize: 24, fontFamily: 'Fredoka-Bold' },
    buddyInfo: { marginLeft: 15, flex: 1 },
    buddyName: { fontSize: 20, fontFamily: 'Fredoka-Bold', color: '#333' },
    buddyRole: { color: '#888', fontFamily: 'Fredoka-Regular', fontSize: 13 },
    buddyBreeds: { color: '#FF741C', fontFamily: 'Fredoka-Regular', fontSize: 12, marginTop: 3 },
    phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FFF4', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: '#4CAF50' },
    phoneIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    phoneLabel: { fontSize: 11, color: '#888', fontFamily: 'Fredoka-Regular' },
    phoneNumber: { fontSize: 17, fontFamily: 'Fredoka-Bold', color: '#2E7D32' },
    callNow: { color: '#4CAF50', fontFamily: 'Fredoka-Bold', fontSize: 13 },
    careBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EF', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FF741C' },
    careBadgeText: { marginLeft: 8, fontFamily: 'Fredoka-SemiBold', color: '#FF741C' },
    subTitle: { fontSize: 15, fontFamily: 'Fredoka-SemiBold', color: '#666', marginBottom: 15 },
    item: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 15, backgroundColor: '#F9F9F9', marginBottom: 12 },
    itemActive: { backgroundColor: '#FF741C' },
    itemLabel: { flex: 1, marginLeft: 15, fontFamily: 'Fredoka-Regular', fontSize: 15 },
    itemLabelActive: { color: 'white' },
    allSetCard: { backgroundColor: '#FFF5EF', borderRadius: 24, padding: 24, marginTop: 20, alignItems: 'center', borderWidth: 1.5, borderColor: '#FF741C' },
    allSetEmoji: { fontSize: 48, marginBottom: 8 },
    allSetTitle: { fontSize: 26, fontFamily: 'Fredoka-Bold', color: '#FF741C' },
    allSetDesc: { textAlign: 'center', color: '#666', fontFamily: 'Fredoka-Regular', marginTop: 8, marginBottom: 20, lineHeight: 20 },
    callBigBtn: { flexDirection: 'row', backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, alignItems: 'center', width: '100%', justifyContent: 'center' },
    callBigText: { color: 'white', fontSize: 18, fontFamily: 'Fredoka-Bold' },
    doneBtn: { marginTop: 16 },
    doneText: { color: '#AAA', fontFamily: 'Fredoka-SemiBold', textDecorationLine: 'underline' },
});
