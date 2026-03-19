import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  StatusBar, ActivityIndicator, Platform, Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, ChevronRight, MessageSquare, Stethoscope, Trash2, Edit } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

// Firebase imports
import { db } from '../../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

const RecordCard = ({ title, date, veterinarian, onPress, onDelete, onEdit }) => (
  <TouchableOpacity style={styles.recordCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.cardInfo}>
      <View style={styles.iconCircle}>
        <Stethoscope size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.recordTitle}>{title}</Text>
        <Text style={styles.recordDate}>{date}</Text>
        {veterinarian && <Text style={styles.recordVet}>Dr. {veterinarian}</Text>}
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

export default function VetVisitList({ onBack, navigate }) {
  const insets = useSafeAreaInsets();
  
  const [vetVisits, setVetVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "vetVisits"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVetVisits(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRecordPress = (item) => {
    navigate('record-details', {
      id: item.id, 
      type: 'vetVisits',
      title: item.visitReason, 
      date: item.visitDate,
      veterinarian: item.veterinarian,
      notes: item.notes
    });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this vet visit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'vetVisits', id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    navigate('edit-vet-visit', {
      id: item.id,
      visitReason: item.visitReason,
      visitDate: item.visitDate,
      veterinarian: item.veterinarian,
      notes: item.notes
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vet Visits</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigate('add-vet-visit')}
        >
          <Plus color="white" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Add New Vet Visit</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Visit History</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : vetVisits.length === 0 ? (
          <Text style={styles.emptyText}>No vet visits recorded yet.</Text>
        ) : (
          vetVisits.map((item) => (
            <RecordCard 
              key={item.id}
              title={item.visitReason} 
              date={item.visitDate} 
              veterinarian={item.veterinarian}
              onPress={() => handleRecordPress(item)}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => handleEdit(item)}
            />
          ))
        )}
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
  recordVet: { fontSize: 12, color: '#666', marginTop: 2 },
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
  },
  fabContainer: { position: 'absolute', width: '100%', alignItems: 'center' },
  fab: { 
    backgroundColor: COLORS.primary, 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10 
  }
});