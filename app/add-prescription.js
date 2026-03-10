import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, StatusBar, ScrollView, Alert, ActivityIndicator, Platform 
} from 'react-native';
// useSafeAreaInsets provides exact pixel values for notches and status bars
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';

/**
 * CONDITIONAL IMPORT:
 * @react-native-community/datetimepicker is a native module. 
 * We use 'require' inside a platform check to prevent the Web version from crashing.
 */
const DateTimePicker = Platform.OS === 'web' ? null : require('@react-native-community/datetimepicker').default;

// Firebase configuration and service imports
import { db } from '../src/services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * REUSABLE COMPONENT: CustomInput
 * Encapsulates form input styling for a cleaner main render function.
 */
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

export default function AddPrescription() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // FIX: Retrieves top/bottom padding for notches
  
  // --- FORM STATE ---
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(false);

  // --- DATE STATE ---
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  // --- VISIBILITY STATE (Mobile Only) ---
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // --- HANDLERS ---

  const onStartChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios'); 
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  /**
   * FUNCTION: handleSave
   * Validates input, formats data, and sends it to Firestore.
   */
  const handleSave = async () => {
    if (!medName.trim()) {
      Alert.alert("Error", "Please enter the medication name.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        medName: medName.trim(),
        dosage: dosage.trim(),
        startDate: startDate.toDateString(), 
        endDate: endDate.toDateString(),
        createdAt: serverTimestamp(),
      });
      
      Alert.alert("Success", "Prescription added!");
      router.back(); 
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Could not save to database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION: Applied dynamic top padding to fix notch overlap */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Prescription</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <CustomInput placeholder="Medication Name" value={medName} onChangeText={setMedName} />
        <CustomInput placeholder="Dosage (e.g., 5mg)" value={dosage} onChangeText={setDosage} />

        {/* Start Date Section */}
        <Text style={styles.dateLabel}>Start Date</Text>
        {Platform.OS === 'web' ? (
          // Using standard HTML strings for web inside a View to avoid console errors
          <View style={webStyles.inputWrapper}>
             <input 
              type="date" 
              style={webStyles.dateInput} 
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
            <Calendar size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* End Date Section */}
        <Text style={styles.dateLabel}>End Date</Text>
        {Platform.OS === 'web' ? (
          <View style={webStyles.inputWrapper}>
             <input 
              type="date" 
              style={webStyles.dateInput} 
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateButtonText}>{endDate.toDateString()}</Text>
            <Calendar size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* NATIVE PICKERS: Only renders on Android/iOS */}
        {Platform.OS !== 'web' && DateTimePicker && (
          <>
            {showStartPicker && (
              <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartChange} />
            )}
            {showEndPicker && (
              <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndChange} />
            )}
          </>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Save Prescription</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* FAB: Fixed bottom positioning using insets */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * WEB-ONLY CSS:
 * Note: These are raw CSS properties used by the HTML tags when on Web.
 */
const webStyles = {
  inputWrapper: { width: '100%', marginBottom: 20 },
  dateInput: {
    width: '100%', height: '60px', borderRadius: '30px',
    border: `1.5px solid ${COLORS.primary}`, padding: '0 25px',
    fontSize: '16px', outline: 'none', backgroundColor: 'white',
    boxSizing: 'border-box', color: '#333', fontFamily: 'inherit'
  }
};

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
    marginBottom: 20, 
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
  submitButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  submitButtonText: { color: 'white', fontSize: 22, fontWeight: '600' },
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