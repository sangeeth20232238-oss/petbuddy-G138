// Screen 5 - Share/Notify Screen: Share with vets, community, social media
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import VetCard, { VetInfo } from '../../components/VetCard';
import { getAlertById, LostPetAlert } from '../../backend/alertService';
import styles from './shareNotifyStyles';

// Mock vet data
const MOCK_VETS: VetInfo[] = [
  {
    id: '1',
    name: 'Greenwood Vet Clinic',
    distance: '350 meters away',
    rating: 4.8,
    reviews: 182,
  },
  {
    id: '2',
    name: 'Central Animal Hospital',
    distance: '850 meters away',
    rating: 4.7,
    reviews: 164,
  },
  {
    id: '3',
    name: 'Paws & Care Clinic',
    distance: '1.8 miles',
    rating: 4.0,
    reviews: 336,
  },
  {
    id: '4',
    name: 'Happy Tails Veterinary',
    distance: '2.1 miles',
    rating: 4.0,
    reviews: 195,
  },
];

const ShareNotifyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { alertId } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVets, setSelectedVets] = useState<string[]>([]);
  const [alertData, setAlertData] = useState<LostPetAlert | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (alertId && alertId !== 'demo') {
      const fetchAlert = async () => {
        setLoading(true);
        const data = await getAlertById(alertId);
        if (data) setAlertData(data);
        setLoading(false);
      };
      fetchAlert();
    }
  }, [alertId]);

  const filteredVets = MOCK_VETS.filter((vet) =>
    vet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVetSelection = (vetId: string) => {
    setSelectedVets((prev) =>
      prev.includes(vetId) ? prev.filter((id) => id !== vetId) : [...prev, vetId]
    );
  };

  const handleShareWithVets = () => {
    Alert.alert(
      'Shared!',
      `Alert shared with ${selectedVets.length > 0 ? selectedVets.length : 'all'} nearby vets.`,
      [{ text: 'OK' }]
    );
  };

  const handleShareCommunity = () => {
    Alert.alert('Shared!', 'Alert shared with local community groups.', [{ text: 'OK' }]);
  };

  const handleShareSocial = async () => {
    console.log('handleShareSocial triggered');
    const petName = alertData?.petName || 'my pet';
    const location = alertData?.location || 'nearby area';
    const breeds = alertData?.breed || alertData?.species || 'Pet';
    
    const message = `🚨 LOST PET ALERT 🚨\n\nPlease help find ${petName}, a ${breeds} last seen at ${location}.\n\nIf you have any information, please contact the owner or tag us @_petbuddy_.\n\n#LostPet #PetSOS #_petbuddy_`;

    console.log('Sharing message:', message);

    try {
      const result = await Share.share({
        message: message,
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      console.error('Share Error:', error.message);
      Alert.alert('Share Error', error.message || 'Could not open share options.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: 'Fredoka-Bold' }]}>Pet SOS</Text>
        </View>

        {/* Nearby Vets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleBold}>Notifying Nearby Vets</Text>
          <Text style={styles.sectionSubtitle}>Post Shared with :</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#BBB"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="options-outline" size={18} color="#999" />
          </View>

          {/* Vet List */}
          <View style={styles.vetList}>
            {filteredVets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vet}
                onPress={() => toggleVetSelection(vet.id)}
              />
            ))}
          </View>

          {/* Share with Vets Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShareWithVets} activeOpacity={0.8}>
            <Text style={styles.shareButtonText}>Share with Vets</Text>
          </TouchableOpacity>
        </View>

        {/* Community Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleBold}>Notifying Community Groups</Text>
          <Text style={styles.sectionSubtitle}>Post Shared with :</Text>
          <TouchableOpacity style={styles.communityCard} onPress={handleShareCommunity} activeOpacity={0.8}>
            <Ionicons name="people-outline" size={24} color="#FFF" style={styles.communityIcon} />
            <Text style={styles.communityText}>Share to Local{'\n'}Community Groups</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleBold}>Social Media posts</Text>
          <View style={styles.connectedAccount}>
            <Ionicons name="logo-instagram" size={16} color="#E87A3A" />
            <Text style={styles.connectedText}>Connected to Instagram: @_petbuddy_</Text>
          </View>
          <TouchableOpacity 
            style={[styles.socialCard, loading && { opacity: 0.6 }]} 
            onPress={handleShareSocial} 
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" style={styles.socialIcon} />
            ) : (
              <Ionicons name="share-social-outline" size={24} color="#FFF" style={styles.socialIcon} />
            )}
            <Text style={styles.socialText}>Share to Social{'\n'}Media ?</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Dashboard')} 
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShareNotifyScreen;
