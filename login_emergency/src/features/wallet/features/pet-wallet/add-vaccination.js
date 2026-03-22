import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, StatusBar, Alert, Image, Platform 
} from 'react-native';
import { Camera, Upload, Calendar } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme/colors';

// Firebase imports
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function AddVaccination({ onBack, navigate }) {
  
  const [vaccineName, setVaccineName] = useState('');
  const [dateTaken, setDateTaken] = useState(new Date());
  const [nextDueDate, setNextDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!vaccineName.trim()) {
      Alert.alert('Error', 'Please fill in vaccine name');
      return;
    }

    const auth = getAuth();
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to add a record.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save');
        return;
      }

      await addDoc(collection(db, 'users', user.uid, 'vaccinations'), {
        vaccineName: vaccineName.trim(),
        dateTaken: dateTaken.toLocaleDateString(),
        nextDueDate: nextDueDate.toLocaleDateString(),
        imageUri: imageUri,
        createdAt: serverTimestamp()
      });
      
      Alert.alert('Success', 'Vaccination record added successfully', [
        { text: 'OK', onPress: onBack }
      ]);
    } catch (error) {
      console.error('Error adding vaccination:', error);
      Alert.alert('Error', 'Failed to save vaccination record');
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
        <Text style={styles.headerTitle}>Add Vaccination</Text>
      </View>

      <View style={styles.headerBackground}>
        {/* Header background */}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vaccine Name *</Text>
          <TextInput
            style={styles.input}
            value={vaccineName}
            onChangeText={setVaccineName}
            placeholder="e.g., Rabies, DHPP"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Taken *</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar color={COLORS.primary} size={20} />
            <Text style={styles.dateText}>{dateTaken.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateTaken}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDateTaken(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Next Due Date</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDuePicker(true)}
          >
            <Calendar color={COLORS.primary} size={20} />
            <Text style={styles.dateText}>{nextDueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDuePicker && (
            <DateTimePicker
              value={nextDueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDuePicker(false);
                if (selectedDate) setNextDueDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Document</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Upload color={COLORS.primary} size={20} />
            <Text style={styles.uploadText}>Select Image</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Vaccination'}
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed'
  },
  uploadText: { marginLeft: 10, color: COLORS.primary, fontSize: 16 },
  previewImage: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
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