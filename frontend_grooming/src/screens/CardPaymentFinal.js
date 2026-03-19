import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CardPaymentFinal = ({ onBack, onPay, cardData, bookingData }) => {
  const services = bookingData?.services || [];
  const SERVICE_PRICES = {
    'Bathing': 2500, 'Hair Trimming': 1800, 'Nail Trimming': 800,
    'Ear Cleaning': 600, 'Teeth Brushing': 1000, 'Flea Treatment': 3200,
  };
  const subTotal = services.reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);
  const serviceFee = 300;
  const total = subTotal + serviceFee;

  const maskedCard = cardData?.cardNumber
    ? '**** ' + cardData.cardNumber.replace(/\s/g, '').slice(-4)
    : '**** 0032';

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

        {/* Confirm Payment */}
        <Text style={styles.sectionTitle}>Confirm Payment</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sub Total</Text>
            <Text style={styles.rowValue}>LKR {subTotal.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service fee</Text>
            <Text style={styles.rowValue}>LKR {serviceFee.toLocaleString()}</Text>
          </View>
        </View>

        {/* Confirm Card */}
        <Text style={styles.sectionTitle}>Confirm Card</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardIconBox}>
              <View style={styles.brandCircle1} />
              <View style={styles.brandCircle2} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardBank}>{cardData?.nameOnCard || 'Card Holder'}</Text>
              <Text style={styles.cardMasked}>Mastercard {maskedCard}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color="#F48C06" />
          </View>
        </View>

        {/* Total Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sub Total</Text>
            <Text style={styles.rowValue}>LKR {subTotal.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service fee</Text>
            <Text style={styles.rowValue}>LKR {serviceFee.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>LKR {total.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={onPay}>
          <Text style={styles.payBtnText}>Pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scroll: { paddingHorizontal: 20, paddingBottom: 36 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowLabel: { fontSize: 14, color: '#666666' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 },
  cardIconBox: { flexDirection: 'row', width: 44 },
  brandCircle1: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F48C06' },
  brandCircle2: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFC107', marginLeft: -10, opacity: 0.85 },
  cardInfo: { flex: 1 },
  cardBank: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  cardMasked: { fontSize: 12, color: '#888888', marginTop: 2 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#F48C06' },
  payBtn: { backgroundColor: '#F48C06', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  payBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CardPaymentFinal;
