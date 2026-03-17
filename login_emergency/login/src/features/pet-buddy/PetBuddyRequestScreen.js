import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DATA = {
    Network: [
        { id: '1', name: 'Janel', role: 'Trusted Friend', img: 'https://i.pravatar.cc/150?u=janel', hasCar: true },
        { id: '2', name: 'Amali', role: 'Family', img: 'https://i.pravatar.cc/150?u=amali', hasCar: true }
    ],
    Volunteers: [
        { id: '3', name: 'Volunteer Mike', role: 'Verified Helper', img: 'https://i.pravatar.cc/150?u=mike', rating: 4.9, badge: 'Top Rated' },
        { id: '4', name: 'Volunteer Sarah', role: 'Pet Specialist', img: 'https://i.pravatar.cc/150?u=sarah', rating: 5.0, badge: 'Verified ID' }
    ]
};

export default function PetBuddyRequestScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Network');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
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

            <FlatList
                data={DATA[activeTab]}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.img }} style={styles.avatar} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.role}>{item.role}</Text>
                            {item.badge && <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>}
                        </View>
                        <TouchableOpacity
                            style={styles.selectBtn}
                            onPress={() => navigation.navigate('PetBuddyConfig', { buddy: item })}
                        >
                            <Text style={styles.btnText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.volunteerFooter}
                onPress={() => navigation.navigate('VolunteerOnboarding')} // <--- This must match the name in App.js
            >
                <Text style={styles.footerText}>Want to help? <Text style={styles.link}>Become a Volunteer</Text></Text>
            </TouchableOpacity>
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
    avatar: { width: 60, height: 60, borderRadius: 30 },
    info: { flex: 1, marginLeft: 15 },
    name: { fontSize: 18, fontFamily: 'Fredoka-Bold' },
    role: { color: '#888', fontSize: 13 },
    badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5, alignSelf: 'flex-start' },
    badgeText: { color: '#1976D2', fontSize: 10, fontWeight: 'bold' },
    selectBtn: { backgroundColor: '#FF741C', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
    btnText: { color: 'white', fontFamily: 'Fredoka-Bold' },
    volunteerFooter: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
    footerText: { fontFamily: 'Fredoka-Regular', color: '#666' },
    link: { color: '#FF741C', fontFamily: 'Fredoka-Bold' }
});