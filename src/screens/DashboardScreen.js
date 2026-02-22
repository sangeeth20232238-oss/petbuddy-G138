import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
            </ScrollView>

            {/* AI Bot Center */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("PetBot AI", "How can I help you today?")}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
                </TouchableOpacity>
            </View>
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
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
    card: { width: (width - 60) / 3, backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 4 },
    iconContainer: { height: 40, justifyContent: 'center', alignItems: 'center' },
    serviceText: { fontSize: 11, textAlign: 'center', color: '#444', marginTop: 5 },
    smartBox: { paddingHorizontal: 20, marginVertical: 10 },
    tipCard: { borderRadius: 20, padding: 20 },
    tipText: { color: 'white', fontSize: 14, textAlign: 'center' },
    bottomNav: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center' },
    fab: { backgroundColor: '#FF741C', width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});