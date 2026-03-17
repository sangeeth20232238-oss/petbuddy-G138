import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DoctorDetailScreen({ route, navigation }) {
    const { doctor } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Vet</Text>
            </View>
            <Text style={styles.subTitle}>Doctor Details</Text>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=anna' }} style={styles.mainImg} />
            <Text style={styles.docName}>Dr. Anna Johnson</Text>
            <View style={styles.statsRow}>
                <View style={styles.statBox}><Text style={styles.statTitle}>Experience</Text><Text style={styles.statValue}>7 Years</Text></View>
                <View style={styles.statBox}><Text style={styles.statTitle}>Charge</Text><Text style={styles.statValue}>Rs.2500</Text></View>
                <View style={styles.statBox}><Text style={styles.statTitle}>Hours</Text><Text style={styles.statValue}>6hr/day</Text></View>
            </View>
            <View style={styles.aboutContainer}>
                <Text style={styles.aboutTitle}>About</Text>
                <Text style={styles.aboutText}>Dr. Maria Naiis is a highly experienced veterinarian with 7 years of dedicated practice...</Text>
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('BookingCalendar')}>
                <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginLeft: 50 },
    subTitle: { textAlign: 'center', fontSize: 22, fontFamily: 'Fredoka-Regular', marginBottom: 20 },
    mainImg: { width: width - 40, height: 200, borderRadius: 25, alignSelf: 'center' },
    docName: { fontSize: 22, fontFamily: 'Fredoka-Bold', margin: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    statBox: { width: (width - 60) / 3, padding: 10, borderWidth: 1, borderColor: '#FF741C', borderRadius: 10, alignItems: 'center' },
    statTitle: { fontSize: 14, fontFamily: 'Fredoka-Bold' },
    statValue: { color: '#FF741C', fontSize: 13 },
    aboutContainer: { padding: 25 },
    aboutTitle: { fontSize: 20, fontFamily: 'Fredoka-Bold', marginBottom: 10 },
    aboutText: { color: '#777', lineHeight: 20 },
    bookBtn: { backgroundColor: '#FF741C', margin: 25, padding: 20, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 20, width: width - 50 }
});