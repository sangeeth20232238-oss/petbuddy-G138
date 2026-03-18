import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView,
} from 'react-native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
const REASONS = ['Bathing', 'Hair Trimming', 'Ear Cleaning', 'Nail Trimming', 'Teeth Brushing', 'Flea Treatment'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

const GroomingApt = ({ onBack, onConfirm, location }) => {
  const salon = location || {
    name: 'The Groom Room',
    address: 'No. 12, Flower Road, Colombo 07, Sri Lanka',
    hours: 'Mon-Fri: 10 am – 6 pm, Sat: 9 am – 1 pm',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    services: ['Bathing', 'Hair Trimming', 'Nail Trimming', 'Ear Cleaning', 'Teeth Brushing', 'Flea Treatment'],
  };

  const [step, setStep] = useState(1);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedReason, setSelectedReason] = useState('Bathing');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{salon.name}</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Image source={{ uri: salon.image }} style={styles.salonImage} />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>📍</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <View>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{salon.address}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <View>
              <Text style={styles.detailLabel}>Hours</Text>
              <Text style={styles.detailValue}>{salon.hours}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Services</Text>

          {salon.services.map((s, i) => (
            <View key={i} style={styles.serviceRow}>
              <Text style={styles.serviceIcon}>🐾</Text>
              <Text style={styles.serviceText}>{s}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.bookBtn} onPress={() => setStep(2)}>
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.calendarBox}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={prevMonth}><Text style={styles.navArrow}>‹</Text></TouchableOpacity>
              <TouchableOpacity onPress={nextMonth}><Text style={styles.navArrow}>›</Text></TouchableOpacity>
            </View>
          </View>

          <View style={styles.dayLabels}>
            {DAYS.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
          </View>

          <View style={styles.calendarGrid}>
            {calendarCells.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, day === selectedDate && styles.selectedDay]}
                onPress={() => day && setSelectedDate(day)}
                disabled={!day}
              >
                <Text style={[styles.dayText, day === selectedDate && styles.selectedDayText]}>
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.timeSlot, selectedTime === t && styles.selectedTimeSlot]}
              onPress={() => setSelectedTime(t)}
            >
              <Text style={[styles.timeText, selectedTime === t && styles.selectedTimeText]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Reason for Visit</Text>
        {REASONS.map((r) => (
          <TouchableOpacity key={r} style={styles.reasonRow} onPress={() => setSelectedReason(r)}>
            <Text style={styles.reasonText}>{r}</Text>
            <View style={[styles.radio, selectedReason === r && styles.radioSelected]}>
              {selectedReason === r && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.bookBtn} onPress={onConfirm}>
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },
  backArrow: { fontSize: 22, color: '#1A1A1A' },
  backText: { fontSize: 14, color: '#F48C06', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  salonImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 24 },
  actionBtn: { backgroundColor: '#F48C06', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, alignItems: 'center' },
  actionIcon: { fontSize: 22 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  detailIcon: { fontSize: 18, marginTop: 2 },
  detailLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  detailValue: { fontSize: 12, color: '#666666', lineHeight: 18 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  serviceIcon: { fontSize: 16 },
  serviceText: { fontSize: 14, color: '#1A1A1A' },
  bookBtn: { backgroundColor: '#F48C06', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  calendarBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  calendarNav: { flexDirection: 'row', gap: 12 },
  navArrow: { fontSize: 22, color: '#F48C06', fontWeight: 'bold' },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 11, color: '#999999', fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  selectedDay: { backgroundColor: '#F48C06' },
  dayText: { fontSize: 13, color: '#1A1A1A' },
  selectedDayText: { color: '#FFFFFF', fontWeight: 'bold' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeSlot: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' },
  selectedTimeSlot: { backgroundColor: '#F48C06', borderColor: '#F48C06' },
  timeText: { fontSize: 13, color: '#555555' },
  selectedTimeText: { color: '#FFFFFF', fontWeight: '600' },
  reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  reasonText: { fontSize: 14, color: '#1A1A1A' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#F48C06' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F48C06' },
});

export default GroomingApt;
