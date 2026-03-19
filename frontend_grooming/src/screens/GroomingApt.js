import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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

const GroomingApt = ({ onBack, onConfirm, location }) => {
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
  const [showCallModal, setShowCallModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedReason, setSelectedReason] = useState(['Bathing']);
  const [petType, setPetType] = useState(null);
  const [petName, setPetName] = useState('');
  const [petDob, setPetDob] = useState({ day: null, month: null, year: null });
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobTemp, setDobTemp] = useState({ day: null, month: null, year: null });

  const DOB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const dobYears = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const dobDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const dobFormatted = petDob.day ? `${String(petDob.day).padStart(2,'0')} ${DOB_MONTHS[petDob.month - 1]} ${petDob.year}` : null;

  const toggleReason = (r) => {
    setSelectedReason(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={20} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{salon.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
                <Ionicons name="location-outline" size={18} color="#FF741C" />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{salon.address}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailIconBox}>
                <Ionicons name="time-outline" size={18} color="#FF741C" />
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
                    <FontAwesome5 name="paw" size={13} color="#FF741C" />
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
        </ScrollView>

        {/* Call Modal */}
        <Modal transparent visible={showCallModal} animationType="fade" onRequestClose={() => setShowCallModal(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCallModal(false)}>
            <View style={styles.modalBox}>
              <View style={styles.modalIconBox}>
                <Ionicons name="call" size={28} color="#FF741C" />
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
                <Ionicons name="location" size={28} color="#FF741C" />
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Ionicons name="chevron-back" size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.calendarBox}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={18} color="#FF741C" />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Ionicons name="chevron-forward" size={18} color="#FF741C" />
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
            <FontAwesome5 name="dog" size={20} color={petType === 'Dog' ? '#FFFFFF' : '#FF741C'} />
            <Text style={[styles.petTypeText, petType === 'Dog' && styles.petTypeTextSelected]}>Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.petTypeBtn, petType === 'Cat' && styles.petTypeBtnSelected]}
            onPress={() => setPetType('Cat')}
          >
            <FontAwesome5 name="cat" size={20} color={petType === 'Cat' ? '#FFFFFF' : '#FF741C'} />
            <Text style={[styles.petTypeText, petType === 'Cat' && styles.petTypeTextSelected]}>Cat</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Pet Details</Text>
        <View style={styles.petDetailsCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <FontAwesome5 name="paw" size={14} color="#FF741C" />
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
          <TouchableOpacity style={styles.inputRow} onPress={() => { setDobTemp(petDob); setShowDobPicker(true); }}>
            <View style={styles.inputIconBox}>
              <Ionicons name="calendar-outline" size={16} color="#FF741C" />
            </View>
            <Text style={[styles.input, !dobFormatted && { color: '#AAAAAA' }]}>
              {dobFormatted || "Date of Birth"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
          </TouchableOpacity>
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
                <MaterialIcons name="pets" size={16} color="#FF741C" />
              </View>
              <Text style={styles.reasonText}>{r}</Text>
            </View>
            <View style={[styles.checkbox, selectedReason.includes(r) && styles.checkboxSelected]}>
              {selectedReason.includes(r) && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.bookBtn} onPress={() => onConfirm({ salon: salon.name, date: `${selectedDate} ${MONTH_NAMES[month]} ${year}`, time: selectedTime, services: selectedReason, petType, petName, petDob: dobFormatted })}>
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* DOB Picker Modal */}
      <Modal transparent visible={showDobPicker} animationType="slide" onRequestClose={() => setShowDobPicker(false)}>
        <View style={styles.dobOverlay}>
          <View style={styles.dobSheet}>
            <Text style={styles.dobSheetTitle}>Select Date of Birth</Text>

            <View style={styles.dobPickerRow}>
              {/* Day */}
              <View style={styles.dobCol}>
                <Text style={styles.dobColLabel}>Day</Text>
                <ScrollView style={styles.dobScroll} showsVerticalScrollIndicator={false}>
                  {dobDays.map(d => (
                    <TouchableOpacity key={d} style={[styles.dobItem, dobTemp.day === d && styles.dobItemSelected]} onPress={() => setDobTemp(p => ({ ...p, day: d }))}>
                      <Text style={[styles.dobItemText, dobTemp.day === d && styles.dobItemTextSelected]}>{String(d).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              {/* Month */}
              <View style={styles.dobCol}>
                <Text style={styles.dobColLabel}>Month</Text>
                <ScrollView style={styles.dobScroll} showsVerticalScrollIndicator={false}>
                  {DOB_MONTHS.map((m, i) => (
                    <TouchableOpacity key={m} style={[styles.dobItem, dobTemp.month === i + 1 && styles.dobItemSelected]} onPress={() => setDobTemp(p => ({ ...p, month: i + 1 }))}>
                      <Text style={[styles.dobItemText, dobTemp.month === i + 1 && styles.dobItemTextSelected]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              {/* Year */}
              <View style={styles.dobCol}>
                <Text style={styles.dobColLabel}>Year</Text>
                <ScrollView style={styles.dobScroll} showsVerticalScrollIndicator={false}>
                  {dobYears.map(y => (
                    <TouchableOpacity key={y} style={[styles.dobItem, dobTemp.year === y && styles.dobItemSelected]} onPress={() => setDobTemp(p => ({ ...p, year: y }))}>
                      <Text style={[styles.dobItemText, dobTemp.year === y && styles.dobItemTextSelected]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.dobBtnRow}>
              <TouchableOpacity style={styles.dobCancelBtn} onPress={() => setShowDobPicker(false)}>
                <Text style={styles.dobCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dobConfirmBtn} onPress={() => { setPetDob(dobTemp); setShowDobPicker(false); }}>
                <Text style={styles.dobConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  salonImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF741C', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, gap: 8 },
  actionLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 12, marginTop: 4 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, gap: 12 },
  detailIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 13, fontWeight: '600', color: '#000000', marginBottom: 2 },
  detailValue: { fontSize: 12, color: '#444444', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#EEEEEE' },
  servicesCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  serviceIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  serviceText: { flex: 1, fontSize: 14, color: '#000000' },
  servicePrice: { fontSize: 13, fontWeight: '600', color: '#FF741C' },
  bookBtn: { flexDirection: 'row', backgroundColor: '#FF741C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28, width: '78%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 10 },
  modalIconBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 8, textAlign: 'center' },
  modalPhone: { fontSize: 20, fontWeight: 'bold', color: '#FF741C', marginBottom: 20 },
  modalAddress: { fontSize: 13, color: '#444444', textAlign: 'center', lineHeight: 20, marginBottom: 6 },
  modalLandmark: { fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20 },
  modalBtn: { backgroundColor: '#FF741C', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 36 },
  modalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  calendarBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthLabel: { fontSize: 15, fontWeight: '600', color: '#000000' },
  calendarNav: { flexDirection: 'row', gap: 4 },
  navBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 11, color: '#666666', fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  selectedDay: { backgroundColor: '#FF741C' },
  dayText: { fontSize: 13, color: '#000000' },
  selectedDayText: { color: '#FFFFFF', fontWeight: 'bold' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeSlot: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' },
  selectedTimeSlot: { backgroundColor: '#FF741C', borderColor: '#FF741C' },
  timeText: { fontSize: 13, color: '#555555' },
  selectedTimeText: { color: '#FFFFFF', fontWeight: '600' },
  reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  reasonLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reasonIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  reasonText: { fontSize: 14, color: '#000000' },
  petTypeRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  petTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#FF741C', backgroundColor: '#FFFFFF' },
  petTypeBtnSelected: { backgroundColor: '#FF741C' },
  petTypeText: { fontSize: 15, fontWeight: '600', color: '#FF741C' },
  petTypeTextSelected: { color: '#FFFFFF' },
  petDetailsCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  inputIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, color: '#000000' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#FF741C', borderColor: '#FF741C' },
  dobOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  dobSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  dobSheetTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', textAlign: 'center', marginBottom: 20 },
  dobPickerRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  dobCol: { flex: 1 },
  dobColLabel: { fontSize: 12, fontWeight: '600', color: '#666666', textAlign: 'center', marginBottom: 8 },
  dobScroll: { height: 180, backgroundColor: '#F9F9F9', borderRadius: 12 },
  dobItem: { paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  dobItemSelected: { backgroundColor: '#FF741C' },
  dobItemText: { fontSize: 14, color: '#000000' },
  dobItemTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },
  dobBtnRow: { flexDirection: 'row', gap: 12 },
  dobCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#FF741C', alignItems: 'center' },
  dobCancelText: { color: '#FF741C', fontWeight: '600', fontSize: 14 },
  dobConfirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#FF741C', alignItems: 'center' },
  dobConfirmText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});

export default GroomingApt;
