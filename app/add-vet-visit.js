import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, StatusBar, ScrollView, Alert, ActivityIndicator, Platform 
} from 'react-native';
// useSafeAreaInsets handles dynamic padding for notches and status bars on modern devices
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';

/**
 * CONDITIONAL IMPORT:
 * @react-native-community/datetimepicker is a native module and crashes on Web.
 * We use 'require' inside a Platform check so the Web build ignores it.
 */
const DateTimePicker = Platform.OS === 'web' ? null : require('@react-native-community/datetimepicker').default;

// Firebase Imports: collection (reference), addDoc (insert), serverTimestamp (consistent timing)
import { db } from '../src/services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Screen: AddVetVisit
 * Purpose: Allows users to record a visit to a veterinary clinic.
 */
export default function AddVetVisit() {
  const router = useRouter(); // Access navigation routing
  const insets = useSafeAreaInsets(); // FIX: Provides pixel values for the notch/status bar area

  // --- FORM STATE MANAGEMENT ---
  const [clinicName, setClinicName] = useState(''); // Stores the clinic's name
  const [reason, setReason] = useState('');         // Stores why the pet is visiting
  const [loading, setLoading] = useState(false);    // Controls the save button spinner

  // --- DATE PICKER STATE ---
  const [date, setDate] = useState(new Date());        // Actual JS Date object for logic
  const [showPicker, setShowPicker] = useState(false); // Controls visibility of the picker modal
  const [dateText, setDateText] = useState('Select Date'); // User-friendly string for the UI

  /**
   * HANDLER: onDateChange
   * Triggered when the user picks a date from the native calendar modal.
   */
  const onDateChange = (event, selectedDate) => {
    // Android: Picker closes automatically. iOS: Often stays in a modal style.
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setDate(selectedDate);
      
      // Formatting the date into a readable string: e.g., "18 Feb 2026"
      const formatted = selectedDate.getDate() + ' ' + 
                        selectedDate.toLocaleString('default', { month: 'short' }) + ' ' + 
                        selectedDate.getFullYear();
      setDateText(formatted);
    }
  };

  /**
   * HANDLER: handleSave
   * Validates the form and persists data to the 'vet_visits' collection in petbuddy-138.
   */
  const handleSave = async () => {
    // Validation: Clinic Name and Date must be provided
    if (!clinicName.trim() || dateText === 'Select Date') {
      Alert.alert("Error", "Clinic Name and Date are required.");
      return;
    }

    setLoading(true); // Start loading spinner
    try {
      /**
       * Persisting to Firestore.
       * visitDate is stored as a string for easy rendering in history lists.
       */
      await addDoc(collection(db, "vet_visits"), {
        clinicName: clinicName.trim(),
        visitDate: dateText,
        reason: reason.trim(),
        createdAt: serverTimestamp(), // Uses Firebase server time for accurate sorting
      });

      Alert.alert("Success", "Visit recorded!");
      router.back(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Save failed. Please check your connection.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <View style={styles.container}>
      {/* Set status bar text to dark to be visible on the light header background */}
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER SECTION --- 
          Applied dynamic top padding using 'insets' to ensure content clears the phone's notch.
      */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Add Vet Visit</Text>
          
          {/* Invisible spacer to keep the title perfectly centered */}
          <View style={{ width: 40 }} /> 
        </View>
      </View>

      {/* --- FORM CONTENT --- */}
      <ScrollView 
        contentContainerStyle={styles.formContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Input: Clinic Name */}
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Clinic Name" 
            value={clinicName} 
            onChangeText={setClinicName} 
            style={styles.input} 
            placeholderTextColor="#666" 
          />
        </View>
        
        {/* Date Selection: Styled as a button that looks like an input */}
        <TouchableOpacity 
          style={styles.inputContainer} 
          onPress={() => setShowPicker(true)}
        >
          <View style={styles.datePickerContent}>
            <Text style={[styles.input, {color: dateText === 'Select Date' ? '#666' : '#333'}]}>
              {dateText}
            </Text>
            <Calendar color={COLORS.primary} size={20} />
          </View>
        </TouchableOpacity>

        {/* NATIVE PICKER: Only rendered on Mobile platforms */}
        {showPicker && Platform.OS !== 'web' && DateTimePicker && (
          <DateTimePicker 
            value={date} 
            mode="date" 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={onDateChange} 
          />
        )}

        {/* Input: Reason for Visit */}
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Reason for Visit" 
            value={reason} 
            onChangeText={setReason} 
            style={styles.input} 
            placeholderTextColor="#666" 
          />
        </View>

        {/* Record/Save Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSave} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Record Visit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* --- FLOATING ACTION BUTTON (FAB) --- 
          Positioned bottom-center using 'insets' to clear home indicators.
      */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * STYLESHEET
 */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF9F5' 
  },
  headerBackground: { 
    backgroundColor: COLORS.cardBg, 
    borderBottomLeftRadius: 45, 
    borderBottomRightRadius: 45, 
    paddingHorizontal: 25, 
    paddingBottom: 25 
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333' 
  },
  backButton: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formContent: { 
    padding: 25,
    paddingBottom: 150 
  },
  inputContainer: { 
    backgroundColor: '#E0E0E0', 
    borderRadius: 30, 
    borderWidth: 1.5, 
    borderColor: COLORS.primary, 
    marginBottom: 20, 
    paddingHorizontal: 25, 
    height: 60, 
    justifyContent: 'center' 
  },
  datePickerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  input: { 
    fontSize: 16, 
    color: '#333' 
  },
  submitButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 10
  },
  submitButtonText: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '600' 
  },
  fabContainer: { 
    position: 'absolute', 
    width: '100%', 
    alignItems: 'center' 
  },
  fab: { 
    backgroundColor: COLORS.primary, 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});