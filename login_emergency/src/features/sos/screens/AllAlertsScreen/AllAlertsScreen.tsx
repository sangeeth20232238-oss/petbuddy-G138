// Screen 2 - All Alerts Screen: Vertical list of all lost pet alerts
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AlertCard from '../../components/AlertCard';
import { LostPetAlert, getAllAlerts } from '../../backend/alertService';
import styles from './allAlertsStyles';

// Mock data for demo
const MOCK_ALERTS: LostPetAlert[] = [
  {
    id: '1',
    ownerName: 'Name of owner',
    petName: 'Tommy',
    phoneNumber: '0771234567',
    species: 'Dog',
    breed: 'Labrador',
    color: 'White',
    collar: 'Red',
    lostDate: '11.10.2025',
    location: 'Colombo 06',
    description: 'This is my Lost Pet named Tommy!',
    additionalDescription: 'A friendly white labrador puppy with a red collar.',
    imageUrl: '',
    likes: 1000,
    comments: 24,
  },
  {
    id: '2',
    ownerName: 'Name of owner',
    petName: 'Bob',
    phoneNumber: '0779876543',
    species: 'Dog',
    breed: 'Labrador',
    color: 'Golden',
    collar: 'Red',
    lostDate: '11.10.2025',
    location: 'Colombo 03',
    description: 'This is my Lost Pet named Bob!',
    additionalDescription: 'A delicious chicken burger served on a toasted bun with fresh lettuce, tomato slices, and mayonnaise. Juicy grilled chicken patty seasoned...',
    imageUrl: '',
    likes: 1000,
    comments: 18,
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

const AllAlertsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState<LostPetAlert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllAlerts();
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet SOS</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E87A3A" />
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts found</Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              variant="full"
              onPress={() => navigation.navigate('AlertDetail', { alertId: alert.id, alert })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllAlertsScreen;
