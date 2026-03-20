import React, { useState } from 'react';
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
    distance: '1.5 km away · Services from LKR 6,500',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80',
  },
  {
    id: '2',
    name: 'Grooming Salon',
    address: 'No. 44/3, Lake View Lane, Nugegoda, Sri Lanka',
    distance: '2.0 km away · Services from LKR 5,000',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80',
  },
  {
    id: '3',
    name: 'The Velvet Paw',
    address: 'No. 85/3, Lake View Lane, Nugegoda, Sri Lanka',
    distance: '0.9 km away · Services from LKR 7,000',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80',
  },
  {
    id: '4',
    name: 'Fur & Fluff Studio',
    address: 'No. 27, Beach Road, Mount Lavinia, Sri Lanka',
    distance: '4.5 km away · Services from LKR 5,000',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300&q=80',
  },
  {
    id: '5',
    name: 'Paws & Claws Spa',
    address: 'No. 18, Galle Road, Dehiwala, Sri Lanka',
    distance: '3.2 km away · Services from LKR 4,500',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&q=80',
  },
  {
    id: '6',
    name: 'Happy Tails Grooming',
    address: 'No. 55, High Level Road, Maharagama, Sri Lanka',
    distance: '6.1 km away · Services from LKR 3,800',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80',
  },
  {
    id: '7',
    name: 'Petcare Grooming Hub',
    address: 'No. 9, Duplication Road, Colombo 03, Sri Lanka',
    distance: '2.8 km away · Services from LKR 8,000',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&q=80',
  },
  {
    id: '8',
    name: 'Whiskers & Wags',
    address: 'No. 33, Nawala Road, Rajagiriya, Sri Lanka',
    distance: '5.0 km away · Services from LKR 5,500',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&q=80',
  },
];

const GroomingLocation = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filtered = LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

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
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#AAAAAA"
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((location) => (
          <TouchableOpacity 
            key={location.id} 
            style={styles.card} 
            onPress={() => navigation.navigate('GroomingApt', { location })}
          >
            <Image source={{ uri: location.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{location.name}</Text>
              <Text style={styles.cardAddress}>{location.address}</Text>
              <Text style={styles.cardDistance}>{location.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  backButtonText: { fontSize: 20, color: '#000' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  searchIcon: { fontSize: 16, marginLeft: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 14, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 2 },
  cardImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 3 },
  cardAddress: { fontSize: 11, color: '#666666', marginBottom: 3, lineHeight: 15 },
  cardDistance: { fontSize: 11, color: '#999999' },
});

export default GroomingLocation;
