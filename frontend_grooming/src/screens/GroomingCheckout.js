import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Alert,
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
  const [paymentMethod, setPaymentMethod] = useState(null);

  const services = bookingData?.services || [];
  const total = services.reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);

  const handleConfirm = () => {
    if (!paymentMethod) { Alert.alert('Payment Required', 'Please select a payment method.'); return; }
    onConfirm({ ...bookingData, paymentMethod, total });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Pet Info */}
        <Text style={styles.sectionTitle}>Pet Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              {bookingData?.petType === 'Cat'
                ? <FontAwesome5 name="cat" size={14} color="#FF741C" />
                : <FontAwesome5 name="dog" size={14} color="#FF741C" />}
            </View>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{bookingData?.petType || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <FontAwesome5 name="paw" size={13} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{bookingData?.petName || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={15} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>DOB</Text>
            <Text style={styles.infoValue}>{bookingData?.petDob || '—'}</Text>
          </View>
        </View>

        {/* Appointment Info */}
        <Text style={styles.sectionTitle}>Appointment Info</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="storefront-outline" size={15} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Salon</Text>
            <Text style={styles.infoValue}>{bookingData?.salon || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={15} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{bookingData?.date || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="time-outline" size={15} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{bookingData?.time || '—'}</Text>
          </View>
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
                  <View style={styles.infoIconBox}>
                    <MaterialIcons name="pets" size={14} color="#FF741C" />
                  </View>
                  <Text style={styles.serviceText}>{s}</Text>
                  <Text style={styles.servicePrice}>LKR {SERVICE_PRICES[s]?.toLocaleString()}</Text>
                </View>
                {i < services.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('card')}
        >
          <View style={[styles.paymentIconBox, paymentMethod === 'card' && styles.paymentIconBoxSelected]}>
            <Ionicons name="card-outline" size={22} color={paymentMethod === 'card' ? '#FFFFFF' : '#FF741C'} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentTitle, paymentMethod === 'card' && styles.paymentTitleSelected]}>Card Payment</Text>
            <Text style={[styles.paymentSub, paymentMethod === 'card' && styles.paymentSubSelected]}>Credit / Debit card</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'card' && styles.radioSelected]}>
            {paymentMethod === 'card' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={[styles.paymentIconBox, paymentMethod === 'cash' && styles.paymentIconBoxSelected]}>
            <Ionicons name="cash-outline" size={22} color={paymentMethod === 'cash' ? '#FFFFFF' : '#FF741C'} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentTitle, paymentMethod === 'cash' && styles.paymentTitleSelected]}>Pay at Visit</Text>
            <Text style={[styles.paymentSub, paymentMethod === 'cash' && styles.paymentSubSelected]}>Pay in cash at the salon</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'cash' && styles.radioSelected]}>
            {paymentMethod === 'cash' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  divider: { height: 1, backgroundColor: '#EEEEEE' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  infoIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#666666', width: 44 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: '#000000', textAlign: 'right' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  serviceText: { flex: 1, fontSize: 14, color: '#000000' },
  servicePrice: { fontSize: 13, fontWeight: '600', color: '#FF741C' },
  emptyText: { fontSize: 13, color: '#666666', marginBottom: 20 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#EEEEEE', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  paymentOptionSelected: { borderColor: '#FF741C', backgroundColor: '#FFFFFF' },
  paymentIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  paymentIconBoxSelected: { backgroundColor: '#FF741C' },
  paymentInfo: { flex: 1 },
  paymentTitle: { fontSize: 14, fontWeight: '600', color: '#000000' },
  paymentTitleSelected: { color: '#FF741C' },
  paymentSub: { fontSize: 12, color: '#666666', marginTop: 2 },
  paymentSubSelected: { color: '#FF741C' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#FF741C' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF741C' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF0E6', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 24, marginTop: 8 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#000000' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#FF741C' },
  confirmBtn: { flexDirection: 'row', backgroundColor: '#FF741C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default GroomingCheckout;
