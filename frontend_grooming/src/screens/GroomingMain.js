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
  { id: '1', title: 'Bathing & Drying', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80' },
  { id: '2', title: 'Hair Trimming', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80' },
  { id: '3', title: 'Nail Trimming', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300&q=80' },
  { id: '4', title: 'Ear Cleaning', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&q=80' },
  { id: '5', title: 'Teeth Brushing', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80' },
  { id: '6', title: 'Flea Treatment', image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&q=80' },
  { id: '7', title: 'Full Grooming Package', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80' },
  { id: '8', title: 'Coat Brushing', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&q=80' },
  { id: '9', title: 'Paw Massage', image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=300&q=80' },
  { id: '10', title: 'De-shedding', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&q=80' },
  { id: '11', title: 'Skin Treatment', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&q=80' },
  { id: '12', title: 'Perfume & Styling', image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&q=80' },
];

const GroomingMain = ({ onServicePress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grooming</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.gridContainer}>
          {SERVICES.map((service) => (
            <TouchableOpacity key={service.id} style={styles.cardContainer} onPress={onServicePress}>
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  backButtonText: { fontSize: 20, color: '#000' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 80 },
  bannerContainer: {},
  bannerTextContainer: {},
  bannerText: {},
  bannerImageContainer: {},
  bannerImage: {},
  sectionTitle: { fontSize: 14, color: '#333333', textAlign: 'center', marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardContainer: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 12, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardImage: { width: '100%', height: 90, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', textAlign: 'center' },
});

export default GroomingMain;
