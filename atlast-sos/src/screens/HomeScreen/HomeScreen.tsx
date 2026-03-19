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
  Image,
} from 'react-native';
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
import BottomTabBar from '../../components/BottomTabBar';
import { LostPetAlert, getRecentAlerts } from '../../backend/alertService';
import styles from './homeStyles';

// Peeking pet images
const bulldogImg = require('../../../assets/peeking-pets/bulldog.png');
const labradorImg = require('../../../assets/peeking-pets/labrador.png');
const catImg = require('../../../assets/peeking-pets/cat.png');

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
