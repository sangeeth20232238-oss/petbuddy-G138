import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, ActivityIndicator, Image, Platform, Alert 
} from 'react-native';
import { Plus, ChevronRight, MessageSquare, FileText, Trash2, Edit } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

// --- FIREBASE IMPORTS ---
import { db } from '../../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

/**
 * Reusable Component: RecordCard
 * Renders an entry in the list with an image thumbnail or a fallback icon.
 */
const RecordCard = ({ title, date, imageUri, onPress, onDelete, onEdit, hasReport }) => (
  <TouchableOpacity style={styles.recordCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.recordMain}>
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
        {hasReport && (
          <View style={styles.reportBadge}>
            <FileText size={12} color={COLORS.primary} />
            <Text style={styles.reportText}>Report Available</Text>
          </View>
        )}
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

export default function VaccinationList({ onBack, navigate }) {
  // --- STATE MANAGEMENT ---
  const [vaccinations, setVaccinations] = useState([]); // List of vaccines from DB
  const [loading, setLoading] = useState(true);          // Loading spinner state

  /**
   * HOOK: useEffect
   * Sets up a real-time listener to Firestore.
   * Ensures the list updates immediately when a vaccine is added or edited.
   */
  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      setVaccinations([]);
      setLoading(false);
      return;
    }

    // Query: collection 'vaccinations' from user's subcollection
    const q = collection(db, "users", auth.currentUser.uid, "vaccinations");
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by newest first
      records.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
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

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this vaccination record?',
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
              await deleteDoc(doc(db, 'users', user.uid, 'vaccinations', id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (record) => {
    if (!record || !record.id) {
      Alert.alert('Error', 'Invalid record data');
      return;
    }
    
    navigate('edit-vaccination', { 
      id: record.id,
      vaccineName: record.vaccineName || '',
      dateTaken: record.dateTaken || new Date().toLocaleDateString(),
      nextDueDate: record.nextDueDate || new Date().toLocaleDateString(),
      imageUri: record.imageUri || null
    });
  };
  const handleRecordPress = (record) => {
    navigate('record-details', { 
      id: record.id, 
      type: 'vaccinations',
      title: record.vaccineName, 
      date: record.dateTaken,
      pet: record.petName,
      dueDate: record.nextDueDate,
      image: record.imageUri 
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. STATUS BAR: Translucent allows background color to flow behind the bar */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Standard Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vaccinations</Text>
      </View>

      <View style={styles.headerBackground}>
        {/* Profile/Pet info can go here if needed, keeping it consistent with MedicalWallet.js */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACTION BUTTON: Add New Record */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigate('add-vaccination')}
        >
          <Plus color="white" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Add New Vaccination</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Existing Records</Text>

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
              hasReport={!!item.imageUri}
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

// --- STYLESHEET ---
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
    paddingBottom: 25,
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
    minHeight: 80
  },

  recordMain: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  
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
  
  textContainer: { justifyContent: 'center', flex: 1, marginRight: 10 },
  recordTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
  recordDate: { fontSize: 13, color: '#888', marginTop: 3 },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  reportText: {
    fontSize: 10,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '500'
  },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  
  actionButtons: { 
    flexDirection: 'row', 
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80
  },
  editButton: {
    backgroundColor: '#FFF0E6',
    padding: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: '#FFE6E6',
    padding: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
});