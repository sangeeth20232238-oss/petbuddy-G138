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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';
import { LostPetAlert, getAlertById } from '../../backend/alertService';
import styles from './alertDetailStyles';

const AlertDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { alertId, alert: passedAlert } = route.params || {};

  const [alert, setAlert] = useState<LostPetAlert | null>(passedAlert || null);
  const [loading, setLoading] = useState(!passedAlert);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet SOS</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const postedDate = alert.createdAt
    ? new Date(alert.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '13.11.2025';

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

        {/* Posted Date */}
        <Text style={styles.postedDate}>Posted on {postedDate}</Text>

        {/* Pet Image */}
        {alert.imageUrl ? (
          <Image source={{ uri: alert.imageUrl }} style={styles.petImage} />
        ) : (
          <View style={styles.petImagePlaceholder}>
            <Ionicons name="image-outline" size={64} color="#ccc" />
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.petName}>My Name is {alert.petName} !</Text>
          <Text style={styles.ownerLabel}>Owner Name : {alert.ownerName}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Species :</Text>
                <Text style={styles.infoValue}>{alert.species}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Breed :</Text>
                <Text style={styles.infoValue}>{alert.breed}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Color :</Text>
                <Text style={styles.infoValue}>{alert.color}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Collar :</Text>
                <Text style={styles.infoValue}>{alert.collar}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Lost Date :</Text>
                <Text style={styles.infoValue}>{alert.lostDate}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Location :</Text>
                <Text style={styles.infoValue}>{alert.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Additional Description */}
          <Text style={styles.additionalTitle}>Additional Description :</Text>
          <Text
            style={styles.additionalText}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {alert.additionalDescription || 'No additional description provided.'}
          </Text>
          {alert.additionalDescription && alert.additionalDescription.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.seeMore}>
                {showFullDescription ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
};

export default AlertDetailScreen;
