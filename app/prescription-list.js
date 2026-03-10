import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  StatusBar, ActivityIndicator 
} from 'react-native';
// useSafeAreaInsets handles dynamic padding for notches and status bars on modern devices
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, ChevronRight, MessageSquare, Pill } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';

// Firebase Imports: Importing the database and Firestore query tools
import { db } from '../src/services/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * REUSABLE COMPONENT: RecordCard
 * Renders an individual medication entry in the list with a consistent UI.
 */
const RecordCard = ({ title, dosage, onPress }) => (
  <TouchableOpacity style={styles.recordCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.cardInfo}>
      {/* Visual Icon for Medication with a branded circle background */}
      <View style={styles.iconCircle}>
        <Pill size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.recordTitle}>{title}</Text>
        <Text style={styles.recordDate}>{dosage}</Text>
      </View>
    </View>
    {/* Visual indicator (chevron) that the card is clickable */}
    <View style={styles.arrowCircle}>
      <ChevronRight size={20} color="#333" />
    </View>
  </TouchableOpacity>
);

export default function PrescriptionList() {
  const router = useRouter(); // Expo router hook for navigation
  const insets = useSafeAreaInsets(); // FIX: Dynamically handles the status bar / notch height
  
  // --- STATE MANAGEMENT ---
  const [prescriptions, setPrescriptions] = useState([]); // Stores the list of medication documents
  const [loading, setLoading] = useState(true); // Manages the loading state for the data fetch

  /**
   * HOOK: useEffect (Real-time Data Listener)
   * Sets up a real-time subscription to the 'prescriptions' collection.
   * Ensures the list reflects additions or deletions immediately without refreshing.
   */
  useEffect(() => {
    // Define query: sort by the server-side timestamp in descending order (newest first)
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "desc"));
    
    // onSnapshot creates a persistent websocket connection to Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Map Firestore docs into a clean array of objects including the ID
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(docs);
      setLoading(false); // Stop the spinner once data is received
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    // CLEANUP: Stop the listener when the user navigates away to save battery/data
    return () => unsubscribe();
  }, []);

  /**
   * HANDLER: handleRecordPress
   * Navigates to 'record-details' and passes the specific parameters required for the
   * Prescription UI style (hiding pet name, reports, etc.)
   */
  const handleRecordPress = (item) => {
    router.push({
      pathname: '/record-details',
      params: { 
        id: item.id, 
        type: 'prescriptions', // CRITICAL: This triggers the Prescription style in record-details.js
        title: item.medName, 
        dosage: item.dosage,
        date: item.startDate,    // Maps startDate to generic 'date' param
        endDate: item.endDate    // Passes the duration specific to prescriptions
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Set status bar icons to dark to ensure visibility on the off-white background */}
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION: 
          Uses insets.top to ensure the header starts below notches/camera holes. 
      */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Prescriptions</Text>
          
          {/* Empty balancer view to keep title centered via flex space-between */}
          <View style={{ width: 40 }} /> 
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACTION BUTTON: Entry point for adding new medication */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('/add-prescription')}
        >
          <Plus color="white" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Add New Prescription</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Active Medications</Text>

        {/* DATA RENDERING */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : prescriptions.length === 0 ? (
          <Text style={styles.emptyText}>No prescriptions added yet.</Text>
        ) : (
          prescriptions.map((item) => (
            <RecordCard 
              key={item.id}
              title={item.medName} 
              dosage={item.dosage} 
              onPress={() => handleRecordPress(item)} 
            />
          ))
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON (FAB): Centered bottom chat/AI button */}
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
  content: { padding: 25, paddingBottom: 150 },
  addButton: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 18, 
    borderRadius: 30, 
    marginBottom: 40, 
    elevation: 4 
  },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 20 },
  recordCard: { 
    backgroundColor: 'white', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 15, 
    elevation: 3 
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { backgroundColor: '#FFF0E6', padding: 10, borderRadius: 15, marginRight: 15 },
  recordTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  recordDate: { fontSize: 14, color: '#888', marginTop: 5 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  arrowCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
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