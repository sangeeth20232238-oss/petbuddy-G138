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
            <Image source={typeof alert.imageUrl === 'string' ? { uri: alert.imageUrl } : alert.imageUrl} style={styles.petImage} />
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
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
        </View>

        {/* White card content overlapping the image */}
        <View style={styles.contentCard}>
          {/* Pet Name Row */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.petName}>{alert.petName}</Text>
              <Text style={styles.breedColor}>
                {alert.breed}{alert.color ? ` · ${alert.color}` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => setLiked(!liked)}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? '#E87A3A' : '#E87A3A'}
              />
              <Text style={styles.likeCount}>
                {liked ? (likesCount + 1).toFixed(1) + 'k' : likesCount > 0 ? (likesCount / 1000).toFixed(1) + 'k' : '0'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Owner Card */}
          <View style={styles.ownerCard}>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.ownerLabel}>Owner</Text>
                <Text style={styles.ownerName}>{alert.ownerName}</Text>
              </View>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={styles.ownerActionBtn}
                onPress={handleContactOwner}
              >
                <Ionicons name="call" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ownerActionBtn, styles.emailBtn]}
                onPress={handleEmailOwner}
              >
                <Ionicons name="mail" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description Card */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {alert.additionalDescription || alert.description || 'No description provided.'}
            </Text>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              {/* Date Lost */}
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="calendar-month" size={28} color="#E87A3A" />
                <Text style={styles.detailLabel}>Date Lost</Text>
                <Text style={styles.detailValue}>{lostDate}</Text>
              </View>
              {/* Last Seen */}
              <View style={styles.detailCard}>
                <Ionicons name="location-outline" size={28} color="#E87A3A" />
                <Text style={styles.detailLabel}>Last Seen</Text>
                <Text style={styles.detailValue}>{alert.location || 'Unknown'}</Text>
              </View>
              {/* Pet Type */}
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="paw" size={28} color="#E87A3A" />
                <Text style={styles.detailLabel}>Pet Type</Text>
                <Text style={styles.detailValue}>{alert.species || 'Unknown'}</Text>
              </View>
              {/* Reward */}
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="gift-outline" size={28} color="#E87A3A" />
                <Text style={styles.detailLabel}>Reward</Text>
                <Text style={styles.detailValue}>$750</Text>
              </View>
            </View>
          </View>

          {/* Contact Owner Button */}
          <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
            <Ionicons name="call" size={20} color="#FFF" />
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#E87A3A" />
            <Text style={styles.shareButtonText}>Share This Alert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AlertDetailScreen;
