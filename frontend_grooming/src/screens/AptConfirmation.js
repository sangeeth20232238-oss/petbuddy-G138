import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const AptConfirmation = ({ onHome, bookingData }) => {
  const services = bookingData?.services || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Pending Badge */}
        <View style={styles.topSection}>
          <View style={styles.pendingCircle}>
            <Ionicons name="time-outline" size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.pendingTitle}>Appointment Requested!</Text>
          <Text style={styles.pendingSubtitle}>
            Your appointment is pending admin confirmation.{'\n'}
            You will be notified once it is confirmed.
          </Text>
        </View>

        {/* Appointment Details */}
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="storefront-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Salon</Text>
            <Text style={styles.infoValue}>{bookingData?.salon || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{bookingData?.date || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="time-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{bookingData?.time || '—'}</Text>
          </View>
        </View>

        {/* Pet & Owner Details */}
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="paw-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Pet</Text>
            <Text style={styles.infoValue}>{bookingData?.petName || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Owner</Text>
            <Text style={styles.infoValue}>{bookingData?.ownerName || '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call-outline" size={14} color="#FF741C" />
            </View>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{bookingData?.ownerPhone || '—'}</Text>
          </View>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.card}>
          {services.map((s, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <MaterialIcons name="pets" size={13} color="#FF741C" />
                </View>
                <Text style={styles.serviceText}>{s}</Text>
              </View>
              {i < services.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Notification Notice */}
        <View style={styles.noticeBox}>
          <Ionicons name="notifications-outline" size={20} color="#FF741C" style={{ marginRight: 10 }} />
          <Text style={styles.noticeText}>
            We'll send you a notification as soon as the admin confirms your appointment.
          </Text>
        </View>

        {/* Thank You */}
        <Text style={styles.thanksText}>
          Thank you for choosing PetBuddy! 🐾{'\n'}We look forward to pampering your pet.
        </Text>

        {/* Return Home */}
        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>Return to Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  topSection: { alignItems: 'center', marginBottom: 32 },
  pendingCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#FF741C', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#FF741C', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  pendingTitle: { fontSize: 22, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  pendingSubtitle: { fontSize: 13, color: '#666666', textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 12, marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  divider: { height: 1, backgroundColor: '#EEEEEE' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  iconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#666666', width: 60 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: '#000000', textAlign: 'right' },
  serviceText: { flex: 1, fontSize: 13, color: '#000000' },
  noticeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', borderRadius: 12, padding: 14, marginBottom: 20 },
  noticeText: { flex: 1, fontSize: 12, color: '#444444', lineHeight: 18 },
  thanksText: { fontSize: 14, color: '#666666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  homeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, backgroundColor: '#FF741C' },
  homeBtnText: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
});

export default AptConfirmation;
