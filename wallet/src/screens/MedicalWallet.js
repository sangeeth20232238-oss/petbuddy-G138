import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, Alert, StatusBar 
} from 'react-native';
import { 
  ChevronLeft, Syringe, Pill, Cpu, 
  Stethoscope, Home, User, MessageSquare 
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Added useLocalSearchParams
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

// Internal Component for the Grid Items
const CategoryCard = ({ icon: Icon, title, count, onPress }) => (
  <TouchableOpacity style={styles.navCard} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon color={COLORS.primary} size={42} strokeWidth={1.5} />
    </View>
    <Text style={styles.cardText}>{title}</Text>
    {count !== undefined && <Text style={styles.countText}>{count} Records</Text>}
  </TouchableOpacity>
);

export default function MedicalWallet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const params = useLocalSearchParams();
  const petName = params.name || "Bunny"; 
  const petId = params.id || "2045288AE";

  const [loading, setLoading] = useState(false);

  // Navigation Handlers for the Grid
  const navigateTo = (path) => {
    router.push({
      pathname: path,
      params: { name: petName, id: petId } // Pass data forward
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header & Profile Section */}
      <View style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#333" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Wallet</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            {/* UPDATED: Displays dynamic name and ID */}
            <Text style={styles.petName}>{petName}</Text>
            <Text style={styles.petId}>ID : {petId}</Text>
          </View>
        </View>
      </View>

      {/* Grid Menu */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <CategoryCard 
            icon={Syringe} 
            title="Vaccinations" 
            onPress={() => navigateTo('/vaccination-list')}
          />
          <CategoryCard 
            icon={Pill} 
            title="Prescriptions" 
            onPress={() => navigateTo('/prescription-list')}
          />
        </View>
        <View style={styles.row}>
          <CategoryCard 
            icon={Cpu} 
            title="Microchip ID" 
            onPress={() => navigateTo('/microchip-details')}
          />
          <CategoryCard 
            icon={Stethoscope} 
            title="Vet Visits" 
            onPress={() => navigateTo('/vet-visit-list')}
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomTab, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity onPress={() => router.push('/')}><Home color={COLORS.primary} size={28} /></TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <MessageSquare color="white" size={30} fill="white" />
        </TouchableOpacity>
        <TouchableOpacity><User color={COLORS.primary} size={28} /></TouchableOpacity>
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
    paddingBottom: 35,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#444' },
  backButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 6,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#FFF'
  },
  profileInfo: { marginLeft: 15 },
  petName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  petId: { color: 'white', fontSize: 14, opacity: 0.85, marginTop: 4 },
  
  gridContainer: { paddingHorizontal: 20, marginTop: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  navCard: {
    backgroundColor: 'white',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: { marginBottom: 10 },
  cardText: { fontSize: 16, fontWeight: '600', color: '#444' },
  countText: { fontSize: 12, color: '#888', marginTop: 4 },

  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#EEE'
  },
  fab: {
    backgroundColor: COLORS.primary,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    elevation: 5,
  }
});