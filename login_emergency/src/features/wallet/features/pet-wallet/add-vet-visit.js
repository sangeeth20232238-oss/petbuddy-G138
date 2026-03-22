import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, StatusBar, Alert, Platform 
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme/colors';

// Firebase imports
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function AddVetVisit({ onBack, navigate }) {
  
  const [visitReason, setVisitReason] = useState('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!visitReason.trim() || !veterinarian.trim()) {
      Alert.alert('Error', 'Please fill in visit reason and veterinarian');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'vetVisits'), {
        visitReason: visitReason.trim(),
        visitDate: visitDate.toLocaleDateString(),
        veterinarian: veterinarian.trim(),
        notes: notes.trim(),
        createdAt: serverTimestamp()
      });
      
      Alert.alert('Success', 'Vet visit record added successfully', [
        { text: 'OK', onPress: onBack }
      ]);
    } catch (error) {
      console.error('Error adding vet visit:', error);
      Alert.alert('Error', 'Failed to save vet visit record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Standard Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vet Visit</Text>
      </View>

      <View style={styles.headerBackground}>
        {/* Header background */}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visit Reason *</Text>
          <TextInput
            style={styles.input}
            value={visitReason}
            onChangeText={setVisitReason}
            placeholder="e.g., Annual checkup, Vaccination"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visit Date *</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar color={COLORS.primary} size={20} />
            <Text style={styles.dateText}>{visitDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={visitDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setVisitDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Veterinarian *</Text>
          <TextInput
            style={styles.input}
            value={veterinarian}
            onChangeText={setVeterinarian}
            placeholder="e.g., Dr. Smith"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes about the visit..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Vet Visit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFF9F5',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#222',
    marginLeft: 50,
  },
  backButton: {
    padding: 4,
  },
  headerBackground: {
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  content: { padding: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 30,
    elevation: 4
  },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  dateText: { marginLeft: 10, fontSize: 16, color: '#333' }
});