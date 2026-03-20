import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar, BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Syringe, Pill, Cpu, Stethoscope } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

import VaccinationList from '../features/pet-wallet/vaccination-list';
import PrescriptionList from '../features/pet-wallet/prescription-list';
import MicrochipDetails from '../features/pet-wallet/microchip-details';
import VetVisitList from '../features/pet-wallet/vet-visit-list';
import AddVaccination from '../features/pet-wallet/add-vaccination';
import AddPrescription from '../features/pet-wallet/add-prescription';
import AddVetVisit from '../features/pet-wallet/add-vet-visit';
import EditVaccination from '../features/pet-wallet/edit-vaccination';
import EditPrescription from '../features/pet-wallet/edit-prescription';
import EditVetVisit from '../features/pet-wallet/edit-vet-visit';
import RecordDetails from '../features/pet-wallet/record-details';

import { db } from '../services/firebaseConfig';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CategoryCard = ({ icon: Icon, title, onPress }) => (
  <TouchableOpacity style={styles.navCard} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon color={COLORS.primary} size={38} strokeWidth={1.5} />
    </View>
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

export default function MedicalWallet({ navigation }) {
  const [petData, setPetData] = useState({ id: '2045288AE', name: 'Bunny' });
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('main');
  const [navigationParams, setNavigationParams] = useState({});

  const navigate = (view, params = {}) => {
    setCurrentView(view);
    setNavigationParams(params);
  };

  const goBack = () => {
    setCurrentView('main');
    setNavigationParams({});
  };

  useEffect(() => {
    const backAction = () => {
      if (currentView !== 'main') { goBack(); return true; }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentView]);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'pets'), 
      where('ownerId', '==', auth.currentUser.uid), 
      limit(1)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setPetData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setPetData({ name: 'My Pet', id: 'Not Registered' });
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (currentView === 'vaccinations') return <VaccinationList onBack={goBack} navigate={navigate} />;
  if (currentView === 'prescriptions') return <PrescriptionList onBack={goBack} navigate={navigate} />;
  if (currentView === 'microchip') return <MicrochipDetails onBack={goBack} navigate={navigate} />;
  if (currentView === 'vetvisits') return <VetVisitList onBack={goBack} navigate={navigate} />;
  if (currentView === 'add-vaccination') return <AddVaccination onBack={goBack} navigate={navigate} />;
  if (currentView === 'add-prescription') return <AddPrescription onBack={goBack} navigate={navigate} />;
  if (currentView === 'add-vet-visit') return <AddVetVisit onBack={goBack} navigate={navigate} />;
  if (currentView === 'edit-vaccination') return <EditVaccination onBack={goBack} navigate={navigate} params={navigationParams} />;
  if (currentView === 'edit-prescription') return <EditPrescription onBack={goBack} navigate={navigate} params={navigationParams} />;
  if (currentView === 'edit-vet-visit') return <EditVetVisit onBack={goBack} navigate={navigate} params={navigationParams} />;
  if (currentView === 'record-details') return <RecordDetails onBack={goBack} navigate={navigate} params={navigationParams} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerBackground}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Wallet</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.petName}>{petData?.name}</Text>
            <Text style={styles.petId}>ID: {petData?.id}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <CategoryCard icon={Syringe} title="Vaccinations" onPress={() => navigate('vaccinations')} />
          <CategoryCard icon={Pill} title="Prescriptions" onPress={() => navigate('prescriptions')} />
        </View>
        <View style={styles.row}>
          <CategoryCard icon={Cpu} title="Microchip ID" onPress={() => navigate('microchip')} />
          <CategoryCard icon={Stethoscope} title="Vet Visits" onPress={() => navigate('vetvisits')} />
        </View>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: {
    backgroundColor: COLORS.cardBg || '#FFF0E8',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#333' },
  backButton: { backgroundColor: '#FFF', borderRadius: 12, padding: 8, elevation: 2 },
  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 25, flexDirection: 'row',
    padding: 20, alignItems: 'center', elevation: 8,
  },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0E0E0', borderWidth: 2, borderColor: '#FFF' },
  profileInfo: { marginLeft: 15 },
  petName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  petId: { color: 'white', fontSize: 13, opacity: 0.9, marginTop: 4 },
  gridContainer: { paddingHorizontal: 20, marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  navCard: {
    backgroundColor: 'white', width: '47%', aspectRatio: 1,
    borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4,
  },
  iconContainer: { marginBottom: 10 },
  cardText: { fontSize: 16, fontWeight: '600', color: '#444' },
});
