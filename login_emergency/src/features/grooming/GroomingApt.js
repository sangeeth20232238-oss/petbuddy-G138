import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { db, auth } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
const REASONS = ['Bathing', 'Hair Trimming', 'Ear Cleaning', 'Nail Trimming', 'Teeth Brushing', 'Flea Treatment'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SERVICES = [
  { name: 'Bathing', price: 'LKR 2,500' },
  { name: 'Hair Trimming', price: 'LKR 1,800' },
  { name: 'Nail Trimming', price: 'LKR 800' },
  { name: 'Ear Cleaning', price: 'LKR 600' },
  { name: 'Teeth Brushing', price: 'LKR 1,000' },
  { name: 'Flea Treatment', price: 'LKR 3,200' },
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

const GroomingApt = ({ navigation, route }) => {
  const { location } = route.params || {};
  const salon = {
    name: location?.name || 'The Groom Room',
    address: location?.address || 'No. 12, Flower Road, Colombo 07, Sri Lanka',
    landmark: location?.landmark || 'Near Colombo City Centre Mall, Colombo 07',
    phone: location?.phone || '+94 11 234 5678',
    hours: location?.hours || 'Mon-Fri: 10 am – 6 pm, Sat: 9 am – 1 pm',
    image: location?.image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    services: SERVICES,
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedReason, setSelectedReason] = useState(['Bathing']);
  const [petType, setPetType] = useState('Dog');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petDob, setPetDob] = useState('');

  const toggleReason = useCallback((r) => {
    setSelectedReason(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  }, []);

  const handleConfirm = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please log in to book.');
      return;
    }

    if (!petName.trim() || !selectedTime) {
      Alert.alert('Missing Info', 'Please provide pet name and select a time.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'groomingBookings'), {
        userId: user.uid,
        ownerName: user.displayName || 'User',
        ownerPhone: ownerPhone || 'N/A',
        type: 'Grooming',
        salon: salon.name,
        petName,
        petType,
        date: `${selectedDate} ${MONTH_NAMES[month]} ${year}`,
        time: selectedTime,
        services: selectedReason,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Success', 
        'Appointment confirmed!',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
      );
    } catch (error) {
      console.error('Confirm Error:', error);
      Alert.alert('Error', 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  }, [petName, ownerPhone, selectedDate, month, year, selectedTime, selectedReason, petType, salon.name, navigation]);

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

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [firstDay, daysInMonth]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{step === 1 ? salon.name : 'Book Appointment'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {step === 1 ? (
          <>
            <Image source={{ uri: salon.image }} style={styles.salonImage} />

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCallModal(true)}>
                <Ionicons name="call" size={22} color="#FFFFFF" />
                <Text style={styles.actionLabel}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowLocationModal(true)}>
                <Ionicons name="location" size={22} color="#FFFFFF" />
                <Text style={styles.actionLabel}>Directions</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconBox}>
                  <Ionicons name="location-outline" size={18} color="#F48C06" />
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{salon.address}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIconBox}>
                  <Ionicons name="time-outline" size={18} color="#F48C06" />
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Hours</Text>
                  <Text style={styles.detailValue}>{salon.hours}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesCard}>
              {salon.services.map((s, i) => (
                <View key={i}>
                  <View style={styles.serviceRow}>
                    <View style={styles.serviceIconBox}>
                      <FontAwesome5 name="paw" size={13} color="#F48C06" />
                    </View>
                    <Text style={styles.serviceText}>{s.name}</Text>
                    <Text style={styles.servicePrice}>{s.price}</Text>
                  </View>
                  {i < salon.services.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.bookBtn} onPress={() => setStep(2)}>
              <Text style={styles.bookBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.calendarBox}>
              <View style={styles.calendarHeader}>
                <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
                <View style={styles.calendarNav}>
                  <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                    <Ionicons name="chevron-back" size={18} color="#F48C06" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                    <Ionicons name="chevron-forward" size={18} color="#F48C06" />
                  </TouchableOpacity>
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

            <Text style={styles.sectionTitle}>Pet Type</Text>
            <View style={styles.petTypeRow}>
              <TouchableOpacity
                style={[styles.petTypeBtn, petType === 'Dog' && styles.petTypeBtnSelected]}
                onPress={() => setPetType('Dog')}
              >
                <FontAwesome5 name="dog" size={20} color={petType === 'Dog' ? '#FFFFFF' : '#F48C06'} />
                <Text style={[styles.petTypeText, petType === 'Dog' && styles.petTypeTextSelected]}>Dog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.petTypeBtn, petType === 'Cat' && styles.petTypeBtnSelected]}
                onPress={() => setPetType('Cat')}
              >
                <FontAwesome5 name="cat" size={20} color={petType === 'Cat' ? '#FFFFFF' : '#F48C06'} />
                <Text style={[styles.petTypeText, petType === 'Cat' && styles.petTypeTextSelected]}>Cat</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Owner & Pet Details</Text>
            <View style={styles.petDetailsCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconBox}>
                  <Ionicons name="call-outline" size={16} color="#F48C06" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Owner's Phone Number"
                  placeholderTextColor="#AAAAAA"
                  value={ownerPhone}
                  onChangeText={setOwnerPhone}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.inputRow}>
                <View style={styles.inputIconBox}>
                  <FontAwesome5 name="paw" size={14} color="#F48C06" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Pet's Name"
                  placeholderTextColor="#AAAAAA"
                  value={petName}
                  onChangeText={setPetName}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.inputRow}>
                <View style={styles.inputIconBox}>
                  <Ionicons name="calendar-outline" size={16} color="#F48C06" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth (DD/MM/YYYY)"
                  placeholderTextColor="#AAAAAA"
                  value={petDob}
                  onChangeText={setPetDob}
                  keyboardType="numeric"
                />
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
                  <Ionicons name="time-outline" size={14} color={selectedTime === t ? '#FFFFFF' : '#888888'} style={{ marginRight: 5 }} />
                  <Text style={[styles.timeText, selectedTime === t && styles.selectedTimeText]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Reason for Visit</Text>
            {REASONS.map((r) => (
              <TouchableOpacity key={r} style={styles.reasonRow} onPress={() => toggleReason(r)}>
                <View style={styles.reasonLeft}>
                  <View style={styles.reasonIconBox}>
                    <MaterialIcons name="pets" size={16} color="#F48C06" />
                  </View>
                  <Text style={styles.reasonText}>{r}</Text>
                </View>
                <View style={[styles.checkbox, selectedReason.includes(r) && styles.checkboxSelected]}>
                  {selectedReason.includes(r) && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.bookBtn, loading && { opacity: 0.7 }]} 
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.bookBtnText}>Confirm Booking</Text>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Call Modal */}
      <Modal transparent visible={showCallModal} animationType="fade" onRequestClose={() => setShowCallModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCallModal(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconBox}>
              <Ionicons name="call" size={28} color="#F48C06" />
            </View>
            <Text style={styles.modalTitle}>{salon.name}</Text>
            <Text style={styles.modalPhone}>{salon.phone}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowCallModal(false)}>
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Modal */}
      <Modal transparent visible={showLocationModal} animationType="fade" onRequestClose={() => setShowLocationModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLocationModal(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconBox}>
              <Ionicons name="location" size={28} color="#F48C06" />
            </View>
            <Text style={styles.modalTitle}>Location</Text>
            <Text style={styles.modalAddress}>{salon.address}</Text>
            <Text style={styles.modalLandmark}>{salon.landmark}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowLocationModal(false)}>
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6EE' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#FFF6EE' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', color: '#222', marginLeft: 50 },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  salonImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F48C06', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, gap: 8 },
  actionLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 4 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, gap: 12 },
  detailIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  detailValue: { fontSize: 12, color: '#666666', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  servicesCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  serviceIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  serviceText: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  servicePrice: { fontSize: 13, fontFamily: 'Fredoka-Bold', color: '#E87A3A' },
  bookBtn: { flexDirection: 'row', backgroundColor: '#E87A3A', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Fredoka-Bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28, width: '78%', alignItems: 'center' },
  modalIconBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontFamily: 'Fredoka-Bold', color: '#222', marginBottom: 8, textAlign: 'center' },
  modalPhone: { fontSize: 20, fontFamily: 'Fredoka-Bold', color: '#E87A3A', marginBottom: 20 },
  modalAddress: { fontSize: 13, color: '#444444', textAlign: 'center', lineHeight: 20, marginBottom: 6, fontFamily: 'Fredoka-Regular' },
  modalLandmark: { fontSize: 12, color: '#888888', textAlign: 'center', marginBottom: 20, fontFamily: 'Fredoka-Regular' },
  modalBtn: { backgroundColor: '#E87A3A', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 36 },
  modalBtnText: { color: '#FFFFFF', fontFamily: 'Fredoka-SemiBold', fontSize: 14 },
  calendarBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthLabel: { fontSize: 15, fontFamily: 'Fredoka-Bold', color: '#222' },
  calendarNav: { flexDirection: 'row', gap: 4 },
  navBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 11, color: '#999999', fontFamily: 'Fredoka-Medium' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  selectedDay: { backgroundColor: '#E87A3A' },
  dayText: { fontSize: 13, color: '#222', fontFamily: 'Fredoka-Regular' },
  selectedDayText: { color: '#FFFFFF', fontFamily: 'Fredoka-Bold' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeSlot: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' },
  selectedTimeSlot: { backgroundColor: '#E87A3A', borderColor: '#E87A3A' },
  timeText: { fontSize: 13, color: '#555555', fontFamily: 'Fredoka-Medium' },
  selectedTimeText: { color: '#FFFFFF', fontFamily: 'Fredoka-SemiBold' },
  reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  reasonLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reasonIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  reasonText: { fontSize: 14, color: '#222', fontFamily: 'Fredoka-Medium' },
  petTypeRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  petTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#E87A3A', backgroundColor: '#FFFFFF' },
  petTypeBtnSelected: { backgroundColor: '#E87A3A' },
  petTypeText: { fontSize: 15, fontFamily: 'Fredoka-Bold', color: '#E87A3A' },
  petTypeTextSelected: { color: '#FFFFFF' },
  petDetailsCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  inputIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, color: '#222', fontFamily: 'Fredoka-Regular' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#E87A3A', borderColor: '#E87A3A' },
});

export default GroomingApt;
