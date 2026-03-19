// Screen 3 - Alert Detail Screen: Full pet info with photo
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Share,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LostPetAlert, getAlertById } from '../../backend/alertService';
import styles from './alertDetailStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AlertDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { alertId, alert: passedAlert } = route.params || {};

  const [alert, setAlert] = useState<LostPetAlert | null>(passedAlert || null);
  const [loading, setLoading] = useState(!passedAlert);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!passedAlert && alertId) {
      const fetchAlert = async () => {
        setLoading(true);
        try {
          const data = await getAlertById(alertId);
          if (data) setAlert(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAlert();
    }
  }, [alertId, passedAlert]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E87A3A" />
        </View>
      </SafeAreaView>
    );
  }

  if (!alert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 16, color: '#666' }}>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const lostDate = alert.lostDate || '20.02.2026';
  const likesCount = alert.likes || 0;

  const handleContactOwner = () => {
    if (alert.phoneNumber) {
      Linking.openURL(`tel:${alert.phoneNumber}`);
    }
  };

  const handleEmailOwner = () => {
    Linking.openURL('mailto:');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚨 Lost Pet Alert: ${alert.petName} (${alert.breed}) is missing near ${alert.location}. If you see this pet, please contact ${alert.ownerName} at ${alert.phoneNumber}.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Full-bleed Pet Image */}
        <View style={styles.imageContainer}>
          {alert.imageUrl ? (
            <Image source={{ uri: alert.imageUrl }} style={styles.petImage} />
          ) : (
            <View style={[styles.petImage, styles.petImagePlaceholder]}>
              <Ionicons name="image-outline" size={80} color="#ccc" />
            </View>
          )}

          {/* Back button overlay */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>