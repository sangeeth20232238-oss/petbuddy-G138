import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ClinicDetailScreen({ route, navigation }) {
    const { clinic } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.subTitle}>{clinic.name}</Text>
            <Image source={{ uri: clinic.img }} style={styles.mainImg} />
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}><Ionicons name="call" size={28} color="white" /></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><Ionicons name="navigate" size={28} color="white" /></TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.infoRow}>
                    <View style={styles.iconBox}><Ionicons name="location-outline" size={24} color="#FF741C" /></View>
                    <View><Text style={styles.label}>Address</Text><Text style={styles.value}>123 Main Street, Anytown, USA</Text></View>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.iconBox}><Ionicons name="time-outline" size={24} color="#FF741C" /></View>
                    <View><Text style={styles.label}>Hours</Text><Text style={styles.value}>Mon-Fri: 8am-6pm, Sat: 9am-1pm</Text></View>
                </View>
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('DoctorList')}>
                <Text style={styles.bookText}>Book Appointment</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginLeft: 50 },
    subTitle: { textAlign: 'center', fontSize: 22, fontFamily: 'Fredoka-Regular', marginBottom: 20 },
    mainImg: { width: width - 40, height: 220, borderRadius: 25, alignSelf: 'center' },
    actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginVertical: 25 },
    actionBtn: { backgroundColor: '#FF741C', width: width * 0.4, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    detailsContainer: { padding: 25 },
    sectionTitle: { fontSize: 20, fontFamily: 'Fredoka-Bold', marginBottom: 15 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    iconBox: { width: 50, height: 50, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2 },
    label: { fontSize: 18, fontFamily: 'Fredoka-SemiBold' },
    value: { color: '#777' },
    bookBtn: { backgroundColor: '#FF741C', margin: 25, padding: 20, borderRadius: 15, alignItems: 'center' },
    bookText: { color: 'white', fontSize: 22, fontFamily: 'Fredoka-Bold' }
});