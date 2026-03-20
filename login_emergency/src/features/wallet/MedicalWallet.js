import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ActivityIndicator, useWindowDimensions, StatusBar, Platform, BackHandler, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, Syringe, Pill, Cpu, 
  Stethoscope, MessageSquare, Camera, User 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../src/theme/colors';

// Import all components directly
import VaccinationList from '../src/features/pet-wallet/vaccination-list';
import PrescriptionList from '../src/features/pet-wallet/prescription-list';
import MicrochipDetails from '../src/features/pet-wallet/microchip-details';
import VetVisitList from '../src/features/pet-wallet/vet-visit-list';
import AddVaccination from '../src/features/pet-wallet/add-vaccination';
import AddPrescription from '../src/features/pet-wallet/add-prescription';
import AddVetVisit from '../src/features/pet-wallet/add-vet-visit';
import EditVaccination from '../src/features/pet-wallet/edit-vaccination';
import EditPrescription from '../src/features/pet-wallet/edit-prescription';
import EditVetVisit from '../src/features/pet-wallet/edit-vet-visit';
import RecordDetails from '../src/features/pet-wallet/record-details';

// 1. Firebase Imports - Ensuring we use Firestore instead of localhost
import { db } from '../src/services/firebaseConfig';
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";

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
  const [currentView, setCurrentView] = useState('main');
  const [navigationParams, setNavigationParams] = useState({});

  // Navigation helper function
  const navigate = (view, params = {}) => {
    setCurrentView(view);
    setNavigationParams(params);
  };

  // Go back function
  const goBack = () => {
    setCurrentView('main');
    setNavigationParams({});
  };

  const handleImagePick = async () => {
    Alert.alert(
      'Select Pet Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: () => pickImage('camera')
        },
        { 
          text: 'Gallery', 
          onPress: () => pickImage('gallery')
        }
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      // Request permissions first
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Camera permission is required to take photos.');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
          return;
        }
      }

      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        await updatePetImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', `Failed to select image: ${error.message}`);
    }
  };

  const updatePetImage = async (imageUri) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      
      await updateDoc(userDocRef, {
        profilePic: imageUri,
        updatedAt: new Date()
      });
      
      // Update local state immediately
      setPetData(prev => ({ ...prev, profileImage: imageUri }));
      
      Alert.alert('Success', 'Pet photo updated successfully!');
    } catch (error) {
      console.error('Error updating pet image:', error);
      console.error('Error details:', error.message);
      Alert.alert('Error', `Failed to update pet photo: ${error.message}`);
    }
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentView !== 'main') {
        goBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior (close app)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentView]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('User pet data from Firebase:', data);
        setPetData({ 
          id: docSnap.id, 
          name: data.name || 'User',
          profileImage: data.profilePic || data.profileImage || null
        });
      } else {
        console.log("No user profile found in Firestore.");
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

  // Render different views based on currentView state
  if (currentView === 'vaccinations') {
    return <VaccinationList onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'prescriptions') {
    return <PrescriptionList onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'microchip') {
    return <MicrochipDetails onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'vetvisits') {
    return <VetVisitList onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'add-vaccination') {
    return <AddVaccination onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'add-prescription') {
    return <AddPrescription onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'add-vet-visit') {
    return <AddVetVisit onBack={goBack} navigate={navigate} />;
  }
  if (currentView === 'edit-vaccination') {
    return <EditVaccination onBack={goBack} navigate={navigate} params={navigationParams} />;
  }
  if (currentView === 'edit-prescription') {
    return <EditPrescription onBack={goBack} navigate={navigate} params={navigationParams} />;
  }
  if (currentView === 'edit-vet-visit') {
    return <EditVetVisit onBack={goBack} navigate={navigate} params={navigationParams} />;
  }
  if (currentView === 'record-details') {
    return <RecordDetails onBack={goBack} navigate={navigate} params={navigationParams} />;
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
            <TouchableOpacity 
              style={styles.avatarContainer} 
              onPress={handleImagePick}
              activeOpacity={0.7}
            >
              {petData?.profileImage ? (
                <>
                  <Image 
                    source={{ uri: petData.profileImage }} 
                    style={styles.avatarImage}
                    onError={(error) => {
                      console.log('Image load error:', error.nativeEvent.error);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', petData.profileImage);
                    }}
                  />
                  <View style={styles.cameraOverlay}>
                    <Camera size={12} color="#999" />
                  </View>
                </>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={30} color="#999" />
                  <Camera size={16} color="#999" style={styles.cameraIcon} />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.petName}>{petData?.name}</Text>
              <TouchableOpacity onPress={handleImagePick}>
                <Text style={styles.changePhotoText}>Tap to change photo</Text>
              </TouchableOpacity>
              {/* Debug info - remove this later */}
              {__DEV__ && (
                <Text style={styles.debugText}>
                  Image: {petData?.profileImage ? 'YES' : 'NO'}
                </Text>
              )}
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
            onPress={() => setCurrentView('vaccinations')} 
          />
          <CategoryCard 
            icon={Pill} 
            title="Prescriptions" 
            width={cardSize} 
            onPress={() => setCurrentView('prescriptions')} 
          />
        </View>
        <View style={styles.row}>
          <CategoryCard 
            icon={Cpu} 
            title="Microchip ID" 
            width={cardSize} 
            onPress={() => setCurrentView('microchip')} 
          />
          <CategoryCard 
            icon={Stethoscope} 
            title="Vet Visits" 
            width={cardSize} 
            onPress={() => setCurrentView('vetvisits')} 
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
  avatarContainer: {
    position: 'relative'
  },
  avatarImage: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    borderWidth: 2, 
    borderColor: '#FFF'
  },
  avatarPlaceholder: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#E0E0E0', 
    borderWidth: 2, 
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 2
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 2,
    elevation: 2
  },
  profileInfo: { marginLeft: 15, flex: 1 },
  petName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  changePhotoText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2
  },
  debugText: {
    color: 'white',
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2
  },
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