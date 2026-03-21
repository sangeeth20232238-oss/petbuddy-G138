import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PetBuddyTrackingScreen({ navigation }) {
    const steps = [
        { label: 'Buddy Arrived', icon: 'home-check', done: true },
        { label: 'En Route to Vet', icon: 'car-connected', done: true },
        { label: 'At Clinic', icon: 'hospital-building', done: false },
        { label: 'Returning Home', icon: 'home-export-outline', done: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Live Tracking</Text>
            </View>

            <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.mapMock}>
                <MaterialCommunityIcons name="car-hatchback" size={40} color="#FF741C" />
                <Text style={styles.mapLabel}>Buddy is 5 mins from Clinic</Text>
            </LinearGradient>

            <View style={styles.buddyInfo}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=janel' }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.buddyName}>Janel</Text>
                    <Text style={styles.buddyStatus}>With your pet</Text>
                </View>
                <TouchableOpacity style={styles.callBtn}><Ionicons name="call" size={24} color="white" /></TouchableOpacity>
            </View>

            <View style={styles.timeline}>
                {steps.map((s, i) => (
                    <View key={i} style={styles.step}>
                        <View style={[styles.dot, s.done && styles.activeDot]} />
                        <MaterialCommunityIcons name={s.icon} size={24} color={s.done ? '#FF741C' : '#CCC'} style={{ marginHorizontal: 15 }} />
                        <Text style={[styles.stepText, s.done && styles.activeText]}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingHorizontal: 20, paddingBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', color: '#222', marginLeft: 50 },
    mapMock: { height: 200, margin: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    mapLabel: { marginTop: 10, fontFamily: 'Fredoka-SemiBold', color: '#1976D2' },
    buddyInfo: { flexDirection: 'row', marginHorizontal: 20, padding: 15, backgroundColor: '#FDF2EB', borderRadius: 15, alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    buddyName: { fontFamily: 'Fredoka-Bold', fontSize: 16 },
    buddyStatus: { fontFamily: 'Fredoka-Regular', color: '#FF741C', fontSize: 12 },
    callBtn: { backgroundColor: '#FF741C', padding: 10, borderRadius: 25 },
    timeline: { padding: 30 },
    step: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EEE' },
    activeDot: { backgroundColor: '#FF741C' },
    stepText: { color: '#999', fontFamily: 'Fredoka-Medium' },
    activeText: { color: '#000', fontFamily: 'Fredoka-Bold' }
});