import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchDoctors } from '../../services/emergencyVetService';

export default function DoctorListScreen({ route, navigation }) {
    const { clinic } = route.params;
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors(clinic.id)
            .then(setDoctors)
            .finally(() => setLoading(false));
    }, [clinic.id]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.subTitle}>Available Doctors</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#FF741C" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={doctors}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('DoctorDetail', { doctor: item, clinic })}
                        >
                            <Image source={{ uri: item.imageUrl }} style={styles.docImg} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.exp}>{item.specialization}</Text>
                                <View style={styles.priceBtn}>
                                    <Text style={styles.priceText}>Rs{item.chargeMin}-Rs{item.chargeMax}/Session</Text>
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
    subTitle: { textAlign: 'center', fontSize: 20, fontFamily: 'Fredoka-Regular', marginVertical: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFDDC7', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 25, alignItems: 'center' },
    docImg: { width: 100, height: 100, borderRadius: 20 },
    info: { marginLeft: 15, flex: 1 },
    name: { fontSize: 18, fontFamily: 'Fredoka-Bold' },
    exp: { color: '#999', marginBottom: 10 },
    priceBtn: { backgroundColor: '#FF741C', padding: 8, borderRadius: 10, alignItems: 'center' },
    priceText: { color: 'white', fontSize: 12, fontFamily: 'Fredoka-SemiBold' }
});