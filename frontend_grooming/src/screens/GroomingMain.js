import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const SERVICES = [
  {
    id: '1',
    title: 'Bathing & Drying',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80',
  },
  {
    id: '2',
    title: 'Hair Trimming',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80',
  },
  {
    id: '3',
    title: 'Nail Trimming',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300&q=80',
  },
  {
    id: '4',
    title: 'Ear Cleaning',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&q=80',
  },
  {
    id: '5',
    title: 'Teeth Brushing',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80',
  },
  {
    id: '6',
    title: 'Flea Treatment',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&q=80',
  },
];

const GroomingMain = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          {/* Simple left arrow placeholder */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grooming</Text>
        <View style={{ width: 40 }} /> {/* Placeholder for balance */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>60% off on</Text>
            <Text style={styles.bannerText}>New Customers</Text>
          </View>
          <View style={styles.bannerImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80' }} // Pug dog
              style={styles.bannerImage}
            />
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Our Services</Text>

        {/* Services Grid */}
        <View style={styles.gridContainer}>
          {SERVICES.map((service) => (
            <TouchableOpacity key={service.id} style={styles.cardContainer}>
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>⌂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF8F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Space for bottom nav
  },
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#A3D611',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    // Faux gradient colors feel - we use a single color based on the design left side
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  bannerImageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0E5DB',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    fontSize: 28,
    color: '#F48C06',
  },
  navIcon: {
    fontSize: 24,
    color: '#F48C06',
  },
});

export default GroomingMain;
