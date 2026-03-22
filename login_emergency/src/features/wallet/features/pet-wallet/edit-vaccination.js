import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, StatusBar, Alert, Image, Platform 
} from 'react-native';
import { ChevronLeft, Upload, Calendar } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme/colors';
import { db } from '../../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function EditVaccination({ onBack, params }) {
  
  const [vaccineName, setVaccineName] = useState(params?.vaccineName || '');
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

  const [dateTaken, setDateTaken] = useState(() => parseDate(params?.dateTaken));
  const [nextDueDate, setNextDueDate] = useState(() => parseDate(params?.nextDueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [imageUri, setImageUri] = useState(params?.imageUri || null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!vaccineName.trim()) {
      Alert.alert('Error', 'Please fill in vaccine name');
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

      await updateDoc(doc(db, 'users', user.uid, 'vaccinations', params.id), {
        vaccineName: vaccineName.trim(),
        dateTaken: dateTaken.toLocaleDateString(),
        nextDueDate: nextDueDate.toLocaleDateString(),
        imageUri: imageUri || null,
        updatedAt: new Date()
      });
      
      Alert.alert('Success', 'Vaccination record updated successfully', [
        { text: 'OK', onPress: () => onBack && onBack() }
      ]);
    } catch (error) {
      console.error('Error updating vaccination:', error);
      Alert.alert('Error', 'Failed to update vaccination record');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateTaken(selectedDate);
    }
  };

  const onDueDateChange = (event, selectedDate) => {
    setShowDuePicker(false);
    if (selectedDate) {
      setNextDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vaccination</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vaccine Name *</Text>
          <TextInput
            style={styles.input}
            value={vaccineName}
            onChangeText={setVaccineName}
            placeholder="e.g., Rabies, DHPP"
            placeholderTextColor="#999"
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
              onChange={onDateChange}
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
              onChange={onDueDateChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Document</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Upload color={COLORS.primary} size={20} />
            <Text style={styles.uploadText}>
              {imageUri ? 'Change Image' : 'Select Image'}
            </Text>
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
            {loading ? 'Updating...' : 'Update Vaccination'}
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  uploadText: { 
    marginLeft: 10, 
    color: COLORS.primary, 
    fontSize: 16 
  },
  previewImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    marginTop: 10 
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