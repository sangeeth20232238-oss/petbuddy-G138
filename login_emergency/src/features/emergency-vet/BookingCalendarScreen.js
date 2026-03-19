import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { auth } from '../../../firebaseConfig';
import { createBooking } from '../../services/emergencyVetService';

const { width } = Dimensions.get('window');

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function BookingCalendarScreen({ route, navigation }) {
    const { doctor, clinic } = route.params;
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Missing Info', 'Please select a date and time slot.');
            return;
        }
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Not logged in', 'Please log in to book.');
            return;
        }
        setLoading(true);
        try {
            await createBooking({
                userId: user.uid,
                clinicId: clinic.id,
                clinicName: clinic.name,
                doctorId: doctor.id,
                doctorName: doctor.name,
                date: selectedDate,
                timeSlot: selectedTime,
            });
            Alert.alert(
                'Booking Sent!',
                `Your appointment with ${doctor.name} on ${selectedDate} at ${selectedTime} is pending clinic confirmation.`,
                [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
            );
        } catch (e) {
            Alert.alert('Error', 'Could not save booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={day => setSelectedDate(day.dateString)}
                    markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#FF741C' } } : {}}
                    theme={{ todayTextColor: '#FF741C', arrowColor: '#FF741C' }}
                />
            </View>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeGrid}>
                {TIME_SLOTS.map(slot => (
                    <TouchableOpacity
                        key={slot}
                        style={[styles.timeChip, selectedTime === slot && styles.timeChipActive]}
                        onPress={() => setSelectedTime(slot)}
                    >
                        <Text style={[styles.timeChipText, selectedTime === slot && styles.timeChipTextActive]}>{slot}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={handleBook} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.bookText}>Book Now</Text>
                }
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
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10 },
    timeChip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#F0F0F0' },
    timeChipActive: { backgroundColor: '#FF741C' },
    timeChipText: { fontFamily: 'Fredoka-SemiBold', color: '#555' },
    timeChipTextActive: { color: 'white' },
    bookBtn: { backgroundColor: '#FF741C', margin: 25, padding: 20, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 20, width: width - 50 },
    bookText: { color: 'white', fontSize: 22, fontFamily: 'Fredoka-Bold' }
});