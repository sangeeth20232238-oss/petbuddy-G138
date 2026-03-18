import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';

const LOCATIONS = [
  {
    id: '1',
    name: 'The Groom Room',
    address: 'No. 12, Flower Road, Colombo 07, Sri Lanka',
    distance: '1.2 km away',
    price: 'Services from LKR 8,500',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&q=80',
  },
  {
    id: '2',
    name: 'Grooming Salon',
    address: 'No. 45/3, Lake View Lane, Nugegoda, Sri Lanka',
    distance: '3.0 km away',
    price: 'Services from LKR 12,000',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80',
  },
  {
    id: '3',
    name: 'The Velvet Paw',
    address: 'No. 45/3, Lake View Lane, Nugegoda, Sri Lanka',
    distance: '0.9 km away',
    price: 'Services from LKR 6,500',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80',
  },
  {
    id: '4',
    name: 'Fur & Fluff Studio',
    address: 'No. 27, Beach Road, Mount Lavinia, Sri Lanka',
    distance: '4.5 km away',
    price: 'Services from LKR 15,000',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&q=80',
  },
];

const GroomingLocation = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grooming</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
        <Text style={styles.micIcon}>🎙️</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {LOCATIONS.map((loc) => (
          <View key={loc.id} style={styles.cardContainer}>
            <Image source={{ uri: loc.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{loc.name}</Text>
              <Text style={styles.cardAddress}>{loc.address}</Text>
              <Text style={styles.cardDetails}>{loc.distance} - {loc.price}</Text>
              <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heartIcon}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#F48C06' }]}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  backButtonText: { fontSize: 20, color: '#000' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0EBE6', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 15, height: 45, marginBottom: 20 },
  searchIcon: { fontSize: 16, marginRight: 10, color: '#666' },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  micIcon: { fontSize: 16, marginLeft: 10, color: '#666' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  cardContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, alignItems: 'center' },
  cardImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  cardAddress: { fontSize: 12, color: '#666', marginBottom: 5 },
  cardDetails: { fontSize: 12, color: '#666', fontWeight: '500' },
  heartButton: { position: 'absolute', bottom: 0, right: 0, padding: 5 },
  heartIcon: { fontSize: 20, color: '#999' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0EBE6', paddingBottom: 20 },
  navItem: { padding: 10 },
  navIcon: { fontSize: 24, color: '#999' },
});

export default GroomingLocation;
