import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, ScrollView, ActivityIndicator, Alert, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Cpu, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- THEME & CONFIG IMPORTS ---
import { COLORS } from '../src/theme/colors';
import { db } from '../src/services/firebaseConfig';
import { doc, onSnapshot, setDoc } from "firebase/firestore";

/**
 * Reusable Sub-component: InfoBox
 * Purpose: Displays an information field that toggles between 
 * a display label/value and an active input field.
 */
const InfoBox = ({ label, value, isEditing, onChangeText, placeholder, isDate, onDatePress }) => (
  <View style={styles.infoBox}>
    {/* Field Label */}
    <Text style={styles.boxLabel}>{label}</Text>
    
    {isEditing ? (
      /* --- ACTIVE EDITING STATE --- */
      isDate ? (
        /* Date field triggers the system calendar instead of keyboard */
        <TouchableOpacity style={styles.dateTrigger} onPress={onDatePress}>
          <Text style={[styles.boxInput, !value && { color: '#999' }]}>
            {value || placeholder}
          </Text>
          <Calendar size={18} color={COLORS.primary} />
        </TouchableOpacity>
      ) : (
        /* Standard text input for ID, Location, and Vet name */
        <TextInput 
          style={styles.boxInput} 
          value={value} 
          onChangeText={onChangeText} 
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      )
    ) : (
      /* --- READ-ONLY DISPLAY STATE --- */
      <Text style={styles.boxValue}>{value || `No ${label} Provided`}</Text>
    )}
  </View>
);

export default function MicrochipID() {
  const router = useRouter();

  // --- COMPONENT STATE ---
  const [isEditing, setIsEditing] = useState(false); // Controls toggle between view and edit modes
  const [loading, setLoading] = useState(true);     // Controls initial data fetch spinner
  
  // DATE PICKER INTERNAL STATE
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPickerDate, setCurrentPickerDate] = useState(new Date());

  // DATA STATE: Local copy of Firestore record
  const [chipData, setChipData] = useState({
    id: "",
    dateImplanted: "",
    location: "",
    vet: ""
  });

  /**
   * HOOK: useEffect (Data Synchronization)
   * Establishes a real-time listener to Firestore. 
   * Updates UI immediately if data is changed elsewhere.
   */
  useEffect(() => {
    // Reference to the specific pet's microchip document
    const docRef = doc(db, "microchips", "bunny_chip");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Map Firestore data to local state
        setChipData(docSnap.data());
      } else {
        // Fallback to empty strings if no record exists yet
        setChipData({ id: "", dateImplanted: "", location: "", vet: "" });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Fetch Error:", error);
      setLoading(false);
    });

    // Cleanup: Remove listener when user leaves the screen
    return () => unsubscribe();
  }, []);

  /**
   * HANDLER: onDateChange
   * Triggered when the user picks a date from the native calendar.
   */
  const onDateChange = (event, selectedDate) => {
    // Close picker for Android immediately; keep open for iOS modal style
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setCurrentPickerDate(selectedDate);
      // Format date to: "18 Feb 2026"
      const formatted = selectedDate.getDate() + ' ' + 
                        selectedDate.toLocaleString('default', { month: 'short' }) + ' ' + 
                        selectedDate.getFullYear();
      setChipData({ ...chipData, dateImplanted: formatted });
    }
  };

  /**
   * HANDLER: handleSave
   * Pushes local changes to Firestore using setDoc with merge:true 
   * to ensure fields are created if they don't exist.
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "microchips", "bunny_chip");
      await setDoc(docRef, chipData, { merge: true });
      setIsEditing(false); // Switch back to view mode
      Alert.alert("Success", "Microchip Registry Updated!");
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Update failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOADING RENDER ---
  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER & PROFILE CARD --- */}
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top']}>
          {/* Back button and title */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color="#333" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Microchip ID</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Visual Profile Card for the pet */}
          <View style={styles.profileCard}>
            <View style={styles.chipIconBox}>
              <Cpu color="#FFB380" size={40} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.petName}>Bunny</Text>
              <Text style={styles.petStatus}>Registered Profile</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* --- DATA FIELDS SECTION --- */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Microchip ID */}
        <InfoBox 
          label="Microchip ID Number" 
          value={chipData.id} 
          placeholder="Enter ID Number"
          isEditing={isEditing}
          onChangeText={(text) => setChipData({...chipData, id: text})}
        />
        
        {/* Date Selection */}
        <InfoBox 
          label="Date Implanted" 
          value={chipData.dateImplanted} 
          placeholder="Select Date"
          isEditing={isEditing}
          isDate={true}
          onDatePress={() => setShowDatePicker(true)}
        />

        {/* Hidden Native Picker (rendered only on trigger) */}
        {showDatePicker && (
          <DateTimePicker
            value={currentPickerDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Implant Site */}
        <InfoBox 
          label="Implant Location" 
          value={chipData.location} 
          placeholder="e.g. Between Shoulder Blades"
          isEditing={isEditing}
          onChangeText={(text) => setChipData({...chipData, location: text})}
        />
        
        {/* Vet Name */}
        <InfoBox 
          label="Implanted by Vet" 
          value={chipData.vet} 
          placeholder="Enter Vet Name"
          isEditing={isEditing}
          onChangeText={(text) => setChipData({...chipData, vet: text})}
        />

        {/* PRIMARY ACTION BUTTON (Toggle Edit/Save) */}
        <TouchableOpacity 
          style={[styles.editBtn, isEditing && { backgroundColor: '#4CAF50' }]} 
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={styles.editBtnText}>
            {isEditing ? "Save Registry Info" : "Edit Registry Info"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- FLOATING SUPPORT ACTION BUTTON --- */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header with custom curvature
  headerBackground: { 
    backgroundColor: COLORS.cardBg, 
    borderBottomLeftRadius: 45, 
    borderBottomRightRadius: 45, 
    paddingHorizontal: 25, 
    paddingBottom: 30 
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  backButton: { backgroundColor: '#FFF', borderRadius: 12, padding: 8 },

  // Profile Branding Card
  profileCard: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    flexDirection: 'row', 
    padding: 20, 
    alignItems: 'center' 
  },
  chipIconBox: { 
    width: 70, 
    height: 70, 
    borderRadius: 15, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileInfo: { marginLeft: 15 },
  petName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  petStatus: { color: 'white', fontSize: 13, opacity: 0.9 },

  // Content area
  content: { padding: 25, paddingBottom: 150 },
  infoBox: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 15, 
    borderWidth: 1.5, 
    borderColor: COLORS.primary 
  },
  boxLabel: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  boxValue: { fontSize: 18, color: '#333', marginTop: 4, fontWeight: '600' },
  boxInput: { 
    fontSize: 18, 
    color: COLORS.primary, 
    marginTop: 4, 
    fontWeight: '600', 
    flex: 1 
  },
  dateTrigger: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.primary 
  },

  // Buttons
  editBtn: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    elevation: 5 
  },
  editBtnText: { color: 'white', fontSize: 20, fontWeight: 'bold' },

  // FAB Position
  fabContainer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  fab: { 
    backgroundColor: COLORS.primary, 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10 
  },
});