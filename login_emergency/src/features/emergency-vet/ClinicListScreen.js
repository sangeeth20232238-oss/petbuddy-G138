import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchClinics } from '../../services/emergencyVetService';

export default function ClinicListScreen({ navigation }) {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchClinics()
            .then(setClinics)
            .finally(() => setLoading(false));
    }, []);

    const filtered = clinics.filter(c => {
        const q = search.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            (c.address && c.address.toLowerCase().includes(q))
        );
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                    placeholder="Search clinics or area..."
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#BBB"
                    returnKeyType="search"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={20} color="#CCC" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.sectionTitle}>Nearby</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#FF741C" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Ionicons name="search-outline" size={48} color="#DDD" />
                            <Text style={styles.emptyText}>No clinics found</Text>
                            <Text style={styles.emptyHint}>Try a different name or area</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ClinicDetail', { clinic: item })}>
                            <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.clinicName}>{item.name}</Text>
                                <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
                                <View style={styles.cardRow}>
                                    <Text style={styles.dist}>📍 {item.distance} away</Text>
                                    <View style={[styles.statusBadge, item.status === 'Open 24/7' && styles.statusBadge247]}>
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginLeft: 50 },
    searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 10, padding: 12, borderRadius: 15, alignItems: 'center', elevation: 2 },
    searchInput: { flex: 1, marginLeft: 10, fontFamily: 'Fredoka-Regular', fontSize: 15, color: '#333' },
    sectionTitle: { fontSize: 20, fontFamily: 'Fredoka-SemiBold', marginLeft: 20, marginBottom: 10 },
    card: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, padding: 14, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
    cardImg: { width: 85, height: 85, borderRadius: 15 },
    cardInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
    clinicName: { fontSize: 16, fontFamily: 'Fredoka-Bold', color: '#333' },
    address: { color: '#AAA', fontFamily: 'Fredoka-Regular', fontSize: 12, marginTop: 3 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    dist: { color: '#888', fontFamily: 'Fredoka-Regular', fontSize: 12 },
    statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    statusBadge247: { backgroundColor: '#FFF3E0' },
    statusText: { color: '#388E3C', fontFamily: 'Fredoka-SemiBold', fontSize: 11 },
    emptyBox: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontFamily: 'Fredoka-Bold', fontSize: 18, color: '#CCC', marginTop: 12 },
    emptyHint: { fontFamily: 'Fredoka-Regular', color: '#DDD', marginTop: 4 },
});