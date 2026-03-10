import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, Alert, ActivityIndicator, 
  Image, Modal, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Pencil, FileText, Trash2, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../src/theme/colors';

// Firebase Imports
import { db } from '../src/services/firebaseConfig';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * REUSABLE COMPONENT: EditableField
 * Renders a labeled input field that toggles between read-only and editable states.
 */
const EditableField = ({ label, value, onChangeText, isEditing, setIsEditing }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={[styles.fieldInput, isEditing && styles.activeInput]}
        value={value}
        onChangeText={onChangeText}
        editable={isEditing} // Prevents typing unless isEditing is true
        placeholder={`Enter ${label}`}
      />
      <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
        {/* Toggle icon color to green to indicate active editing state */}
        <Pencil size={20} color={isEditing ? "#4CAF50" : COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

export default function RecordDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // FIX: Dynamically handles the status bar / notch height
  const params = useLocalSearchParams(); // Accesses route parameters (id, type, etc.)
  
  // Logic to determine which record style to render
  const collectionName = params.type || "vaccinations";
  const isPrescription = collectionName === "prescriptions";
  const isVetVisit = collectionName === "vet_visits";

  // --- STATE MANAGEMENT ---
  // We initialize these with params passed from the previous list screen
  const [title, setTitle] = useState(params.title || params.clinicName || ""); 
  const [date, setDate] = useState(params.date || params.visitDate || "");   
  const [reason, setReason] = useState(params.reason || params.visitReason || "");
  const [dosage, setDosage] = useState(params.dosage || "");      
  const [endDate, setEndDate] = useState(params.endDate || "");    
  const [dueDate, setDueDate] = useState(params.dueDate || "");    
  const [imageUri] = useState(params.image || null);               

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Toggles the entire form's editability
  const [showModal, setShowModal] = useState(false); // Toggles the full-screen image viewer

  /**
   * DELETE LOGIC:
   * Handles permanent document removal from Firestore with platform-specific confirmations.
   */
  const handleDelete = async () => {
    const performDelete = async () => {
      setLoading(true);
      try {
        await deleteDoc(doc(db, collectionName, params.id));
        router.back(); // Navigate back on success
      } catch (error) {
        const errorMsg = "Delete failed. Check connection.";
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert("Error", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this permanently?")) await performDelete();
    } else {
      Alert.alert("Delete Record", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: performDelete }
      ]);
    }
  };

  /**
   * UPDATE LOGIC:
   * Maps current state variables back to the specific Firestore field names for each collection.
   */
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const recordRef = doc(db, collectionName, params.id);
      
      let updateData = {};
      if (isPrescription) {
        updateData = { medName: title, dosage, startDate: date, endDate };
      } else if (isVetVisit) {
        updateData = { clinicName: title, visitDate: date, reason };
      } else {
        updateData = { vaccineName: title, dateTaken: date, nextDueDate: dueDate };
      }

      await updateDoc(recordRef, updateData);
      Platform.OS === 'web' ? alert("Updated successfully!") : Alert.alert("Success", "Updated!");
      setIsEditing(false); // Return to read-only mode
    } catch (error) {
      Platform.OS === 'web' ? alert("Update failed") : Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* IMAGE VIEWER: For vaccination documents/reports */}
      {!isPrescription && (
        <Modal visible={showModal} transparent={false} animationType="fade">
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <X color="white" size={30} />
            </TouchableOpacity>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />
            ) : (
              <Text style={styles.noImageText}>No image available.</Text>
            )}
          </SafeAreaView>
        </Modal>
      )}

      {/* HEADER: Dynamic padding-top using insets handles the notch/status bar overlap */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {isPrescription ? "Prescription" : isVetVisit ? "Vet Visit" : "Vaccination"}
          </Text>

          <TouchableOpacity onPress={handleDelete} disabled={loading}>
            <Trash2 color="#FF4444" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* VIEW LOGIC: VET VISIT STYLE */}
        {isVetVisit ? (
          <>
            <EditableField label="Clinic Name" value={title} onChangeText={setTitle} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Visit Date" value={date} onChangeText={setDate} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Reason" value={reason} onChangeText={setReason} isEditing={isEditing} setIsEditing={setIsEditing} />
          </>
        ) 
        /* VIEW LOGIC: PRESCRIPTION STYLE */
        : isPrescription ? (
          <>
            <EditableField label="Medication" value={title} onChangeText={setTitle} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Dosage" value={dosage} onChangeText={setDosage} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Start Date" value={date} onChangeText={setDate} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="End Date" value={endDate} onChangeText={setEndDate} isEditing={isEditing} setIsEditing={setIsEditing} />
          </>
        ) 
        /* VIEW LOGIC: VACCINATION STYLE */
        : (
          <>
            <EditableField label="Vaccine Name" value={title} onChangeText={setTitle} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Date Taken" value={date} onChangeText={setDate} isEditing={isEditing} setIsEditing={setIsEditing} />
            <EditableField label="Next Due Date" value={dueDate} onChangeText={setDueDate} isEditing={isEditing} setIsEditing={setIsEditing} />
            
            <Text style={styles.label}>Reports</Text>
            <TouchableOpacity 
              style={styles.attachmentCard} 
              onPress={() => imageUri ? setShowModal(true) : alert("No document.")}
            >
              <View style={styles.attachmentLeft}>
                <View style={styles.fileIconBox}>
                  <FileText size={24} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.attachmentText}>View Report</Text>
                  <Text style={styles.attachmentSubtext}>{imageUri ? "Attached" : "None"}</Text>
                </View>
              </View>
              <Pencil size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </>
        )}

        {/* FOOTER ACTION: Switches between Enter-Edit-Mode and Save-Changes */}
        <TouchableOpacity 
          style={[styles.editBtn, isEditing && { backgroundColor: '#4CAF50' }]} 
          onPress={isEditing ? handleUpdate : () => setIsEditing(true)} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.editBtnText}>{isEditing ? "Save Changes" : "Edit Record"}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: 25, paddingBottom: 150 },
  fieldWrapper: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 10 },
  inputRow: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    ...Platform.select({
      web: { boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' },
      default: { elevation: 2 }
    })
  },
  fieldInput: { fontSize: 14, color: '#333', flex: 1 },
  activeInput: { color: COLORS.primary, fontWeight: 'bold' },
  attachmentCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 30,
    elevation: 2 
  },
  attachmentLeft: { flexDirection: 'row', alignItems: 'center' },
  fileIconBox: { backgroundColor: '#FFF0E6', padding: 10, borderRadius: 12, marginRight: 15 },
  attachmentText: { fontSize: 14, fontWeight: '600', color: '#333' },
  attachmentSubtext: { fontSize: 12, color: '#888' },
  editBtn: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 25, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 4
  },
  editBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  fullImage: { width: '100%', height: '100%' },
  noImageText: { color: 'white', fontSize: 18 }
});