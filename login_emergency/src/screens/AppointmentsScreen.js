import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const STATUS_COLOR = {
    pending:   { bg: '#FFF3CD', text: '#856404', icon: 'clock-outline' },
    confirmed: { bg: '#D4EDDA', text: '#155724', icon: 'check-circle-outline' },
    rejected:  { bg: '#F8D7DA', text: '#721C24', icon: 'close-circle-outline' },
};

export default function AppointmentsScreen({ navigation }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, 'bookings'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, error => {
            // If index not ready yet, fall back to unordered query
            const fallback = query(collection(db, 'bookings'), where('userId', '==', user.uid));
            onSnapshot(fallback, snapshot => {
                const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setBookings(data);
                setLoading(false);
            });
        });

        return unsubscribe;
    }, []);

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Appointments</Text>
            </View>

            {/* Filter tabs */}
            <View style={styles.tabBar}>
                {['all', 'pending', 'confirmed', 'rejected'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, filter === tab && styles.activeTab]}
                        onPress={() => setFilter(tab)}
                    >
                        <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF741C" style={{ marginTop: 40 }} />
            ) : filtered.length === 0 ? (
                <View style={styles.empty}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={64} color="#DDD" />
                    <Text style={styles.emptyText}>No appointments found</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => {
                        const s = STATUS_COLOR[item.status] || STATUS_COLOR.pending;
                        return (
                            <View style={styles.card}>
                                <View style={styles.cardTop}>
                                    <View>
                                        <Text style={styles.doctorName}>{item.doctorName}</Text>
                                        <Text style={styles.clinicName}>{item.clinicName}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: s.bg }]}>
                                        <MaterialCommunityIcons name={s.icon} size={14} color={s.text} />
                                        <Text style={[styles.badgeText, { color: s.text }]}>
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.cardBottom}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="calendar-outline" size={16} color="#FF741C" />
                                        <Text style={styles.infoText}>{item.date}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="time-outline" size={16} color="#FF741C" />
                                        <Text style={styles.infoText}>{item.timeSlot}</Text>
                                    </View>
                                </View>
                                {item.status === 'confirmed' && (
                                    <View style={styles.confirmedBanner}>
                                        <Text style={styles.confirmedText}>
                                            ✅ Your appointment is confirmed! Please arrive 10 mins early.
                                        </Text>
                                    </View>
                                )}
                                {item.status === 'rejected' && (
                                    <View style={styles.rejectedBanner}>
                                        <Text style={styles.rejectedText}>
                                            ❌ This appointment was declined. Please rebook.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 20 },
    headerTitle: { fontSize: 22, fontFamily: 'Fredoka-Bold' },
    tabBar: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#EEE', borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#FF741C' },
    tabText: { fontFamily: 'Fredoka-SemiBold', color: '#666', fontSize: 12 },
    activeTabText: { color: 'white' },
    card: { backgroundColor: 'white', borderRadius: 16, padding: 18, marginBottom: 15, elevation: 3 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    doctorName: { fontSize: 17, fontFamily: 'Fredoka-Bold' },
    clinicName: { fontSize: 13, color: '#888', fontFamily: 'Fredoka-Regular', marginTop: 2 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4 },
    badgeText: { fontSize: 11, fontFamily: 'Fredoka-SemiBold' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    cardBottom: { flexDirection: 'row', gap: 20 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { fontSize: 13, color: '#555', fontFamily: 'Fredoka-Regular' },
    confirmedBanner: { backgroundColor: '#D4EDDA', borderRadius: 10, padding: 10, marginTop: 12 },
    confirmedText: { color: '#155724', fontSize: 12, fontFamily: 'Fredoka-Regular' },
    rejectedBanner: { backgroundColor: '#F8D7DA', borderRadius: 10, padding: 10, marginTop: 12 },
    rejectedText: { color: '#721C24', fontSize: 12, fontFamily: 'Fredoka-Regular' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#BBB', fontFamily: 'Fredoka-Regular', marginTop: 10, fontSize: 16 },
});
