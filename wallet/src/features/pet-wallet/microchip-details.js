import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Cpu, Edit, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../theme/colors';

// Firebase imports
import { db, auth } from '../../services/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function MicrochipDetails({ onBack }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [isEditing, setIsEditing] = useState(false);
  const [chipId, setChipId] = useState('');
  const [petName, setPetName] = useState('');
  const [implantDate, setImplantDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [registry, setRegistry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMicrochipData = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'microchip', 'details');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setChipId(data.chipId || '');
          setPetName(data.petName || '');
          setImplantDate(data.implantDate || '');
          setVeterinarian(data.veterinarian || '');
          setRegistry(data.registry || '');
        }
      } catch (error) {
        console.error('Error loading microchip data:', error);
      }
    };

    loadMicrochipData();
  }, []);

  const handleSave = async () => {
    if (!chipId.trim()) {
      Alert.alert('Error', 'Please enter a chip ID');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'microchip', 'details'), {
        chipId: chipId.trim(),
        petName: petName.trim(),
        implantDate: implantDate.trim(),
        veterinarian: veterinarian.trim(),
        registry: registry.trim(),
        updatedAt: new Date()
      });
      
      Alert.alert('Success', 'Microchip details saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving microchip:', error);
      Alert.alert('Error', 'Failed to save microchip details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Microchip Details</Text>
          <TouchableOpacity 
            onPress={isEditing ? handleSave : () => setIsEditing(true)} 
            style={styles.editButton}
            disabled={loading}
          >
            {isEditing ? <Save color={COLORS.primary} size={20} /> : <Edit color={COLORS.primary} size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chipCard}>
          <View style={styles.chipIcon}>
            <Cpu size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.chipTitle}>Microchip Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Chip ID:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={chipId}
                onChangeText={setChipId}
                placeholder="Enter chip ID"
              />
            ) : (
              <Text style={styles.value}>{chipId || 'Not set'}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pet Name:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={petName}
                onChangeText={setPetName}
                placeholder="Enter pet name"
              />
            ) : (
              <Text style={styles.value}>{petName || 'Not set'}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Implant Date:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={implantDate}
                onChangeText={setImplantDate}
                placeholder="Enter implant date"
              />
            ) : (
              <Text style={styles.value}>{implantDate || 'Not set'}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Veterinarian:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={veterinarian}
                onChangeText={setVeterinarian}
                placeholder="Enter veterinarian name"
              />
            ) : (
              <Text style={styles.value}>{veterinarian || 'Not set'}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registry:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={registry}
                onChangeText={setRegistry}
                placeholder="Enter registry name"
              />
            ) : (
              <Text style={styles.value}>{registry || 'Not set'}</Text>
            )}
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Important Note</Text>
          <Text style={styles.noteText}>
            Keep this microchip information updated with your current contact details. 
            This helps ensure your pet can be returned to you if lost.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab}>
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
    paddingBottom: 25,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  backButton: { backgroundColor: '#FFF', borderRadius: 12, padding: 8, elevation: 2 },
  editButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    elevation: 2
  },
  content: { padding: 25, paddingBottom: 150 },
  chipCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 20
  },
  chipIcon: { marginBottom: 15 },
  chipTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 25 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  label: { fontSize: 16, color: '#666', fontWeight: '500' },
  value: { fontSize: 16, color: '#333', fontWeight: '600' },
  editInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    minWidth: 120,
    textAlign: 'right'
  },
  noteCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary
  },
  noteTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  noteText: { fontSize: 14, color: '#666', lineHeight: 20 },
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