import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, StatusBar, Alert, Platform 
} from 'react-native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme/colors';
import { db } from '../../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function EditVetVisit({ onBack, params }) {
  
  const [visitReason, setVisitReason] = useState(params?.visitReason || '');
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const parsed = new Date(year, month, day);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  };

  const [visitDate, setVisitDate] = useState(() => parseDate(params?.visitDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [veterinarian, setVeterinarian] = useState(params?.veterinarian || '');
  const [notes, setNotes] = useState(params?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!visitReason.trim() || !veterinarian.trim()) {
      Alert.alert('Error', 'Please fill in visit reason and veterinarian');
      return;
    }

    if (!params?.id) {
      Alert.alert('Error', 'No record ID found');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to update');
        return;
      }

      await updateDoc(doc(db, 'users', user.uid, 'vetVisits', params.id), {
        visitReason: visitReason.trim(),
        visitDate: visitDate.toLocaleDateString(),
        veterinarian: veterinarian.trim(),
        notes: notes.trim(),
        updatedAt: new Date()
      });
      
      Alert.alert('Success', 'Vet visit record updated successfully', [
        { text: 'OK', onPress: () => onBack && onBack() }
      ]);
    } catch (error) {
      console.error('Error updating vet visit:', error);
      Alert.alert('Error', 'Failed to update vet visit record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vet Visit</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visit Reason *</Text>
          <TextInput
            style={styles.input}
            value={visitReason}
            onChangeText={setVisitReason}
            placeholder="e.g., Annual checkup, Vaccination"
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes about the visit..."
            placeholderTextColor="#999"
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
            {loading ? 'Updating...' : 'Update Vet Visit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF9F5' 
  },
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
  content: { 
    padding: 25 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateText: { 
    marginLeft: 10, 
    fontSize: 16, 
    color: '#333' 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: { 
    opacity: 0.6 
  },
  saveButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600' 
  }
});