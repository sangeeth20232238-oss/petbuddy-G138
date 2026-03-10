import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

/**
 * CategoryCard Component
 * @param {Icon} icon - The Lucide icon component to display
 * @param {string} title - The label for the card (e.g., "Vaccinations")
 * @param {number} count - The number of records found for this category
 */
const CategoryCard = ({ icon: Icon, title, count }) => {
  return (
    <TouchableOpacity 
      style={styles.navCard} 
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {/* Render the icon passed as a prop */}
        <Icon color={COLORS.primary} size={42} strokeWidth={1.5} />
      </View>
      
      <Text style={styles.cardText}>{title}</Text>
      
      {/* Show record count if data is available */}
      {count !== undefined && (
        <Text style={styles.countText}>{count} Records</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navCard: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    aspectRatio: 1, // Ensures the card remains a perfect square
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    
    // Soft Shadow for "Medical" feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4, // Android Shadow
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  countText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default CategoryCard;