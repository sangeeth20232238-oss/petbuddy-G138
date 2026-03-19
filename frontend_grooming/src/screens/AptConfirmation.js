import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const SERVICE_PRICES = {
  'Bathing': 2500, 'Hair Trimming': 1800, 'Nail Trimming': 800,
  'Ear Cleaning': 600, 'Teeth Brushing': 1000, 'Flea Treatment': 3200,
};

const AptConfirmation = ({ onHome, bookingData, cardData }) => {
  const services = bookingData?.services || [];
  const subTotal = services.reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);
  const serviceFee = 300;
  const total = subTotal + serviceFee;

  const maskedCard = cardData?.cardNumber
    ? '**** ' + cardData.cardNumber.replace(/\s/g, '').slice(-4)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Success Badge */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSub}>Your appointment has been successfully booked.</Text>
        </View>

        {/* Pet & Appointment Info */}
        <Text style={styles.sectionTitle}>Appointment Summary</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              {bookingData?.petType === 'Cat'
                ? <FontAwesome5 name="cat" size={13} color="#F48C06" />
                : <FontAwesome5 name="dog" size={13} color="#F48C06" />}
            </View>
            <Text style={styles.infoLabel}>Pet</Text>
            <Text style={styles.infoValue}>{bookingData?.petName || '—'} ({bookingData?.petType || '—'})</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="storefront-outline" size={14} color="#F48C06" />
            </View>
            <Text style={styles.infoLabel}>Salon</Text>
            <Text style={styles.infoValue}>{bookingData?.salon || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={14} color="#F48C06" />
            </View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{bookingData?.date || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="time-outline" size={14} color="#F48C06" />
            </View>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{bookingData?.time || '—'}</Text>
          </View>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.card}>
          {services.map((s, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <MaterialIcons name="pets" size={13} color="#F48C06" />
                </View>
                <Text style={styles.infoLabel2}>{s}</Text>
                <Text style={styles.priceValue}>LKR {SERVICE_PRICES[s]?.toLocaleString()}</Text>
              </View>
              {i < services.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.card}>
          {maskedCard ? (
            <>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="card-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.infoLabel}>Card</Text>
                <Text style={styles.infoValue}>{maskedCard}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="receipt-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.infoLabel}>Sub Total</Text>
                <Text style={styles.infoValue}>LKR {subTotal.toLocaleString()}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="pricetag-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.infoLabel}>Service fee</Text>
                <Text style={styles.infoValue}>LKR {serviceFee.toLocaleString()}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="wallet-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>LKR {total.toLocaleString()}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="cash-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.infoLabel}>Method</Text>
                <Text style={styles.infoValue}>Pay at Visit</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="wallet-outline" size={14} color="#F48C06" />
                </View>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>LKR {total.toLocaleString()}</Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Ionicons name="home-outline" size={18} color="#F48C06" />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36, paddingTop: 20 },
  successSection: { alignItems: 'center', marginBottom: 32 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F48C06', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#F48C06', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  successSub: { fontSize: 13, color: '#888888', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  iconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF4E6', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#888888', width: 70 },
  infoLabel2: { flex: 1, fontSize: 13, color: '#1A1A1A' },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1A1A1A', textAlign: 'right' },
  priceValue: { fontSize: 13, fontWeight: '600', color: '#F48C06' },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', width: 70 },
  totalValue: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#F48C06', textAlign: 'right' },
  homeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 12, borderWidth: 2, borderColor: '#F48C06', backgroundColor: '#FFFFFF', marginTop: 4 },
  homeBtnText: { fontSize: 14, fontWeight: '600', color: '#F48C06' },
});

export default AptConfirmation;
