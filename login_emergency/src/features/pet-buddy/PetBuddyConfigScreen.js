import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PetBuddyConfigScreen({ route, navigation }) {
    const { buddy, fullCare } = route.params;

    const handleCall = () => {
        if (!buddy.phone) {
            Alert.alert("No number", "This buddy has no phone number on file.");
            return;
        }
        Linking.openURL(`tel:${buddy.phone}`).catch(() =>
            Alert.alert("Error", "Unable to make a call from this device.")
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pet Buddy</Text>
            </View>

            <View style={styles.body}>
                {/* Big Avatar */}
                <View style={styles.avatarRing}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarLetter}>{buddy.name?.[0]?.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={styles.buddyName}>{buddy.name}</Text>
                <Text style={styles.buddyRole}>{buddy.role || 'Verified Volunteer'}</Text>
                {buddy.breeds ? <Text style={styles.buddyBreeds}>🐾 Handles: {buddy.breeds}</Text> : null}

                {fullCare && (
                    <View style={styles.careBadge}>
                        <MaterialCommunityIcons name="shield-star-outline" size={16} color="#FF741C" />
                        <Text style={styles.careBadgeText}>PawGuard Complete Care</Text>
                    </View>
                )}

                <Text style={styles.readyText}>Ready to help your furry friend! 🐶</Text>

                {/* Phone display */}
                <View style={styles.phoneBox}>
                    <Ionicons name="call-outline" size={18} color="#888" />
                    <Text style={styles.phoneNumber}>{buddy.phone || 'Not available'}</Text>
                </View>

                {/* Big Call Button */}
                <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
                    <View style={styles.callInner}>
                        <Ionicons name="call" size={28} color="white" />
                    </View>
                    <Text style={styles.callBtnText}>Call {buddy.name}</Text>
                </TouchableOpacity>

                <Text style={styles.hint}>Tap to call and coordinate directly</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.doneBtn}>
                <Text style={styles.doneText}>Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingHorizontal: 20, paddingBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', color: '#222', marginLeft: 50 },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, marginTop: -30 },
    avatarRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FF741C', alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: '#FFF5EF' },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FF741C', alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { color: 'white', fontSize: 42, fontFamily: 'Fredoka-Bold' },
    buddyName: { fontSize: 28, fontFamily: 'Fredoka-Bold', color: '#333' },
    buddyRole: { color: '#AAA', fontFamily: 'Fredoka-Regular', fontSize: 14, marginTop: 4 },
    buddyBreeds: { color: '#FF741C', fontFamily: 'Fredoka-Regular', fontSize: 13, marginTop: 6 },
    careBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10, borderWidth: 1, borderColor: '#FF741C' },
    careBadgeText: { marginLeft: 6, fontFamily: 'Fredoka-SemiBold', color: '#FF741C', fontSize: 13 },
    readyText: { fontSize: 15, color: '#888', fontFamily: 'Fredoka-Regular', marginTop: 16, marginBottom: 10 },
    phoneBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 30 },
    phoneNumber: { fontSize: 16, fontFamily: 'Fredoka-SemiBold', color: '#555' },
    callBtn: { alignItems: 'center' },
    callInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#4CAF50', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    callBtnText: { marginTop: 10, fontSize: 16, fontFamily: 'Fredoka-Bold', color: '#4CAF50' },
    hint: { color: '#CCC', fontFamily: 'Fredoka-Regular', fontSize: 12, marginTop: 8 },
    doneBtn: { paddingBottom: 36 },
    doneText: { color: '#CCC', fontFamily: 'Fredoka-SemiBold', textDecorationLine: 'underline', fontSize: 14 },
});
