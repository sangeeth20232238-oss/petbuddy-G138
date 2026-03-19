// Reusable Alert Card Component — Enhanced Design
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
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={18} color="#E87A3A" />
            </View>
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
            <Ionicons name="paw" size={42} color="#D4A574" />
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#E87A3A" />
          <Text style={styles.dateLost}>Date Lost : {alert.lostDate}</Text>
        </View>
        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <Ionicons name="heart" size={18} color="#E87A3A" />
            <Text style={styles.actionText}>{alert.likes || '1k'}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#999" />
            <Text style={styles.actionText}>Comment</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact variant (for horizontal list on Home)
  return (
    <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.85}>
      {/* Top accent line */}
      <View style={styles.topAccent} />

      <View style={styles.compactHeader}>
        <View style={styles.avatarCircleSmall}>
          <Ionicons name="person" size={12} color="#E87A3A" />
        </View>
        <Text style={styles.compactOwner} numberOfLines={1}>{alert.ownerName || 'Name of owner'}</Text>
        <View style={styles.likeBadge}>
          <Ionicons name="heart" size={12} color="#E87A3A" />
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
          <Ionicons name="paw" size={28} color="#D4A574" />
        </View>
      )}

      <View style={styles.compactFooter}>
        <Ionicons name="calendar-outline" size={11} color="#E87A3A" />
        <Text style={styles.compactDate}>Date Lost : {alert.lostDate}</Text>
      </View>
    </TouchableOpacity>
  );
};
