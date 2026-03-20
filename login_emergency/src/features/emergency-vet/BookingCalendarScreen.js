import React, { useState, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity,
    Dimensions, Alert, ActivityIndicator, ScrollView, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { auth } from '../../../firebaseConfig';
import { createBooking } from '../../services/emergencyVetService';

const { width } = Dimensions.get('window');

const TIME_GROUPS = [
    {
        label: 'Morning',
        icon: 'sunny-outline',
        color: '#FFB300',
        slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
    },
    {
        label: 'Afternoon',
        icon: 'partly-sunny-outline',
        color: '#FF741C',
        slots: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'],
    },
    {
        label: 'Evening',
        icon: 'moon-outline',
        color: '#5C6BC0',
        slots: ['4:00 PM', '5:00 PM', '6:00 PM'],
    },
];

function formatDisplayDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function BookingCalendarScreen({ route, navigation }) {
    const { doctor, clinic } = route.params;
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedTime('');
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    };

    const handleTimeSelect = (slot) => {
        setSelectedTime(slot);
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Missing Info', 'Please select both a date and a time.');
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
                '🐾 Appointment Booked!',
                `${doctor.name}\n${formatDisplayDate(selectedDate)} at ${selectedTime}\n\nThe clinic will confirm shortly.`,
                [{ text: 'Done', onPress: () => navigation.navigate('Dashboard') }]
            );
        } catch (e) {
            Alert.alert('Error', 'Could not save booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={26} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Book Appointment</Text>
                    <Text style={styles.headerSub}>{doctor.name} · {clinic.name}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

                {/* Calendar */}
                <View style={styles.calendarCard}>
                    <Calendar
                        onDayPress={handleDayPress}
                        minDate={today}
                        markedDates={selectedDate ? {
                            [selectedDate]: { selected: true, selectedColor: '#FF741C', selectedTextColor: 'white' }
                        } : {}}
                        theme={{
                            todayTextColor: '#FF741C',
                            arrowColor: '#FF741C',
                            selectedDayBackgroundColor: '#FF741C',
                            textDayFontFamily: 'Fredoka-Regular',
                            textMonthFontFamily: 'Fredoka-Bold',
                            textDayHeaderFontFamily: 'Fredoka-SemiBold',
                            textDayFontSize: 15,
                            textMonthFontSize: 17,
                            calendarBackground: 'transparent',
                            dayTextColor: '#333',
                            textDisabledColor: '#DDD',
                        }}
                    />
                </View>

                {/* Selected date pill */}
                {selectedDate ? (
                    <Animated.View style={[styles.datePill, { opacity: fadeAnim }]}>
                        <Ionicons name="calendar" size={16} color="#FF741C" />
                        <Text style={styles.datePillText}>{formatDisplayDate(selectedDate)}</Text>
                    </Animated.View>
                ) : (
                    <View style={styles.dateHint}>
                        <Ionicons name="finger-print-outline" size={18} color="#CCC" />
                        <Text style={styles.dateHintText}>Tap a date to pick your time</Text>
                    </View>
                )}

                {/* Time Groups — only show after date selected */}
                {selectedDate && TIME_GROUPS.map((group) => (
                    <View key={group.label} style={styles.groupBlock}>
                        <View style={styles.groupHeader}>
                            <Ionicons name={group.icon} size={18} color={group.color} />
                            <Text style={[styles.groupLabel, { color: group.color }]}>{group.label}</Text>
                        </View>
                        <View style={styles.slotsRow}>
                            {group.slots.map((slot) => {
                                const active = selectedTime === slot;
                                return (
                                    <TouchableOpacity
                                        key={slot}
                                        style={[
                                            styles.slotCard,
                                            active && { backgroundColor: group.color, borderColor: group.color }
                                        ]}
                                        onPress={() => handleTimeSelect(slot)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.slotTime, active && styles.slotTimeActive]}>
                                            {slot}
                                        </Text>
                                        {active && (
                                            <Ionicons name="checkmark-circle" size={14} color="white" style={{ marginTop: 3 }} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Confirmation Bar */}
            <View style={styles.bottomBar}>
                {selectedDate && selectedTime ? (
                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryLabel}>Your Appointment</Text>
                            <Text style={styles.summaryValue}>{formatDisplayDate(selectedDate)}</Text>
                            <Text style={styles.summaryTime}>{selectedTime}</Text>
                        </View>
                        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} disabled={loading}>
                            {loading
                                ? <ActivityIndicator color="white" />
                                : <Text style={styles.bookText}>Confirm</Text>
                            }
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.bookBtnDisabled}>
                        <Text style={styles.bookTextDisabled}>
                            {!selectedDate ? 'Pick a date first' : 'Now pick a time'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingHorizontal: 20, paddingBottom: 10, gap: 14 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontFamily: 'Fredoka-Bold', color: '#333' },
    headerSub: { fontSize: 13, fontFamily: 'Fredoka-Regular', color: '#AAA', marginTop: 2 },
    calendarCard: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 24, padding: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    datePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFF5EF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginTop: 16, gap: 6, borderWidth: 1, borderColor: '#FF741C' },
    datePillText: { fontFamily: 'Fredoka-SemiBold', color: '#FF741C', fontSize: 14 },
    dateHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 6 },
    dateHintText: { color: '#CCC', fontFamily: 'Fredoka-Regular', fontSize: 14 },
    groupBlock: { marginTop: 22, paddingHorizontal: 20 },
    groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    groupLabel: { fontFamily: 'Fredoka-Bold', fontSize: 16 },
    slotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    slotCard: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, backgroundColor: 'white', borderWidth: 1.5, borderColor: '#EEE', alignItems: 'center', elevation: 1, minWidth: 90 },
    slotTime: { fontFamily: 'Fredoka-SemiBold', color: '#444', fontSize: 14 },
    slotTimeActive: { color: 'white' },
    bottomBar: { position: 'absolute', bottom: 0, width, backgroundColor: 'white', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
    summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    summaryLabel: { fontFamily: 'Fredoka-Regular', color: '#AAA', fontSize: 12 },
    summaryValue: { fontFamily: 'Fredoka-Bold', color: '#333', fontSize: 15 },
    summaryTime: { fontFamily: 'Fredoka-SemiBold', color: '#FF741C', fontSize: 14, marginTop: 2 },
    bookBtn: { backgroundColor: '#FF741C', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16 },
    bookText: { color: 'white', fontSize: 16, fontFamily: 'Fredoka-Bold' },
    bookBtnDisabled: { backgroundColor: '#F5F5F5', padding: 16, borderRadius: 16, alignItems: 'center' },
    bookTextDisabled: { color: '#BBB', fontFamily: 'Fredoka-SemiBold', fontSize: 15 },
});
