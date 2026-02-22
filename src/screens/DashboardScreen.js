import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

<<<<<<< HEAD
const { width } = Dimensions.get('window');
=======
const { width, height } = Dimensions.get('window');
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2

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
<<<<<<< HEAD
=======
                {/* Header */}
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=enoch' }} style={styles.profilePic} />
                        </TouchableOpacity>
                        <View>
                            <Text style={[styles.greeting, { fontFamily: 'Fredoka-SemiBold' }]}>Hello, Enoch</Text>
                            <Text style={[styles.subGreeting, { fontFamily: 'Fredoka-Bold' }]}>Good Morning!</Text>
                        </View>
                    </View>
<<<<<<< HEAD
                </View>

                <View style={styles.grid}>
                    {services.map((service) => (
                        <TouchableOpacity 
                            key={service.id} 
                            style={styles.card}
                            // Updated Navigation Logic
                            onPress={() => {
                                if (service.name === 'Emergency Vet') {
                                    navigation.navigate('ClinicList');
                                } else {
                                    Alert.alert(service.name, "Feature updates in progress.");
                                }
                            }}
                        >
=======
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={26} color="black" />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>

                {/* Service Grid */}
                <View style={styles.grid}>
                    {services.map((service) => (
                        <TouchableOpacity key={service.id} style={styles.card}>
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name={service.icon} size={32} color={service.color} />
                            </View>
                            <Text style={[styles.serviceText, { fontFamily: 'Fredoka-SemiBold' }]}>{service.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Daily Tip */}
                <View style={styles.smartBox}>
                    <LinearGradient colors={['#FF741C', '#FF9F63']} style={styles.tipCard}>
                        <Text style={[styles.tipText, { fontFamily: 'Fredoka-Regular' }]}>
                           Daily Pet Tip: Keep your pets hydrated during the heat!
                        </Text>
                    </LinearGradient>
                </View>
<<<<<<< HEAD
            </ScrollView>

            {/* AI Bot Center */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("PetBot AI", "How can I help you today?")}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
                </TouchableOpacity>
            </View>
=======

                {/* Blogs */}
                <View style={styles.blogSection}>
                    <Text style={[styles.sectionTitle, { fontFamily: 'Fredoka-Bold' }]}>Blogs</Text>
                    <View style={styles.blogRow}>
                        <Image source={{ uri: 'https://placedog.net/400/300' }} style={styles.blogImage} />
                    </View>
                </View>
            </ScrollView>

            {/* --- CLEAN BOTTOM NAVIGATION (ONLY AI BOT) --- */}
            <View style={styles.bottomNav}>
                <View style={styles.fabContainer}>
                    <TouchableOpacity 
                        style={styles.fab} 
                        onPress={() => Alert.alert("PetBot AI", "I am your pet assistant! Ask me anything.")}
                    >
                        <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- SIDEBAR DRAWER MODAL --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSidebarVisible}
                onRequestClose={() => setSidebarVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.dismissArea} onPress={() => setSidebarVisible(false)} />
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarHeader}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=enoch' }} style={styles.sidebarProfilePic} />
                            <Text style={[styles.sidebarName, {fontFamily: 'Fredoka-Bold'}]}>Enoch</Text>
                            <Text style={[styles.sidebarEmail, {fontFamily: 'Fredoka-Regular'}]}>enoch@petbuddy.lk</Text>
                        </View>
                        
                        <View style={styles.menuList}>
                            <TouchableOpacity style={styles.sidebarItem}>
                                <Ionicons name="person-outline" size={24} color="#FF741C" />
                                <Text style={styles.sidebarItemText}>My Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarItem}>
                                <Ionicons name="settings-outline" size={24} color="#FF741C" />
                                <Text style={styles.sidebarItemText}>Settings</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarItem} onPress={() => {
                                setSidebarVisible(false);
                                navigation.replace('Login');
                            }}>
                                <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
                                <Text style={[styles.sidebarItemText, {color: '#FF4D4D'}]}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    profilePic: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, borderWidth: 2, borderColor: '#FF741C' },
    greeting: { fontSize: 14, color: '#FF741C' },
    subGreeting: { fontSize: 18, color: '#000' },
<<<<<<< HEAD
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
=======
    notificationBtn: { padding: 10 },
    badge: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, backgroundColor: '#FF741C', borderRadius: 5, borderWidth: 2, borderColor: '#FFF' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
    card: { width: (width - 60) / 3, backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 4 },
    iconContainer: { height: 40, justifyContent: 'center', alignItems: 'center' },
    serviceText: { fontSize: 11, textAlign: 'center', color: '#444', marginTop: 5 },
    smartBox: { paddingHorizontal: 20, marginVertical: 10 },
    tipCard: { borderRadius: 20, padding: 20 },
    tipText: { color: 'white', fontSize: 14, textAlign: 'center' },
<<<<<<< HEAD
    bottomNav: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center' },
    fab: { backgroundColor: '#FF741C', width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', elevation: 8 }
=======
    blogSection: { padding: 20 },
    sectionTitle: { fontSize: 18, marginBottom: 15 },
    blogRow: { flexDirection: 'row', justifyContent: 'center' },
    blogImage: { width: width - 40, height: 180, borderRadius: 20 },
    
    // NAVIGATION STYLES
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabContainer: {
        bottom: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        backgroundColor: '#FF741C',
        width: 75,
        height: 75,
        borderRadius: 37.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF741C',
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },

    // SIDEBAR MODAL STYLES
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    dismissArea: { flex: 1 },
    sidebar: {
        width: width * 0.75,
        height: '100%',
        backgroundColor: '#FFF',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        padding: 30,
        elevation: 20,
    },
    sidebarHeader: { alignItems: 'center', marginBottom: 50, marginTop: 40 },
    sidebarProfilePic: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, borderWidth: 3, borderColor: '#FF741C' },
    sidebarName: { fontSize: 24, color: '#333' },
    sidebarEmail: { fontSize: 14, color: '#666' },
    menuList: { marginTop: 20 },
    sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    sidebarItemText: { marginLeft: 15, fontSize: 17, color: '#444', fontFamily: 'Fredoka-SemiBold' },
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
});