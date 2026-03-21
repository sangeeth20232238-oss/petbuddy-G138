// Screen 1 - Home Screen: Emergency button + Recent Alerts
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AlertCard from '../../components/AlertCard';
import { LostPetAlert, getRecentAlerts } from '../../backend/alertService';
import styles from './homeStyles';

// Peeking pet images
const bulldogImg = require('../../../../../assets/peeking-pets/bulldog.png');
const labradorImg = require('../../../../../assets/peeking-pets/labrador.png');
const catImg = require('../../../../../assets/peeking-pets/cat.png');

// Demo pet images for alert cards
const goldyImg = { uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400' };
const maxImg = { uri: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' };
const lunaImg = { uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400' };

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
    imageUrl: goldyImg,
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
    imageUrl: maxImg,
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
    imageUrl: lunaImg,
    likes: 620,
    comments: 10,
  },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState<LostPetAlert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(false);

  // Pulse animation values
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Continuous pulse: 1.0 → 1.08 → 1.0
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      false
    );

    // Glow breathing: 0.3 → 0.7 → 0.3
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * pressScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: pulseScale.value * 1.15 }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

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
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet SOS</Text>
        </View>

        {/* Hero Section with Pet Illustrations + Emergency Button */}
        <View style={styles.heroSection}>
          {/* Peeking Pets above the card */}
          <View style={styles.peekingPetsRow}>
            <Image source={bulldogImg} style={styles.peekingPetSide} resizeMode="contain" />
            <Image source={labradorImg} style={styles.peekingPetCenter} resizeMode="contain" />
            <Image source={catImg} style={styles.peekingPetSide} resizeMode="contain" />
          </View>

          <View style={styles.heroCard}>
            {/* Paw watermark in background */}
            <View style={styles.pawWatermarkContainer}>
              <Ionicons name="paw" size={120} color="rgba(139, 94, 60, 0.06)" />
            </View>

            {/* Paw Icon */}
            <Ionicons name="paw" size={28} color="#8B5E3C" style={styles.pawIcon} />

            {/* Animated Emergency Button with Pulse + Glow */}
            <View style={styles.emergencyButtonWrapper}>
              {/* Glow ring behind button */}
              <Animated.View style={[styles.glowRing, animatedGlowStyle]} />

              {/* Pulsing button */}
              <AnimatedTouchable
                style={[styles.emergencyButton, animatedButtonStyle]}
                onPress={() => navigation.navigate('CreatePost')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                <Ionicons name="paw" size={40} color="#E87A3A" />
              </AnimatedTouchable>
            </View>

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
    </SafeAreaView>
  );
};

export default HomeScreen;
