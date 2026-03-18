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
];

const GroomingMain = () => {
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
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>60% off on</Text>
            <Text style={styles.bannerText}>New Customers</Text>
          </View>
          <View style={styles.bannerImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80' }}
              style={styles.bannerImage}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.gridContainer}>
          {SERVICES.map((service) => (
            <TouchableOpacity key={service.id} style={styles.cardContainer}>
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingChat}>
        <Text style={styles.floatingChatIcon}>💬</Text>
      </TouchableOpacity>
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
  bannerContainer: { flexDirection: 'row', backgroundColor: '#A3D611', borderRadius: 15, padding: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  bannerTextContainer: { flex: 1 },
  bannerText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', lineHeight: 24 },
  bannerImageContainer: { width: 70, height: 70, backgroundColor: '#FFFFFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  bannerImage: { width: 60, height: 60, borderRadius: 10 },
  sectionTitle: { fontSize: 14, color: '#333333', textAlign: 'center', marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardContainer: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 12, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardImage: { width: '100%', height: 90, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', textAlign: 'center' },
  floatingChat: { position: 'absolute', bottom: 30, alignSelf: 'center', left: '50%', marginLeft: -28, width: 56, height: 56, borderRadius: 28, backgroundColor: '#F48C06', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 8 },
  floatingChatIcon: { fontSize: 26 },
});

export default GroomingMain;
