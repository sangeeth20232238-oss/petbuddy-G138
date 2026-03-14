// Screen 1 - Home Screen: Emergency button + Recent Alerts
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AlertCard from '../../components/AlertCard';
import BottomTabBar from '../../components/BottomTabBar';
import { LostPetAlert, getRecentAlerts } from '../../backend/alertService';
import styles from './homeStyles';

// Mock data for demo (used when Firebase is not configured)
const MOCK_ALERTS: LostPetAlert[] = [
  {
    id: '1',
    ownerName: 'Name of owner',
    petName: 'Goldy',
    phoneNumber: '0771234567',
    species: 'Dog',
    breed: 'Golden Retriever',
    color: 'Golden',
    collar: 'Red',
    lostDate: '11.10.2025',
    location: 'Colombo 06',
    description: 'This is my Lost Pet named Goldy!',
    additionalDescription: 'A friendly golden retriever, very playful and responds to the name Goldy.',
    imageUrl: '',
    likes: 1000,
    comments: 24,
  },
  {
    id: '2',
    ownerName: 'Name of owner',
    petName: 'Max',
    phoneNumber: '0779876543',
    species: 'Dog',
    breed: 'Labrador',
    color: 'Brown',
    collar: 'Blue',
    lostDate: '11.10.2025',
    location: 'Colombo 03',
    description: 'This is my Lost Pet named Max!',
    additionalDescription: 'Brown labrador with blue collar, very gentle.',
    imageUrl: '',
    likes: 850,
    comments: 15,
  },
  {
    id: '3',
    ownerName: 'Name of owner',
    petName: 'Luna',
    phoneNumber: '0778885555',
    species: 'Cat',
    breed: 'Persian',
    color: 'White',
    collar: 'Pink',
    lostDate: '12.10.2025',
    location: 'Colombo 07',
    description: 'This is my Lost Pet named Luna!',
    additionalDescription: 'White persian cat with pink collar.',
    imageUrl: '',
    likes: 620,
    comments: 10,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState<LostPetAlert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentAlerts();
      if (data.length > 0) {
        setAlerts(data);
      }
    } catch (err) {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const renderAlertCard = ({ item }: { item: LostPetAlert }) => (
    <AlertCard
      alert={item}
      variant="compact"
      onPress={() => navigation.navigate('AlertDetail', { alertId: item.id, alert: item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet SOS</Text>
        </View>

        {/* Hero Section with Pet Illustrations + Emergency Button */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            {/* Pet Banner Placeholder */}
            <View style={styles.petBannerPlaceholder}>
              <Text style={styles.petEmoji}>🐶</Text>
              <Text style={styles.petEmoji}>🐕</Text>
              <Text style={styles.petEmoji}>🐱</Text>
            </View>

            {/* Paw Icon */}
            <Ionicons name="paw" size={28} color="#8B5E3C" style={styles.pawIcon} />

            {/* Emergency Button */}
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => navigation.navigate('CreatePost')}
              activeOpacity={0.8}
            >
              <Ionicons name="megaphone" size={36} color="#E87A3A" style={styles.emergencyIcon} />
            </TouchableOpacity>
            <Text style={styles.emergencyText}>LOST PET ?</Text>
          </View>
        </View>

        {/* Recent Alerts Section */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#E87A3A" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={alerts}
            renderItem={renderAlertCard}
            keyExtractor={(item) => item.id || Math.random().toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alertsRow}
          />
        )}

        {/* See All Button */}
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('AllAlerts')}
        >
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
