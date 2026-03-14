// Vet Card Component for Share/Notify Screen
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface VetInfo {
  id: string;
  name: string;
  distance: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
}

interface VetCardProps {
  vet: VetInfo;
  onPress?: () => void;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {vet.imageUrl ? (
          <Image source={{ uri: vet.imageUrl }} style={styles.vetImage} />
        ) : (
          <View style={[styles.vetImage, styles.placeholderImage]}>
            <Ionicons name="medkit-outline" size={24} color="#E87A3A" />
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.vetName} numberOfLines={1}>{vet.name}</Text>
        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={12} color="#E87A3A" />
          <Text style={styles.distance}>{vet.distance}</Text>
          <Ionicons name="star" size={12} color="#FFB800" style={{ marginLeft: 8 }} />
          <Text style={styles.rating}>{vet.rating} ({vet.reviews})</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#E87A3A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5D5B8',
  },
  imageContainer: {
    marginRight: 12,
  },
  vetImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  placeholderImage: {
    backgroundColor: '#FFF0E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  vetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 11,
    color: '#E87A3A',
    marginLeft: 3,
    fontWeight: '500',
  },
  rating: {
    fontSize: 11,
    color: '#666',
    marginLeft: 3,
    fontWeight: '500',
  },
});

export default VetCard;
