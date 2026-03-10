import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ActivityIndicator, useWindowDimensions, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, Syringe, Pill, Cpu, 
  Stethoscope, MessageSquare 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';

// 1. Firebase Imports - Ensuring we use Firestore instead of localhost
import { db } from '../src/services/firebaseConfig';
import { doc, onSnapshot } from "firebase/firestore";

const CategoryCard = ({ icon: Icon, title, width, onPress }) => (
  <TouchableOpacity 
    style={[styles.navCard, { width }]} 
    activeOpacity={0.7}
    onPress={onPress} 
  >
    <View style={styles.iconContainer}>
      <Icon color={COLORS.primary} size={38} strokeWidth={1.5} />
    </View>
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

export default function MedicalWallet() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  
  // Default data in case Firebase document hasn't been created yet
  const [petData, setPetData] = useState({ id: "2045288AE", name: "Bunny" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** * FIXED: Removed http://localhost:3000 fetch.
     * We now listen directly to Bunny's profile in Firestore.
     * Document Path: pets/bunny_profile
     */
    const petDocRef = doc(db, "pets", "bunny_profile");
    
    const unsubscribe = onSnapshot(petDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setPetData({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such pet profile found in Firestore. Using defaults.");
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Profile Listener Error: ", error);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const cardSize = (width - 60) / 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft color="#333" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medical Wallet</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.profileInfo}>
              <Text style={styles.petName}>{petData?.name}</Text>
              <Text style={styles.petId}>ID : {petData?.id || "N/A"}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Grid Menu */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <CategoryCard 
            icon={Syringe} 
            title="Vaccinations" 
            width={cardSize} 
            onPress={() => router.push('/vaccination-details')} 
          />
          <CategoryCard 
            icon={Pill} 
            title="Prescriptions" 
            width={cardSize} 
            onPress={() => router.push('/prescription-list')} 
          />
        </View>
        <View style={styles.row}>
          <CategoryCard 
            icon={Cpu} 
            title="Microchip ID" 
            width={cardSize} 
            onPress={() => router.push('/microchip-details')} 
          />
          <CategoryCard 
            icon={Stethoscope} 
            title="Vet Visits" 
            width={cardSize} 
            onPress={() => router.push('/vet-visit-list')} 
          />
        </View>
      </View>

      {/* Centered Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: {
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#333' },
  backButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#E0E0E0', borderWidth: 2, borderColor: '#FFF'
  },
  profileInfo: { marginLeft: 15 },
  petName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  petId: { color: 'white', fontSize: 13, opacity: 0.9 },
  gridContainer: { paddingHorizontal: 20, marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  navCard: {
    backgroundColor: 'white', aspectRatio: 1,
    borderRadius: 25, justifyContent: 'center', alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: { marginBottom: 10 },
  cardText: { fontSize: 16, fontWeight: '600', color: '#444' },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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