import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const SERVICE_PRICES = {
  'Bathing': 2500,
  'Hair Trimming': 1800,
  'Nail Trimming': 800,
  'Ear Cleaning': 600,
  'Teeth Brushing': 1000,
  'Flea Treatment': 3200,
};

const GroomingCheckout = ({ onBack, onConfirm, bookingData }) => {
  const [petName, setPetName] = useState('');
  const [petDob, setPetDob] = useState('');
  const [gender, setGender] = useState(null);

  const services = bookingData?.services || [];
  const total = services.reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);

  const handleConfirm = () => {
    if (!petName.trim()) { Alert.alert('Missing Info', 'Please enter your pet\'s name.'); return; }
    if (!petDob.trim()) { Alert.alert('Missing Info', 'Please enter your pet\'s date of birth.'); return; }
    if (!gender) { Alert.alert('Missing Info', 'Please select your pet\'s gender.'); return; }
    if (services.length === 0) { Alert.alert('Missing Info', 'No services selected.'); return; }
    onConfirm({ petName, petDob, gender, services, total });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Pet Details */}
        <Text style={styles.sectionTitle}>Pet Details</Text>
        <View style={styles.card}>
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

        {/* Gender */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[styles.genderBtn, gender === 'Male' && styles.genderBtnSelected]}
            onPress={() => setGender('Male')}
          >
            <Ionicons name="male" size={20} color={gender === 'Male' ? '#FFFFFF' : '#F48C06'} />
            <Text style={[styles.genderText, gender === 'Male' && styles.genderTextSelected]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderBtn, gender === 'Female' && styles.genderBtnSelected]}
            onPress={() => setGender('Female')}
          >
            <Ionicons name="female" size={20} color={gender === 'Female' ? '#FFFFFF' : '#F48C06'} />
            <Text style={[styles.genderText, gender === 'Female' && styles.genderTextSelected]}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Services */}
        <Text style={styles.sectionTitle}>Selected Services</Text>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>No services selected.</Text>
        ) : (
          <View style={styles.card}>
            {services.map((s, i) => (
              <View key={i}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceIconBox}>
                    <MaterialIcons name="pets" size={14} color="#F48C06" />
                  </View>
                  <Text style={styles.serviceText}>{s}</Text>
                  <Text style={styles.servicePrice}>LKR {SERVICE_PRICES[s]?.toLocaleString()}</Text>
                </View>
                {i < services.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}

        {/* Appointment Info */}
        <Text style={styles.sectionTitle}>Appointment Info</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="storefront-outline" size={16} color="#F48C06" />
            <Text style={styles.infoLabel}>Salon</Text>
            <Text style={styles.infoValue}>{bookingData?.salon || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#F48C06" />
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{bookingData?.date || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#F48C06" />
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{bookingData?.time || '—'}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>LKR {total.toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm Booking</Text>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 45, marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  inputIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  genderRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#F48C06', backgroundColor: '#FFFFFF' },
  genderBtnSelected: { backgroundColor: '#F48C06' },
  genderText: { fontSize: 15, fontWeight: '600', color: '#F48C06' },
  genderTextSelected: { color: '#FFFFFF' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  serviceIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  serviceText: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  servicePrice: { fontSize: 13, fontWeight: '600', color: '#F48C06' },
  emptyText: { fontSize: 13, color: '#999999', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 10 },
  infoLabel: { fontSize: 13, color: '#888888', width: 50 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1A1A1A', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF4E6', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 24 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#F48C06' },
  confirmBtn: { flexDirection: 'row', backgroundColor: '#F48C06', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default GroomingCheckout;
