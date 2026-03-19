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