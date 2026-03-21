import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TERMS = [
    {
        title: '1. Acceptance of Terms',
        body: 'By using PetBuddy, you agree to these Terms and Conditions. If you do not agree, please do not use the app.',
    },
    {
        title: '2. Pet Buddy Premium',
        body: 'The Pet Buddy feature requires a one-time payment of Rs. 399. This grants lifetime access to the volunteer network. Payments are non-refundable once access is granted.',
    },
    {
        title: '3. Volunteer Responsibility',
        body: 'PetBuddy volunteers are community members who have submitted their NIC for verification. PetBuddy does not guarantee the conduct of volunteers and is not liable for any incidents during volunteer-assisted care.',
    },
    {
        title: '4. Emergency Vet Bookings',
        body: 'Appointment bookings are subject to clinic confirmation. PetBuddy is a platform connecting users with clinics and does not provide veterinary services directly.',
    },
    {
        title: '5. User Data',
        body: 'We collect your name, email, and profile photo to provide our services. Your data is stored securely on Firebase and is never sold to third parties.',
    },
    {
        title: '6. Adoption',
        body: 'Pet adoption listings are managed by registered shelters. PetBuddy facilitates the connection but is not responsible for the condition or history of adopted animals.',
    },
    {
        title: '7. Changes to Terms',
        body: 'PetBuddy reserves the right to update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.',
    },
    {
        title: '8. Contact',
        body: 'For any queries, contact us at support@petbuddy.lk',
    },
];

export default function TermsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerIconBg}>
                        <MaterialCommunityIcons name="file-document-outline" size={36} color="#FF741C" />
                    </View>
                    <Text style={[styles.bannerTitle, { fontFamily: 'Fredoka-Bold' }]}>PetBuddy Terms</Text>
                    <Text style={[styles.bannerSub, { fontFamily: 'Fredoka-Regular' }]}>Last updated: June 2025</Text>
                </View>

                {TERMS.map((section, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={[styles.numberText, { fontFamily: 'Fredoka-Bold' }]}>{i + 1}</Text>
                            </View>
                            <Text style={[styles.sectionTitle, { fontFamily: 'Fredoka-Bold' }]}>
                                {section.title.replace(/^\d+\.\s/, '')}
                            </Text>
                        </View>
                        <Text style={[styles.sectionBody, { fontFamily: 'Fredoka-Regular' }]}>{section.body}</Text>
                    </View>
                ))}

                <Text style={[styles.footerText, { fontFamily: 'Fredoka-Regular' }]}>
                    © 2025 PetBuddy. All rights reserved.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 45, paddingBottom: 10,
        backgroundColor: '#FFF',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', color: '#222', marginLeft: 50 },
    content: { padding: 20, paddingBottom: 50 },
    banner: {
        alignItems: 'center', paddingVertical: 30,
        backgroundColor: '#FFF5F0', borderRadius: 24,
        marginBottom: 24,
    },
    bannerIconBg: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#FFE8DC', justifyContent: 'center', alignItems: 'center',
        marginBottom: 12,
    },
    bannerTitle: { fontSize: 24, color: '#FF741C' },
    bannerSub: { fontSize: 13, color: '#AAA', marginTop: 4 },
    card: {
        backgroundColor: '#FAFAFA', borderRadius: 18, padding: 16,
        marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#FF741C',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
    numberBadge: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: '#FF741C', justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },
    numberText: { color: 'white', fontSize: 13 },
    sectionTitle: { fontSize: 15, color: '#333', flex: 1 },
    sectionBody: { fontSize: 13, color: '#666', lineHeight: 22, paddingLeft: 40 },
    footerText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginTop: 10 },
});
