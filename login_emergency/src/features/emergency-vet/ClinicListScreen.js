import React from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CLINICS = [
    { id: '1', name: 'Golden Paws Veterinary', dist: '0.5 Km', status: 'Open', img: 'https://placedog.net/150/150' },
    { id: '2', name: 'Happy Tails Pet Clinic', dist: '1.5 Km', status: 'Open', img: 'https://placedog.net/151/151' },
    { id: '3', name: 'Pet Wellness Clinic', dist: '2.0 Km', status: 'Open', img: 'https://placedog.net/152/152' },
    { id: '4', name: 'Happy Tails Animal Hospital', dist: '0.5 Km', status: 'Open', img: 'https://placedog.net/153/153' },
];

export default function ClinicListScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput placeholder="Search" style={styles.searchInput} />
                <MaterialCommunityIcons name="microphone" size={20} color="#999" />
            </View>
            <Text style={styles.sectionTitle}>Nearby</Text>
            <FlatList
                data={CLINICS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ClinicDetail', { clinic: item })}>
                        <Image source={{ uri: item.img }} style={styles.cardImg} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.clinicName}>{item.name}</Text>
                            <View style={styles.cardRow}>
                                <Text style={styles.dist}>{item.dist} away</Text>
                                <Text style={styles.status}>{item.status}</Text>
                            </View>
                            <Text style={styles.seeMore}>See More</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginLeft: 50 },
    searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', margin: 20, padding: 12, borderRadius: 15, alignItems: 'center', elevation: 2 },
    searchInput: { flex: 1, marginLeft: 10, fontFamily: 'Fredoka-Regular' },
    sectionTitle: { fontSize: 20, fontFamily: 'Fredoka-SemiBold', marginLeft: 20, marginBottom: 10 },
    card: { flexDirection: 'row', backgroundColor: '#FFDDC7', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 20 },
    cardImg: { width: 80, height: 80, borderRadius: 15 },
    cardInfo: { flex: 1, marginLeft: 15 },
    clinicName: { fontSize: 16, fontFamily: 'Fredoka-Bold' },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    dist: { color: '#555' },
    status: { color: '#000', fontWeight: 'bold' },
    seeMore: { alignSelf: 'flex-end', marginTop: 10, fontFamily: 'Fredoka-Bold' }
});