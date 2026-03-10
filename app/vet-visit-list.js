import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  StatusBar, ActivityIndicator 
} from 'react-native';
// useSafeAreaInsets provides exact pixel values for notches and status bars
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, ChevronRight, MessageSquare, Stethoscope } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';

// --- FIREBASE IMPORTS ---
import { db } from '../src/services/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * Screen: VetVisitList
 * Purpose: Displays a real-time list of historical vet visits from Firestore.
 */
export default function VetVisitList() {
  const router = useRouter(); // Access the expo-router for navigation logic
  const insets = useSafeAreaInsets(); // FIX: Retrieves top/bottom padding values for notches
  
  const [visits, setVisits] = useState([]); // State to hold the array of visit documents
  const [loading, setLoading] = useState(true); // State to manage the initial loading spinner

  /**
   * HOOK: useEffect
   * Purpose: Sets up a real-time subscription to the 'vet_visits' collection.
   * Sorting: Orders by the 'createdAt' timestamp descending (most recent first).
   */
  useEffect(() => {
    // 1. Define the query pointing to the 'vet_visits' collection
    const q = query(collection(db, "vet_visits"), orderBy("createdAt", "desc"));
    
    // 2. Set up the listener. 'onSnapshot' updates the UI immediately if data changes in the DB.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Mapping the Firestore document snapshots into a standard JS array
      const visitsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setVisits(visitsData);
      setLoading(false); // Stop showing the spinner once data is fetched
    }, (error) => {
      console.error("Firestore Listener Error:", error);
      setLoading(false);
    });

    // 3. Cleanup: Unsubscribe from the listener when the user navigates away
    return () => unsubscribe();
  }, []);

  /**
   * HANDLER: handleRecordPress
   * Navigates to the detailed view of a specific visit.
   * Mapping: We pass the 'type' to help the Details screen switch UI styles.
   */
  const handleRecordPress = (item) => {
    router.push({
      pathname: '/record-details',
      params: { 
        id: item.id, 
        type: 'vet_visits', // Tells RecordDetails to show the Vet Visit style UI
        title: item.clinicName, 
        date: item.visitDate || 'No date set',
        reason: item.reason 
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Ensures status bar icons are dark to match the light theme */}
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER SECTION --- 
          Applied dynamic paddingTop using 'insets' to clear the phone's notch.
      */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          {/* Back Button navigation */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Vet Visits</Text>
          
          {/* Invisible balancer view */}
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ADD VISIT BUTTON */}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-vet-visit')}>
          <Plus color="white" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Record New Visit</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>History</Text>

        {/* LIST RENDERING */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : visits.length === 0 ? (
          <Text style={styles.emptyText}>No visits recorded yet.</Text>
        ) : (
          visits.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.recordCard}
              onPress={() => handleRecordPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardInfo}>
                {/* Visual Icon with soft background */}
                <View style={styles.iconCircle}>
                  <Stethoscope size={20} color={COLORS.primary} />
                </View>
                
                <View>
                  <Text style={styles.recordTitle}>{item.clinicName}</Text>
                  <Text style={styles.recordDate}>{item.visitDate || 'No date set'}</Text>
                </View>
              </View>
              
              <View style={styles.arrowCircle}>
                <ChevronRight size={20} color="#333" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* --- FLOATING ACTION BUTTON (FAB) --- 
          Bottom positioning adjusted by 'insets' to clear home indicator bars.
      */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5
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