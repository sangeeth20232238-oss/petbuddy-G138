import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CardPayment = ({ onBack, onAdd }) => {
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const getCardDisplay = () => {
    const raw = cardNumber.replace(/\s/g, '');
    const p1 = raw.slice(0, 4) || '****';
    const p2 = raw.slice(4, 8) || '****';
    const p3 = raw.slice(8, 12) || '****';
    const p4 = raw.slice(12, 16) || '****';
    return `${p1}  ${p2}  ${p3}  ${p4}`;
  };

  const handleAdd = () => {
    if (!nameOnCard.trim()) { Alert.alert('Missing Info', 'Please enter the name on card.'); return; }
    if (cardNumber.replace(/\s/g, '').length < 16) { Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.'); return; }
    if (expiry.length < 5) { Alert.alert('Invalid Expiry', 'Please enter a valid expiry date.'); return; }
    if (cvv.length < 3) { Alert.alert('Invalid CVV', 'Please enter a valid CVV.'); return; }
    onAdd && onAdd({ nameOnCard, cardNumber, expiry, cvv, isDefault });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardTop}>
            <Ionicons name="wifi" size={22} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
            <View style={styles.cardBrandBox}>
              <View style={styles.brandCircle1} />
              <View style={styles.brandCircle2} />
            </View>
          </View>
          <Text style={styles.cardNumberDisplay}>{getCardDisplay()}</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardBottomLabel}>VALID THRU</Text>
              <Text style={styles.cardBottomValue}>{expiry || 'MM/YY'}</Text>
            </View>
            <Text style={styles.cardHolderName}>{nameOnCard || 'YOUR NAME'}</Text>
          </View>
        </View>

        {/* Form */}
        <Text style={styles.formTitle}>Add payment card</Text>
        <Text style={styles.formSubtitle}>Add your card details</Text>

        <Text style={styles.label}>Name on card</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Smith"
            placeholderTextColor="#AAAAAA"
            value={nameOnCard}
            onChangeText={setNameOnCard}
          />
        </View>

        <Text style={styles.label}>Card details</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#AAAAAA"
            value={cardNumber}
            onChangeText={(v) => setCardNumber(formatCardNumber(v))}
            keyboardType="numeric"
            maxLength={19}
          />
          <Ionicons name="card-outline" size={20} color="#AAAAAA" />
        </View>

        <View style={styles.rowInputs}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Expiry date</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="MM/YYYY"
                placeholderTextColor="#AAAAAA"
                value={expiry}
                onChangeText={(v) => setExpiry(formatExpiry(v))}
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>CVV</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="•••"
                placeholderTextColor="#AAAAAA"
                value={cvv}
                onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>
        </View>

        {/* Default checkbox */}
        <TouchableOpacity style={styles.defaultRow} onPress={() => setIsDefault(p => !p)}>
          <View style={[styles.checkbox, isDefault && styles.checkboxSelected]}>
            {isDefault && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
          </View>
          <Text style={styles.defaultText}>Set as Default Card</Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
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
  cardPreview: { backgroundColor: '#F48C06', borderRadius: 20, padding: 24, marginBottom: 28, shadowColor: '#F48C06', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cardBrandBox: { flexDirection: 'row' },
  brandCircle1: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.6)' },
  brandCircle2: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', marginLeft: -12 },
  cardNumberDisplay: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 2, marginBottom: 24, textAlign: 'center' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardBottomLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  cardBottomValue: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  cardHolderName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase' },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: '#888888', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  input: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  rowInputs: { flexDirection: 'row', gap: 14 },
  halfCol: { flex: 1 },
  defaultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#F48C06', borderColor: '#F48C06' },
  defaultText: { fontSize: 14, color: '#1A1A1A' },
  btnRow: { flexDirection: 'row', gap: 14 },
  cancelBtn: { flex: 1, paddingVertical: 15, borderRadius: 12, borderWidth: 2, borderColor: '#E0E0E0', alignItems: 'center', backgroundColor: '#FFFFFF' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  addBtn: { flex: 1, paddingVertical: 15, borderRadius: 12, backgroundColor: '#F48C06', alignItems: 'center' },
  addBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});

export default CardPayment;
