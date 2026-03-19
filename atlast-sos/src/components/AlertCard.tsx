// Reusable Alert Card Component
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LostPetAlert } from '../backend/alertService';

interface AlertCardProps {
  alert: LostPetAlert;
  onPress: () => void;
  variant?: 'compact' | 'full';
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress, variant = 'compact' }) => {
  if (variant === 'full') {
    return (
      <TouchableOpacity style={styles.fullCard} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.fullHeader}>
          <View style={styles.ownerRow}>
            <Ionicons name="person-circle-outline" size={32} color="#888" />
            <Text style={styles.ownerName}>{alert.ownerName || 'Name of owner'}</Text>
          </View>
        </View>
        <Text style={styles.fullDescription} numberOfLines={2}>
          {alert.description || `This is my Lost Pet named ${alert.petName}!`}
        </Text>
        {alert.imageUrl ? (
          <Image source={{ uri: alert.imageUrl }} style={styles.fullImage} />
        ) : (
          <View style={[styles.fullImage, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
          </View>
        )}
        <Text style={styles.dateLost}>Date Lost : {alert.lostDate}</Text>
        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <Ionicons name="heart-outline" size={20} color="#E87A3A" />
            <Text style={styles.actionText}>{alert.likes || '1k'}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#888" />
            <Text style={styles.actionText}>Comment</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact variant (for horizontal list on Home)
  return (
    <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.compactHeader}>
        <Ionicons name="person-circle-outline" size={24} color="#888" />
        <Text style={styles.compactOwner} numberOfLines={1}>{alert.ownerName || 'Name of owner'}</Text>
        <View style={styles.likeBadge}>
          <Ionicons name="heart-outline" size={14} color="#E87A3A" />
          <Text style={styles.likeCount}>{alert.likes || '1k'}</Text>
        </View>
      </View>
      <Text style={styles.compactDescription} numberOfLines={2}>
        {alert.description || `This is my Lost Pet named ${alert.petName}!`}
      </Text>
      {alert.imageUrl ? (
        <Image source={{ uri: alert.imageUrl }} style={styles.compactImage} />
      ) : (
        <View style={[styles.compactImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={32} color="#ccc" />
        </View>
      )}
      <Text style={styles.compactDate}>Date Lost : {alert.lostDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Compact Card Styles
  compactCard: {
    backgroundColor: '#FDDCB5',
    borderRadius: 16,
    padding: 12,
    width: 170,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  compactOwner: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    marginLeft: 4,
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  likeCount: {
    fontSize: 10,
    color: '#E87A3A',
    fontWeight: '500',
  },
  compactDescription: {
    fontSize: 11,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    lineHeight: 15,
  },
  compactImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 6,
  },
  compactDate: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },

  // Full Card Styles
  fullCard: {
    backgroundColor: '#FDDCB5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fullHeader: {
    marginBottom: 8,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  fullDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    lineHeight: 20,
  },
  fullImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
  },
  placeholderImage: {
    backgroundColor: '#f0e0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateLost: {
    fontSize: 13,
    color: '#E87A3A',
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default AlertCard;
