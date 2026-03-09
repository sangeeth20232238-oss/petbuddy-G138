import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const services = [
        { id: 1, name: 'Emergency Vet', icon: 'alert-decagram-outline', color: '#FF4D4D' },
        { id: 2, name: 'Adoption', icon: 'dog-side', color: '#FF741C' },
        { id: 3, name: 'Pet SOS', icon: 'broadcast', color: '#FF741C' },
        { id: 4, name: 'Pet Buddy', icon: 'heart-outline', color: '#FF741C' },
        { id: 5, name: 'Grooming', icon: 'content-cut', color: '#FF741C' },
        { id: 6, name: 'Wallet', icon: 'wallet-outline', color: '#FF741C' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#FFF5F0', '#FFFFFF']} style={styles.background} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Dashboard Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=enoch' }} style={styles.profilePic} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.greeting, { fontFamily: 'Fredoka-SemiBold' }]}>Hello, Enoch</Text>
                        <Text style={[styles.subGreeting, { fontFamily: 'Fredoka-Bold' }]}>Good Morning!</Text>
                    </View>
                </View>

                {/* Service Grid */}
                <View style={styles.grid}>
                    {services.map((s) => (
                        <TouchableOpacity key={s.id} style={styles.card} onPress={() => {
                            if (s.name === 'Emergency Vet') navigation.navigate('ClinicList');
                            else if (s.name === 'Pet Buddy') navigation.navigate('PetBuddyRequest');
                            else Alert.alert(s.name, "Coming Soon!");
                        }}>
                            <MaterialCommunityIcons name={s.icon} size={32} color={s.color} />
                            <Text style={[styles.serviceText, { fontFamily: 'Fredoka-SemiBold' }]}>{s.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* AI Chatbot FAB */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("PetBot AI", "I am your pet care assistant. How can I help you today?")}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={40} color="white" />
                </TouchableOpacity>
            </View>

            {/* Sidebar Modal */}
            <Modal transparent={true} visible={isSidebarVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.closeOverlay} onPress={() => setSidebarVisible(false)} />
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarHeader}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=enoch' }} style={styles.sidebarProfilePic} />
                            <Text style={styles.sidebarName}>Enoch</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Edit Profile", "Profile editing screen loading...")}>
                                <Text style={styles.editLink}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sidebarItems}>
                            <SidebarItem icon="calendar-check" label="My Appointments" onPress={() => Alert.alert("Bookings", "Your appointments list")} />
                            <SidebarItem icon="heart-circle" label="My Pets" onPress={() => Alert.alert("Pets", "View your registered pets")} />
                            <SidebarItem icon="shield-check" label="Safety & Verification" onPress={() => Alert.alert("Safety", "Verified community settings")} />
                            <SidebarItem icon="cog" label="Settings" onPress={() => Alert.alert("Settings", "App preferences")} />
                        </View>

                        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
                            <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Sidebar Item Helper Component
const SidebarItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.sidebarItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#555" />
        <Text style={styles.sidebarItemText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
    profilePic: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, borderWidth: 2, borderColor: '#FF741C' },
    greeting: { fontSize: 14, color: '#FF741C' },
    subGreeting: { fontSize: 18, color: '#000' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    card: { width: (width - 60) / 3, backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 4 },
    serviceText: { fontSize: 11, textAlign: 'center', marginTop: 5, color: '#444' },
    bottomNav: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
    fab: { backgroundColor: '#FF741C', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    
    // Sidebar Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
    closeOverlay: { flex: 1 },
    sidebar: { width: width * 0.75, backgroundColor: 'white', height: '100%', padding: 30, elevation: 20 },
    sidebarHeader: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    sidebarProfilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#FF741C' },
    sidebarName: { fontSize: 22, fontFamily: 'Fredoka-Bold' },
    editLink: { color: '#FF741C', marginTop: 5, fontFamily: 'Fredoka-SemiBold' },
    sidebarItems: { flex: 1 },
    sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    sidebarItemText: { marginLeft: 15, fontSize: 16, fontFamily: 'Fredoka-Regular', color: '#333' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    logoutText: { color: '#FF4D4D', marginLeft: 15, fontSize: 16, fontFamily: 'Fredoka-Bold' }
});