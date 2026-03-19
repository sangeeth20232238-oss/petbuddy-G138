import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const { width } = Dimensions.get('window');

const NETWORK_DATA = [
    { id: '1', name: 'Janel', role: 'Trusted Friend', phone: '+94771234567', hasCar: true },
    { id: '2', name: 'Amali', role: 'Family', phone: '+94779876543', hasCar: true },
];

export default function PetBuddyRequestScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Network');
    const [volunteers, setVolunteers] = useState([]);
    const [loadingVols, setLoadingVols] = useState(false);
    const [selectedBuddy, setSelectedBuddy] = useState(null);
    const [showCareModal, setShowCareModal] = useState(false);

    useEffect(() => {
        if (activeTab === 'Volunteers') fetchVolunteers();
    }, [activeTab]);

    const fetchVolunteers = async () => {
        setLoadingVols(true);
        try {
            const q = query(collection(db, 'volunteers'), where('status', '==', 'approved'));
            const snap = await getDocs(q);
            setVolunteers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            setVolunteers([]);
        } finally {
            setLoadingVols(false);
        }
    };

    const handleSelect = (item) => {
        setSelectedBuddy(item);
        setShowCareModal(true);
    };

    const handleCareChoice = (fullCare) => {
        setShowCareModal(false);
        navigation.navigate('PetBuddyConfig', { buddy: selectedBuddy, fullCare });
    };

    const data = activeTab === 'Network' ? NETWORK_DATA : volunteers;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pet Buddy Network</Text>
            </View>

            <View style={styles.tabBar}>
                {['Network', 'Volunteers'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loadingVols ? (
                <ActivityIndicator size="large" color="#FF741C" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No volunteers available right now.</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarLetter}>{item.name?.[0]?.toUpperCase()}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role || 'Verified Volunteer'}</Text>
                                {item.breeds ? (
                                    <Text style={styles.breeds}>🐾 {item.breeds}</Text>
                                ) : null}
                            </View>
                            <TouchableOpacity style={styles.selectBtn} onPress={() => handleSelect(item)}>
                                <Text style={styles.btnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.volunteerFooter}
                onPress={() => navigation.navigate('VolunteerOnboarding')}
            >
                <Text style={styles.footerText}>Want to help? <Text style={styles.link}>Become a Volunteer</Text></Text>
            </TouchableOpacity>

            {/* Care Type Modal */}
            <Modal visible={showCareModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <MaterialCommunityIcons name="paw" size={40} color="#FF741C" />
                        <Text style={styles.modalTitle}>Choose Care Type</Text>
                        <Text style={styles.modalSub}>What kind of help do you need from {selectedBuddy?.name}?</Text>

                        <TouchableOpacity style={styles.careOption} onPress={() => handleCareChoice(false)}>
                            <Ionicons name="hand-left-outline" size={24} color="#FF741C" />
                            <View style={styles.careText}>
                                <Text style={styles.careTitle}>Quick Assistance</Text>
                                <Text style={styles.careDesc}>Help with specific tasks only</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.careOption, styles.careOptionFull]} onPress={() => handleCareChoice(true)}>
                            <MaterialCommunityIcons name="shield-star-outline" size={24} color="white" />
                            <View style={styles.careText}>
                                <Text style={[styles.careTitle, { color: 'white' }]}>🐾 PawGuard Complete Care</Text>
                                <Text style={[styles.careDesc, { color: '#FFE0CC' }]}>Full support — transport, clinic stay & aftercare</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowCareModal(false)} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 22, fontFamily: 'Fredoka-Bold', marginLeft: 20 },
    tabBar: { flexDirection: 'row', margin: 20, backgroundColor: '#EEE', borderRadius: 12, padding: 5 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#FF741C' },
    tabLabel: { fontFamily: 'Fredoka-SemiBold', color: '#666' },
    activeTabLabel: { color: 'white' },
    card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 15, alignItems: 'center', elevation: 3 },
    avatarCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#FF741C', alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { color: 'white', fontSize: 22, fontFamily: 'Fredoka-Bold' },
    info: { flex: 1, marginLeft: 15 },
    name: { fontSize: 18, fontFamily: 'Fredoka-Bold' },
    role: { color: '#888', fontSize: 13, fontFamily: 'Fredoka-Regular' },
    breeds: { color: '#FF741C', fontSize: 12, fontFamily: 'Fredoka-Regular', marginTop: 3 },
    selectBtn: { backgroundColor: '#FF741C', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
    btnText: { color: 'white', fontFamily: 'Fredoka-Bold' },
    emptyText: { textAlign: 'center', color: '#AAA', fontFamily: 'Fredoka-Regular', marginTop: 40 },
    volunteerFooter: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
    footerText: { fontFamily: 'Fredoka-Regular', color: '#666' },
    link: { color: '#FF741C', fontFamily: 'Fredoka-Bold' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, alignItems: 'center' },
    modalTitle: { fontSize: 22, fontFamily: 'Fredoka-Bold', marginTop: 10 },
    modalSub: { color: '#888', fontFamily: 'Fredoka-Regular', textAlign: 'center', marginTop: 6, marginBottom: 20 },
    careOption: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#FFF5EF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: '#FF741C' },
    careOptionFull: { backgroundColor: '#FF741C', borderColor: '#FF741C' },
    careText: { marginLeft: 14, flex: 1 },
    careTitle: { fontFamily: 'Fredoka-Bold', fontSize: 15, color: '#333' },
    careDesc: { fontFamily: 'Fredoka-Regular', fontSize: 12, color: '#888', marginTop: 2 },
    cancelBtn: { marginTop: 10 },
    cancelText: { color: '#AAA', fontFamily: 'Fredoka-SemiBold' },
});
