import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, ActivityIndicator, Image, Platform 
} from 'react-native';
import { ChevronLeft, Plus, ChevronRight, MessageSquare, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../theme/colors';

// --- FIREBASE IMPORTS ---
import { db } from '../../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * Reusable Component: RecordCard
 * Renders an entry in the list with an image thumbnail or a fallback icon.
 */
const RecordCard = ({ title, date, imageUri, onPress }) => (
  <TouchableOpacity style={styles.recordCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.recordMain}>
      {/* THUMBNAIL PREVIEW: Shows pet's vaccine document if it exists */}
      <View style={styles.attachmentPreview}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderIcon}>
            <FileText size={20} color="#AAA" />
          </View>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.recordTitle}>{title}</Text>
        <Text style={styles.recordDate}>{date}</Text>
      </View>
    </View>

    {/* Right-side circle with chevron icon */}
    <View style={styles.arrowCircle}>
      <ChevronRight size={20} color="#333" />
    </View>
  </TouchableOpacity>
);

export default function VaccinationDetails() {
  const router = useRouter(); 
  
  // --- STATE MANAGEMENT ---
  const [vaccinations, setVaccinations] = useState([]); // List of vaccines from DB
  const [loading, setLoading] = useState(true);          // Loading spinner state

  /**
   * HOOK: useEffect
   * Sets up a real-time listener to Firestore.
   * Ensures the list updates immediately when a vaccine is added or edited.
   */
  useEffect(() => {
    // Query: collection 'vaccinations' ordered by newest first
    const q = query(collection(db, "vaccinations"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      setVaccinations(records);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Listener Error:", error);
      setLoading(false);
    });

    // Cleanup: Stops listening when user navigates away
    return () => unsubscribe();
  }, []);

  /**
   * HANDLER: handleRecordPress
   * Navigates to details screen and passes the specific vaccine record.
   */
  const handleRecordPress = (record) => {
    router.push({
      pathname: '/record-details',
      params: { 
        id: record.id, 
        type: 'vaccinations',
        title: record.vaccineName, 
        date: record.dateTaken,
        pet: record.petName,
        dueDate: record.nextDueDate,
        image: record.imageUri 
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. STATUS BAR: Translucent allows background color to flow behind the bar */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.headerBackground}>
        {/* 2. ANDROID FIX: Using a View with paddingTop based on actual StatusBar height */}
        <View style={styles.androidSafeHeader}>
          <View style={styles.headerRow}>
            {/* Back Button with hitSlop for easier clicking on small icons */}
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <ChevronLeft color="#333" size={24} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Vaccination Details</Text>
            
            {/* Spacer to balance the Flexbox header layout */}
            <View style={{ width: 40 }} /> 
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACTION BUTTON: Add New Record */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-vaccination')}
        >
          <Plus color="white" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Add New Vaccination</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Existing Record</Text>

        {/* LIST RENDERING */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : vaccinations.length === 0 ? (
          <Text style={styles.emptyText}>No records found. Click add to start!</Text>
        ) : (
          vaccinations.map((item) => (
            <RecordCard 
              key={item.id}
              title={item.vaccineName} 
              date={item.dateTaken} 
              imageUri={item.imageUri} 
              onPress={() => handleRecordPress(item)} 
            />
          ))
        )}
      </ScrollView>

      {/* --- FLOATING CHAT BUTTON --- */}
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
  
  headerBackground: {
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },

  // This creates the space needed for the Android Status Bar
  androidSafeHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight + 10) : 50,
  },

  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },

  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },

  backButton: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  content: { padding: 25, paddingBottom: 150 }, // Padding for floating chat button
  
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 40,
    elevation: 4,
  },

  addButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },

  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 20 },
  
  recordCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
  },

  recordMain: { flexDirection: 'row', alignItems: 'center' },
  
  attachmentPreview: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderIcon: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  
  textContainer: { justifyContent: 'center' },
  recordTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
  recordDate: { fontSize: 13, color: '#888', marginTop: 3 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },

  fab: {
    backgroundColor: COLORS.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  }
});