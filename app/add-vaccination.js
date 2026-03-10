import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, StatusBar, ScrollView, Image, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../src/theme/colors';

// Conditional require for Native only
const DateTimePicker = Platform.OS === 'web' ? null : require('@react-native-community/datetimepicker').default;

import { db } from '../src/services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CustomInput = ({ placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <TextInput 
      placeholder={placeholder} 
      placeholderTextColor="#666"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function AddVaccination() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [vaccineName, setVaccineName] = useState('');
  const [image, setImage] = useState(null);           
  const [loading, setLoading] = useState(false);      

  const [dateTaken, setDateTaken] = useState(new Date());
  const [nextDueDate, setNextDueDate] = useState(new Date());
  
  const [showTakenPicker, setShowTakenPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const onDateTakenChange = (event, selectedDate) => {
    setShowTakenPicker(Platform.OS === 'ios'); 
    if (selectedDate) setDateTaken(selectedDate);
  };

  const onDueDateChange = (event, selectedDate) => {
    setShowDuePicker(Platform.OS === 'ios');
    if (selectedDate) setNextDueDate(selectedDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleAddRecord = async () => {
    if (!vaccineName.trim()) {
      Alert.alert("Error", "Please fill in the Vaccine name.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "vaccinations"), {
        vaccineName: vaccineName.trim(),
        dateTaken: dateTaken.toDateString(), 
        nextDueDate: nextDueDate.toDateString(),
        imageUri: image, 
        createdAt: serverTimestamp(),
      });
      
      Alert.alert("Success", "Record saved!");
      router.back();
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Failed to save record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Vaccination</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <CustomInput placeholder="Vaccine Name" value={vaccineName} onChangeText={setVaccineName} />

        <Text style={styles.dateLabel}>Date Taken</Text>
        {/* REMOVED HTML tags here to stop the crash */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowTakenPicker(true)}>
          <Text style={styles.dateButtonText}>{dateTaken.toDateString()}</Text>
          <Calendar size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.dateLabel}>Next Due Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDuePicker(true)}>
          <Text style={styles.dateButtonText}>{nextDueDate.toDateString()}</Text>
          <Calendar size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Picker logic for Mobile */}
        {Platform.OS !== 'web' && DateTimePicker && (
          <>
            {showTakenPicker && (
              <DateTimePicker 
                value={dateTaken} 
                mode="date" 
                display="default" 
                onChange={onDateTakenChange} 
              />
            )}
            {showDuePicker && (
              <DateTimePicker 
                value={nextDueDate} 
                mode="date" 
                display="default" 
                onChange={onDueDateChange} 
              />
            )}
          </>
        )}

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Text style={styles.uploadText}>Upload Document</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleAddRecord} 
            disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add Record</Text>}
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
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
    paddingBottom: 25 
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  backButton: { backgroundColor: '#FFF', borderRadius: 12, padding: 8, elevation: 2 },
  formContent: { padding: 25, paddingBottom: 150 },
  inputContainer: { 
    backgroundColor: '#E0E0E0', 
    borderRadius: 30, 
    borderWidth: 1.5, 
    borderColor: COLORS.primary, 
    marginBottom: 15, 
    paddingHorizontal: 25, 
    height: 60, 
    justifyContent: 'center' 
  },
  input: { fontSize: 16, color: '#333' },
  dateLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 10 },
  dateButton: { 
    backgroundColor: 'white', 
    borderRadius: 30, 
    borderWidth: 1.5, 
    borderColor: COLORS.primary, 
    marginBottom: 20, 
    paddingHorizontal: 25, 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  dateButtonText: { fontSize: 16, color: '#333' },
  uploadBox: { 
    borderWidth: 2, 
    borderColor: COLORS.primary, 
    borderStyle: 'dashed', 
    borderRadius: 25, 
    height: 120, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10, 
    marginBottom: 30, 
    overflow: 'hidden' 
  },
  previewImage: { width: '100%', height: '100%' },
  uploadText: { fontSize: 18, color: '#333', fontWeight: '500' },
  submitButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  submitButtonText: { color: 'white', fontSize: 24, fontWeight: '600' },
  fabContainer: { position: 'absolute', width: '100%', alignItems: 'center' },
  fab: { 
    backgroundColor: COLORS.primary, 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 }
  }
});