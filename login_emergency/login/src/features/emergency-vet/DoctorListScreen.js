import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DOCTORS = [
    { id: '1', name: 'Dr.Emaly', exp: 'Experienced Doctor', price: 'Rs2500-Rs4000/Session' },
    { id: '2', name: 'Dr.Sophia', exp: 'Experienced Doctor', price: 'Rs2500-Rs4000/Session' },
    { id: '3', name: 'Dr.Cameron', exp: 'Experienced Doctor', price: 'Rs2500-Rs4000/Session' },
];

export default function DoctorListScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.subTitle}>Available Doctors</Text>
            <FlatList
                data={DOCTORS}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=' + item.id }} style={styles.docImg} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.exp}>{item.exp}</Text>
                            <View style={styles.priceBtn}><Text style={styles.priceText}>{item.price}</Text></View>
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
    subTitle: { textAlign: 'center', fontSize: 20, fontFamily: 'Fredoka-Regular', marginVertical: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFDDC7', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 25, alignItems: 'center' },
    docImg: { width: 100, height: 100, borderRadius: 20 },
    info: { marginLeft: 15, flex: 1 },
    name: { fontSize: 18, fontFamily: 'Fredoka-Bold' },
    exp: { color: '#999', marginBottom: 10 },
    priceBtn: { backgroundColor: '#FF741C', padding: 8, borderRadius: 10, alignItems: 'center' },
    priceText: { color: 'white', fontSize: 12, fontFamily: 'Fredoka-SemiBold' }
});