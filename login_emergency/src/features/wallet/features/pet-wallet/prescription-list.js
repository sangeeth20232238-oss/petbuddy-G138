import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  StatusBar, ActivityIndicator, Alert 
} from 'react-native';
import { Plus, ChevronRight, MessageSquare, Pill, Trash2, Edit } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

// Firebase Imports: Importing the database and Firestore query tools
import { db } from '../../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * REUSABLE COMPONENT: RecordCard
 * Renders an individual medication entry in the list with a consistent UI.
 */
const RecordCard = ({ title, dosage, onPress, onDelete, onEdit }) => (
  <TouchableOpacity style={styles.recordCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.cardInfo}>
      <View style={styles.iconCircle}>
        <Pill size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.recordTitle}>{title}</Text>
        <Text style={styles.recordDate}>{dosage}</Text>
      </View>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Edit size={16} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Trash2 size={16} color="#FF4444" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function PrescriptionList({ onBack, navigate }) {
  // --- STATE MANAGEMENT ---
  const [prescriptions, setPrescriptions] = useState([]); // Stores the list of medication documents
  const [loading, setLoading] = useState(true); // Manages the loading state for the data fetch

  /**
   * HOOK: useEffect (Real-time Data Listener)
   * Sets up a real-time subscription to the 'prescriptions' collection.
   * Ensures the list reflects additions or deletions immediately without refreshing.
   */
  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    // Query: collection 'prescriptions' from user's subcollection
    const q = collection(db, "users", auth.currentUser.uid, "prescriptions");
    
    // onSnapshot creates a persistent websocket connection to Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
      setPrescriptions(docs);
      setLoading(false); // Stop the spinner once data is received
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    // CLEANUP: Stop the listener when the user navigates away to save battery/data
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this prescription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const auth = getAuth();
              const user = auth.currentUser;
              if (!user) return;
              await deleteDoc(doc(db, 'users', user.uid, 'prescriptions', id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          }
        }
      ]
    );
  };

  const handleRecordPress = (item) => {
    navigate('record-details', { 
      id: item.id, 
      type: 'prescriptions',
      title: item.medName, 
      medName: item.medName,
      dosage: item.dosage,
      date: item.startDate,
      startDate: item.startDate,
      endDate: item.endDate
    });
  };

  const handleEdit = (item) => {
    navigate('edit-prescription', { 
      id: item.id,
      medName: item.medName,
      dosage: item.dosage,
      startDate: item.startDate,
      endDate: item.endDate
    });
  };

  return (
    <View style={styles.container}>
      {/* Set status bar icons to dark to ensure visibility on the off-white background */}
      <StatusBar barStyle="dark-content" />
      
      {/* Standard Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescriptions</Text>
      </View>

      <View style={styles.headerBackground}>
        {/* Header background can be used for pet context if needed */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACTION BUTTON: Entry point for adding new medication */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigate('add-prescription')}
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
              onDelete={() => handleDelete(item.id)}
              onEdit={() => handleEdit(item)}
            />
          ))
        )}
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
    paddingBottom: 25 
  },
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
  actionButtons: { flexDirection: 'row', gap: 8 },
  editButton: {
    backgroundColor: '#FFF0E6',
    padding: 8,
    borderRadius: 12,
    elevation: 1
  },
  deleteButton: {
    backgroundColor: '#FFE6E6',
    padding: 8,
    borderRadius: 12,
    elevation: 1
  }
});