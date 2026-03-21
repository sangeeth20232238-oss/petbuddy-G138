import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity,
    Dimensions, ActivityIndicator, Alert, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';

const { width } = Dimensions.get('window');

// ─── PayHere Config ───────────────────────────────────────────────
// Replace with your actual PayHere Merchant ID from payhere.lk
const PAYHERE_MERCHANT_ID = 'YOUR_MERCHANT_ID';
const AMOUNT = '399.00';
const CURRENCY = 'LKR';
const ORDER_ID = 'PETBUDDY_PREMIUM_' + Date.now();
// ─────────────────────────────────────────────────────────────────

const PERKS = [
    { icon: 'paw', text: 'Access verified pet volunteers near you' },
    { icon: 'shield-star-outline', text: 'PawGuard Complete Care package' },
    { icon: 'phone-in-talk-outline', text: 'Direct call & coordinate with buddies' },
    { icon: 'heart-circle-outline', text: 'Priority matching for your pet' },
    { icon: 'lock-open-outline', text: 'One-time payment, lifetime access' },
];

export default function PetBuddyPaywallScreen({ navigation }) {
    const [checking, setChecking] = useState(true);
    const [paying, setPaying] = useState(false);

    // Check if user already paid
    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const user = auth.currentUser;
            if (!user) { navigation.replace('Login'); return; }
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists() && snap.data().petBuddyPremium === true) {
                navigation.replace('PetBuddyRequest');
                return;
            }
        } catch (e) {
            console.log(e);
        } finally {
            setChecking(false);
        }
    };

    const handlePayment = async () => {
        const user = auth.currentUser;
        if (!user) { Alert.alert('Error', 'Please log in first.'); return; }

        setPaying(true);

        // Build PayHere sandbox/live URL
        // For testing use sandbox: https://sandbox.payhere.lk/pay/checkout
        // For live use: https://www.payhere.lk/pay/checkout
        const params = new URLSearchParams({
            merchant_id: PAYHERE_MERCHANT_ID,
            return_url: 'petbuddy://payment-success',
            cancel_url: 'petbuddy://payment-cancel',
            notify_url: 'https://petbuddy-138.web.app/payment-notify',
            order_id: ORDER_ID,
            items: 'Pet Buddy Premium Access',
            currency: CURRENCY,
            amount: AMOUNT,
            first_name: user.displayName || 'PetBuddy',
            last_name: 'User',
            email: user.email || '',
            phone: '0771234567',
            address: 'Colombo',
            city: 'Colombo',
            country: 'Sri Lanka',
        });

        const payUrl = `https://sandbox.payhere.lk/pay/checkout?${params.toString()}`;

        try {
            await Linking.openURL(payUrl);
        } catch (e) {
            Alert.alert('Error', 'Could not open payment page.');
            setPaying(false);
            return;
        }

        // Listen for app returning from browser (deep link)
        const subscription = Linking.addEventListener('url', async ({ url }) => {
            subscription.remove();
            setPaying(false);
            if (url.includes('payment-success')) {
                await unlockPremium(user.uid);
            } else {
                Alert.alert('Payment Cancelled', 'Your payment was not completed.');
            }
        });

        setPaying(false);
    };

    const unlockPremium = async (uid) => {
        try {
            await updateDoc(doc(db, 'users', uid), { petBuddyPremium: true });
            Alert.alert(
                '🐾 Welcome to Pet Buddy Premium!',
                'Your account has been unlocked. Enjoy full access!',
                [{ text: "Let's Go!", onPress: () => navigation.replace('PetBuddyRequest') }]
            );
        } catch (e) {
            Alert.alert('Error', 'Payment done but could not unlock. Contact support.');
        }
    };

    // For demo/testing — manually unlock without real payment
    const handleTestUnlock = () => {
        Alert.alert(
            'Test Mode',
            'Simulate a successful payment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Unlock',
                    onPress: async () => {
                        const user = auth.currentUser;
                        if (user) await unlockPremium(user.uid);
                    }
                }
            ]
        );
    };

    if (checking) {
        return (
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#FF741C" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pet Buddy</Text>
            </View>

            <LinearGradient
                colors={['#FFF5EF', '#FFFBF7']}
                style={styles.topSection}
            >
                <View style={styles.iconRing}>
                    <MaterialCommunityIcons name="paw" size={52} color="#FF741C" />
                </View>
                <Text style={styles.premiumLabel}>PREMIUM FEATURE</Text>
                <Text style={styles.title}>Premium Access</Text>
                <Text style={styles.subtitle}>
                    Connect with trusted volunteers who care for your pet like family.
                </Text>
            </LinearGradient>

            <View style={styles.perksBox}>
                {PERKS.map((p, i) => (
                    <View key={i} style={styles.perkRow}>
                        <View style={styles.perkIcon}>
                            <MaterialCommunityIcons name={p.icon} size={20} color="#FF741C" />
                        </View>
                        <Text style={styles.perkText}>{p.text}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.bottomSection}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>One-time unlock</Text>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceAmount}>Rs. 399</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.payBtn, paying && styles.payBtnDisabled]}
                    onPress={handlePayment}
                    disabled={paying}
                    activeOpacity={0.85}
                >
                    {paying ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="credit-card-outline" size={22} color="white" style={{ marginRight: 10 }} />
                            <Text style={styles.payBtnText}>Pay Rs. 399 via PayHere</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Test button — remove before going live */}
                <TouchableOpacity style={styles.testBtn} onPress={handleTestUnlock}>
                    <Text style={styles.testBtnText}>🧪 Test: Simulate Payment</Text>
                </TouchableOpacity>

                <Text style={styles.secureNote}>
                    🔒 Secured by PayHere · LKR · One-time charge
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFBF7' },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingHorizontal: 20, paddingBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', color: '#222', marginLeft: 50 },
    topSection: { alignItems: 'center', paddingHorizontal: 30, paddingBottom: 24, paddingTop: 10 },
    iconRing: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
        elevation: 6, shadowColor: '#FF741C', shadowOpacity: 0.2,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, marginBottom: 16,
    },
    premiumLabel: {
        fontSize: 11, fontFamily: 'Fredoka-Bold', color: '#FF741C',
        letterSpacing: 2, backgroundColor: '#FFF5EF',
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
        borderWidth: 1, borderColor: '#FF741C', marginBottom: 10,
    },
    title: { fontSize: 34, fontFamily: 'Fredoka-Bold', color: '#333' },
    subtitle: {
        textAlign: 'center', color: '#888', fontFamily: 'Fredoka-Regular',
        fontSize: 14, marginTop: 8, lineHeight: 20,
    },
    perksBox: { paddingHorizontal: 24, paddingTop: 20, flex: 1 },
    perkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    perkIcon: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: '#FFF5EF', alignItems: 'center', justifyContent: 'center',
        marginRight: 14, borderWidth: 1, borderColor: '#FFD5B8',
    },
    perkText: { fontFamily: 'Fredoka-Regular', fontSize: 14, color: '#444', flex: 1 },
    bottomSection: {
        padding: 24, borderTopWidth: 1, borderTopColor: '#F0F0F0',
        backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.06,
        shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
    },
    priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    priceLabel: { fontFamily: 'Fredoka-Regular', color: '#888', fontSize: 14 },
    priceBadge: { backgroundColor: '#FFF5EF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#FF741C' },
    priceAmount: { fontFamily: 'Fredoka-Bold', color: '#FF741C', fontSize: 20 },
    payBtn: {
        backgroundColor: '#FF741C', borderRadius: 16, padding: 18,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        elevation: 4, shadowColor: '#FF741C', shadowOpacity: 0.3,
        shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    },
    payBtnDisabled: { backgroundColor: '#CCC' },
    payBtnText: { color: 'white', fontFamily: 'Fredoka-Bold', fontSize: 17 },
    testBtn: { alignItems: 'center', marginTop: 14 },
    testBtnText: { color: '#AAA', fontFamily: 'Fredoka-SemiBold', fontSize: 13 },
    secureNote: { textAlign: 'center', color: '#CCC', fontFamily: 'Fredoka-Regular', fontSize: 12, marginTop: 10 },
});
