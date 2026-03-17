import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars'; // Ensure you've run npm install react-native-calendars

const { width } = Dimensions.get('window');

export default function BookingCalendarScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.calendarContainer}>
                <Calendar theme={{ todayTextColor: '#FF741C', arrowColor: '#FF741C' }} />
            </View>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeContainer}>
                <Text style={styles.timeLabel}>9:00 AM</Text>
                <View style={styles.selectedTimeBox}>
                    <Text style={styles.timeText}>10:00 AM       To      11:00 AM</Text>
                </View>
                <Text style={styles.timeLabel}>11:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={() => alert("Booking Successful!")}>
                <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginLeft: 50 },
    sectionTitle: { fontSize: 20, fontFamily: 'Fredoka-Bold', marginLeft: 20, marginVertical: 15 },
    calendarContainer: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 20, padding: 10, elevation: 3 },
    timeContainer: { alignItems: 'center', marginTop: 10 },
    timeLabel: { color: '#AAA', marginVertical: 10 },
    selectedTimeBox: { backgroundColor: '#EBE6FF', width: width - 40, padding: 20, borderRadius: 15, alignItems: 'center' },
    timeText: { fontFamily: 'Fredoka-Bold', color: '#333' },
    bookBtn: { backgroundColor: '#FF741C', margin: 25, padding: 20, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 20, width: width - 50 },
    bookText: { color: 'white', fontSize: 22, fontFamily: 'Fredoka-Bold' }
});