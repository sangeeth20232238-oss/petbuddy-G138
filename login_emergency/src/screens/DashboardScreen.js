import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig'; 
import { doc, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [userData, setUserData] = useState({ 
        name: 'User', 
        profilePic: 'https://via.placeholder.com/150' 
    });

    // Real-time listener for the logged-in user
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserData({
                        name: docSnap.data().name || "User",
                        profilePic: docSnap.data().profilePic || 'https://via.placeholder.com/150'
                    });
                }
            }, (error) => {
                console.error("Firestore Listener Error:", error);
            });
            return unsubscribe; // Cleanup on unmount
        }
    }, []);

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
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header: Dynamic Profile & Notification Bell */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
                            <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
                        </TouchableOpacity>
                        <View>
                            <Text style={[styles.greeting, { fontFamily: 'Fredoka-SemiBold' }]}>Hello, {userData.name}</Text>
                            <Text style={[styles.subGreeting, { fontFamily: 'Fredoka-Bold' }]}>Good Morning!</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity style={styles.notificationBtn} onPress={() => Alert.alert("Notifications", "No new updates.")}>
                        <MaterialCommunityIcons name="bell-outline" size={28} color="#FF741C" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Service Tiles */}
                <View style={styles.grid}>
                    {services.map((s) => (
                        <TouchableOpacity key={s.id} style={styles.card} onPress={() => {
                            if (s.name === 'Emergency Vet') navigation.navigate('ClinicList');
                            else if (s.name === 'Pet Buddy') navigation.navigate('PetBuddyRequest');
                            else if (s.name === 'Adoption') navigation.navigate('Adoption');
                            else if (s.name === 'Grooming') navigation.navigate('Grooming');
                            else if (s.name === 'Pet SOS') navigation.navigate('PetSOS');
                            else if (s.name === 'Wallet') navigation.navigate('Wallet');
                            else Alert.alert(s.name, "Feature coming soon!");
                        }}>
                            <MaterialCommunityIcons name={s.icon} size={32} color={s.color} />
                            <Text style={[styles.serviceText, { fontFamily: 'Fredoka-SemiBold' }]}>{s.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* AI Assistant FAB */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => Alert.alert("PetBot AI", "How can I help you and your pet today?")}
            >
                <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
            </TouchableOpacity>

            {/* Dynamic Sidebar Modal */}
            <Modal transparent={true} visible={isSidebarVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.closeArea} onPress={() => setSidebarVisible(false)} />
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarProfile}>
                            <Image source={{ uri: userData.profilePic }} style={styles.largeProfilePic} />
                            <Text style={styles.userName}>{userData.name}</Text>
                            <TouchableOpacity onPress={() => {
                                setSidebarVisible(false);
                                navigation.navigate('EditProfile'); // Navigates to the new edit screen
                            }}>
                                <Text style={styles.editBtn}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuItems}>
                            <MenuLink icon="calendar-clock" label="Appointments" />
                            <MenuLink icon="paw" label="My Pets" />
                            <MenuLink icon="shield-check" label="Verified Buddies" />
                            <MenuLink icon="cog" label="Settings" />
                        </View>

                        <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
                            <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const MenuLink = ({ icon, label }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert(label, "Loading...")}>
        <MaterialCommunityIcons name={icon} size={24} color="#555" />
        <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', padding: 25, alignItems: 'center', justifyContent: 'space-between' },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    profilePic: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, borderWidth: 2, borderColor: '#FF741C' },
    greeting: { fontSize: 14, color: '#FF741C' },
    subGreeting: { fontSize: 18, color: '#000' },
    notificationBtn: { padding: 5 },
    notificationBadge: { position: 'absolute', right: 8, top: 8, backgroundColor: '#FF4D4D', width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: 'white' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    card: { width: (width - 60) / 3, backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 5 },
    serviceText: { fontSize: 11, textAlign: 'center', marginTop: 5, color: '#444' },
    fab: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#FF741C', width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row' },
    closeArea: { flex: 1 },
    sidebar: { width: width * 0.75, backgroundColor: 'white', height: '100%', padding: 25 },
    sidebarProfile: { alignItems: 'center', marginVertical: 40 },
    largeProfilePic: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FF741C', marginBottom: 10 },
    userName: { fontSize: 22, fontFamily: 'Fredoka-Bold' },
    editBtn: { color: '#FF741C', fontFamily: 'Fredoka-SemiBold' },
    menuItems: { flex: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    menuLabel: { marginLeft: 15, fontSize: 16, fontFamily: 'Fredoka-Regular' },
    logout: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoutText: { color: '#FF4D4D', marginLeft: 15, fontFamily: 'Fredoka-Bold', fontSize: 16 }
});