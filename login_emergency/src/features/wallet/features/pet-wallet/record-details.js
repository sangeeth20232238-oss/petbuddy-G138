import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Image, Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Syringe, Pill, Stethoscope, FileText, Trash2 } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { db } from '../../services/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default function RecordDetails({ onBack, params, navigate }) {
  const insets = useSafeAreaInsets();

  const isVaccination = params?.type === 'vaccinations';
  const isPrescription = params?.type === 'prescriptions';
  const isVetVisit = params?.type === 'vetVisits';

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const collection = isVaccination ? 'vaccinations' : isPrescription ? 'prescriptions' : 'vetVisits';
              await deleteDoc(doc(db, collection, params.id));
              Alert.alert('Success', 'Record deleted successfully', [
                { text: 'OK', onPress: onBack }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isVaccination ? 'Vaccination Details' : isPrescription ? 'Prescription Details' : 'Vet Visit Details'}
          </Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 color="#FF4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.detailCard}>
          <View style={styles.iconHeader}>
            {isVaccination ? (
              <Syringe size={40} color={COLORS.primary} />
            ) : isPrescription ? (
              <Pill size={40} color={COLORS.primary} />
            ) : (
              <Stethoscope size={40} color={COLORS.primary} />
            )}
          </View>
          
          <Text style={styles.recordTitle}>{params.title}</Text>
          
          <View style={styles.infoSection}>
            {isVaccination ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Date Taken:</Text>
                  <Text style={styles.value}>{params.date}</Text>
                </View>
                {params.dueDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Next Due:</Text>
                    <Text style={styles.value}>{params.dueDate}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Pet:</Text>
                  <Text style={styles.value}>{params.pet || 'Bunny'}</Text>
                </View>
              </>
            ) : isPrescription ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Dosage:</Text>
                  <Text style={styles.value}>{params.dosage}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>{params.date}</Text>
                </View>
                {params.endDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>End Date:</Text>
                    <Text style={styles.value}>{params.endDate}</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Visit Date:</Text>
                  <Text style={styles.value}>{params.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Veterinarian:</Text>
                  <Text style={styles.value}>{params.veterinarian}</Text>
                </View>
                {params.notes && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Notes:</Text>
                    <Text style={styles.value}>{params.notes}</Text>
                  </View>
                )}
              </>
            )}
          </View>
          
          {params.image && (
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Report/Document</Text>
              <TouchableOpacity activeOpacity={0.9}>
                <Image source={{ uri: params.image }} style={styles.reportImage} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Notes</Text>
          <Text style={styles.noteText}>
            {isVaccination 
              ? 'Keep vaccination records up to date for boarding and travel requirements.'
              : isPrescription
              ? 'Follow prescribed dosage and complete the full course as directed by your veterinarian.'
              : 'Regular vet visits help maintain your pet\'s health and catch issues early.'}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F5' },
  headerBackground: {
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  backButton: { backgroundColor: '#FFF', borderRadius: 12, padding: 8, elevation: 2 },
  deleteButton: { 
    backgroundColor: '#FFE6E6', 
    borderRadius: 12, 
    padding: 8, 
    elevation: 2 
  },
  content: { padding: 25, paddingBottom: 150 },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 20
  },
  iconHeader: { marginBottom: 15 },
  recordTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 25, textAlign: 'center' },
  infoSection: { width: '100%' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  label: { fontSize: 16, color: '#666', fontWeight: '500' },
  value: { fontSize: 16, color: '#333', fontWeight: '600' },
  imageSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15
  },
  reportImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover'
  },
  noteCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary
  },
  noteTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  noteText: { fontSize: 14, color: '#666', lineHeight: 20 },
  fabContainer: { position: 'absolute', width: '100%', alignItems: 'center' },
  fab: {
    backgroundColor: COLORS.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  }
});