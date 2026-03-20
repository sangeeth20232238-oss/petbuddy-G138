import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, ScrollView, Image, TouchableOpacity,
    Dimensions, Modal, Alert, Linking, Animated, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function DashboardScreen({ navigation }) {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isNotifVisible, setNotifVisible] = useState(false);
    const [userData, setUserData] = useState({ name: 'User', profilePic: null });
    const [notifications, setNotifications] = useState([]);
    const [clearedIds, setClearedIds] = useState([]);
    const [profilePicError, setProfilePicError] = useState(false);

    // Sidebar animation — slides in from LEFT
    const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    // Notification panel animation — slides up from BOTTOM
    const notifAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        const loadClearedIds = async () => {
            try {
                const stored = await AsyncStorage.getItem('cleared_notification_ids');
                if (stored) setClearedIds(JSON.parse(stored));
            } catch (e) { console.error('Error loading cleared IDs:', e); }
        };
        loadClearedIds();

        let unsubUser = () => {};
        let unsubBookings = () => {};
        let unsubAdoptions = () => {};
        let unsubGrooming = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            unsubUser();
            unsubBookings();
            unsubAdoptions();
            unsubGrooming();

            if (user) {
                unsubUser = onSnapshot(doc(db, 'users', user.uid), (snap) => {
                    if (snap.exists()) {
                        setProfilePicError(false);
                        setUserData({
                            name: snap.data().name || 'User',
                            profilePic: snap.data().profilePic || null,
                        });
                    }
                });

                // Bookings listener
                const qB = query(collection(db, 'bookings'), where('userId', '==', user.uid));
                unsubBookings = onSnapshot(qB, (snap) => {
                    const bList = snap.docs.map(d => ({ id: d.id, ...d.data(), notifType: 'booking' }));
                    updateNotifications(bList, 'booking');
                });

                // Adoptions listener
                const qA = query(collection(db, 'adoptions'), where('userId', '==', user.uid));
                unsubAdoptions = onSnapshot(qA, (snap) => {
                    const aList = snap.docs.map(d => ({ id: d.id, ...d.data(), notifType: 'adoption' }));
                    updateNotifications(aList, 'adoption');
                });

                // Grooming listener
                const qG = query(collection(db, 'groomingBookings'), where('userId', '==', user.uid));
                unsubGrooming = onSnapshot(qG, (snap) => {
                    const gList = snap.docs.map(d => ({ id: d.id, ...d.data(), notifType: 'grooming' }));
                    updateNotifications(gList, 'grooming');
                });
            } else {
                setUserData({ name: 'User', profilePic: null });
                setNotifications([]);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubUser();
            unsubBookings();
            unsubAdoptions();
            unsubGrooming();
        };
    }, []);

    const [rawBookings, setRawBookings] = useState([]);
    const [rawAdoptions, setRawAdoptions] = useState([]);
    const [rawGrooming, setRawGrooming] = useState([]);

    const updateNotifications = (newList, type) => {
        if (type === 'booking') setRawBookings(newList);
        else if (type === 'grooming') setRawGrooming(newList);
        else setRawAdoptions(newList);
    };

    useEffect(() => {
        const combined = [...rawBookings, ...rawAdoptions, ...rawGrooming]
            .filter(n => n.status === 'confirmed' || n.status === 'rejected' || n.status === 'pending')
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setNotifications(combined);
    }, [rawBookings, rawAdoptions, rawGrooming]);

    // ── Sidebar controls ──
    const openSidebar = () => {
        setSidebarVisible(true);
        Animated.parallel([
            Animated.timing(sidebarAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        ]).start();
    };
    const closeSidebar = () => {
        Animated.parallel([
            Animated.timing(sidebarAnim, { toValue: -SIDEBAR_WIDTH, duration: 240, useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
        ]).start(() => setSidebarVisible(false));
    };

    // ── Notification controls ──
    const openNotif = () => {
        setNotifVisible(true);
        Animated.spring(notifAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 12 }).start();
    };
    const closeNotif = () => {
        Animated.timing(notifAnim, { toValue: height, duration: 260, useNativeDriver: true })
            .start(() => setNotifVisible(false));
    };

    const visibleNotifs = notifications.filter(n => !clearedIds.includes(n.id));
    
    const clearAllNotifications = async () => {
        const ids = notifications.map(n => n.id);
        const newCleared = [...new Set([...clearedIds, ...ids])];
        setClearedIds(newCleared);
        try {
            await AsyncStorage.setItem('cleared_notification_ids', JSON.stringify(newCleared));
        } catch (e) { console.error('Error saving cleared IDs:', e); }
    };

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

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={openSidebar}>
                        {userData.profilePic && !profilePicError ? (
                            <Image
                                source={{ uri: userData.profilePic }}
                                style={styles.profilePic}
                                onError={() => setProfilePicError(true)}
                            />
                        ) : (
                            <View style={[styles.profilePic, styles.profilePicFallback]}>
                                <MaterialCommunityIcons name="account" size={30} color="#FF741C" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.greeting, { fontFamily: 'Fredoka-SemiBold' }]}>Hello, {userData.name}</Text>
                        <Text style={[styles.subGreeting, { fontFamily: 'Fredoka-Bold' }]}>Good Morning!</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationBtn} onPress={openNotif}>
                    <MaterialCommunityIcons name="bell-outline" size={28} color="#FF741C" />
                    {visibleNotifs.length > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeCount}>
                                {visibleNotifs.length > 9 ? '9+' : visibleNotifs.length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Service Tiles - Now FIXED at the top */}
            <View style={styles.grid}>
                {services.map((s) => (
                    <TouchableOpacity key={s.id} style={styles.card} onPress={() => {
                        if (s.name === 'Emergency Vet') navigation.navigate('ClinicList');
                        else if (s.name === 'Pet Buddy') navigation.navigate('PetBuddyPaywall');
                        else if (s.name === 'Adoption') navigation.navigate('Adoption');
                        else if (s.name === 'Grooming') navigation.navigate('Grooming');
                        else if (s.name === 'Pet SOS') navigation.navigate('PetSOS');
                        else if (s.name === 'Wallet') navigation.navigate('Wallet');
                        else Alert.alert(s.name, 'Feature coming soon!');
                    }}>
                        <MaterialCommunityIcons name={s.icon} size={32} color={s.color} />
                        <Text style={[styles.serviceText, { fontFamily: 'Fredoka-SemiBold' }]}>{s.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Blog Section - Only this part is SCROLLABLE */}
            <View style={styles.blogSection}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View style={styles.blogHeader}>
                        <Text style={styles.blogTitle}>Pet Care Tips 🐾</Text>
                    </View>
                    
                    {BLOG_POSTS.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.blogCard}
                            onPress={() => Linking.openURL(item.url).catch(() => Alert.alert('Error', 'Could not open link.'))}
                            activeOpacity={0.88}
                        >
                            <Image source={{ uri: item.image }} style={styles.blogImg} />
                            <View style={styles.blogTagRow}>
                                <View style={[styles.blogTag, { backgroundColor: item.tagColor + '22' }]}>
                                    <Text style={[styles.blogTagText, { color: item.tagColor }]}>{item.tag}</Text>
                                </View>
                                <Text style={styles.blogReadTime}>{item.readTime}</Text>
                            </View>
                            <Text style={styles.blogCardTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.blogCardBody} numberOfLines={2}>{item.body}</Text>
                            <Text style={styles.blogReadMore}>Read more →</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* AI Assistant FAB */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate('ChatBot')}
            >
                <MaterialCommunityIcons name="robot-happy-outline" size={38} color="white" />
            </TouchableOpacity>

            {/* ── Notifications Panel ── */}
            <Modal transparent visible={isNotifVisible} animationType="none" onRequestClose={closeNotif}>
                <View style={styles.fullOverlay}>
                    <TouchableOpacity style={styles.overlayDismiss} onPress={closeNotif} activeOpacity={1} />
                    <Animated.View style={[styles.notifPanel, { transform: [{ translateY: notifAnim }] }]}>
                        <View style={styles.handleBar} />
                        <View style={styles.notifHeader}>
                            <View style={styles.notifTitleRow}>
                                <View style={styles.notifIconBg}>
                                    <MaterialCommunityIcons name="bell-ring" size={18} color="#FF741C" />
                                </View>
                                <Text style={styles.notifTitle}>Notifications</Text>
                                {visibleNotifs.length > 0 && (
                                    <View style={styles.notifCountBadge}>
                                        <Text style={styles.notifCountText}>{visibleNotifs.length}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {visibleNotifs.length > 0 && (
                                    <TouchableOpacity
                                        onPress={clearAllNotifications}
                                        style={styles.clearBtn}
                                    >
                                        <Text style={styles.clearBtnText}>Clear all</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={closeNotif} style={styles.closeBtn}>
                                    <Ionicons name="close" size={18} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            {visibleNotifs.length === 0 ? (
                                <View style={styles.notifEmpty}>
                                    <MaterialCommunityIcons name="bell-sleep-outline" size={56} color="#EEE" />
                                    <Text style={styles.notifEmptyTitle}>All caught up!</Text>
                                    <Text style={styles.notifEmptyText}>No appointment updates yet</Text>
                                </View>
                            ) : (
                                visibleNotifs.map(n => {
                                    const isPending = n.status === 'pending';
                                    const ok = n.status === 'confirmed';
                                    const bgColor = isPending ? '#FFF9EB' : (ok ? '#F0FFF4' : '#FFF5F5');
                                    const iconColor = isPending ? '#F59E0B' : (ok ? '#4CAF50' : '#F44336');
                                    const iconName = isPending ? 'clock-outline' : (ok ? 'check-circle' : 'close-circle');

                                    return (
                                        <View key={n.id} style={[styles.notifItem, { backgroundColor: bgColor }]}>
                                            <View style={[styles.notifAvatarBg, { backgroundColor: isPending ? '#FEF3C7' : (ok ? '#E8F5E9' : '#FFEBEE') }]}>
                                                <MaterialCommunityIcons
                                                    name={iconName}
                                                    size={26}
                                                    color={iconColor}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.notifMsg}>
                                                    {n.notifType === 'adoption' ? 'Adoption Request' : 'Appointment with'}{' '}
                                                    <Text style={{ fontFamily: 'Fredoka-Bold', color: '#333' }}>
                                                        {n.notifType === 'adoption' ? n.petName : n.doctorName || n.salonName || n.salon}
                                                    </Text>
                                                </Text>
                                                <Text style={[styles.notifStatus, { color: n.status === 'confirmed' ? '#4CAF50' : '#F44336' }]}>
                                                    {n.notifType === 'adoption' ? 'Adoption ' : ''}
                                                    {n.status ? (n.status.charAt(0).toUpperCase() + n.status.slice(1)) : 'Status Unknown'}
                                                </Text>
                                                <Text style={styles.notifDetail}>
                                                    {n.notifType === 'adoption' 
                                                        ? `Request for ${n.petName || 'Pet'} has been ${n.status || 'processed'}`
                                                        : `${n.doctorName || n.salonName || n.salon || 'Service'} - ${n.date || 'TBD'}`}
                                                </Text>
                                                <Text style={styles.notifSub}>📅 {n.date || 'TBD'}  ·  🕐 {n.timeSlot || n.time || 'TBD'}</Text>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>

            {/* ── Sidebar ── */}
            {isSidebarVisible && (
                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    {/* Dimmed overlay */}
                    <Animated.View
                        style={[styles.sidebarOverlay, { opacity: overlayAnim }]}
                        pointerEvents="auto"
                    >
                        <TouchableOpacity style={{ flex: 1 }} onPress={closeSidebar} activeOpacity={1} />
                    </Animated.View>

                    {/* Sidebar panel */}
                    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
                        <View style={styles.sidebarProfile}>
                            {userData.profilePic && !profilePicError ? (
                                <Image
                                    source={{ uri: userData.profilePic }}
                                    style={styles.largeProfilePic}
                                    onError={() => setProfilePicError(true)}
                                />
                            ) : (
                                <View style={[styles.largeProfilePic, styles.profilePicFallback]}>
                                    <MaterialCommunityIcons name="account" size={44} color="#FF741C" />
                                </View>
                            )}
                            <Text style={styles.userName}>{userData.name}</Text>
                            <TouchableOpacity onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('EditProfile'), 300); }}>
                                <Text style={styles.editBtn}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuItems}>
                            <MenuLink icon="calendar-clock" label="Appointments" onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('Appointments'), 300); }} />
                            <MenuLink icon="shield-check" label="Verified Buddies" onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('PetBuddyRequest'), 300); }} />
                            <MenuLink icon="file-document-outline" label="Terms & Conditions" onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('Terms'), 300); }} />
                        </View>

                        <TouchableOpacity style={styles.logout} onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('Login'), 300); }}>
                            <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </SafeAreaView>
    );
}

const BLOG_POSTS = [
    {
        id: '1',
        title: '5 Signs Your Dog Needs Emergency Vet Care',
        body: "Knowing when to rush to the vet can save your pet's life. Watch for difficulty breathing, pale gums, seizures, or sudden collapse.",
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
        tag: 'Emergency', tagColor: '#FF4D4D', readTime: '3 min read',
        url: 'https://www.akc.org/expert-advice/health/emergency-vet-visit/',
    },
    {
        id: '2',
        title: 'How to Choose the Right Pet Buddy for Your Dog',
        body: "A good pet buddy understands your dog's breed, energy level, and temperament. Here's what to look for when selecting a volunteer.",
        image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400',
        tag: 'Pet Buddy', tagColor: '#FF741C', readTime: '4 min read',
        url: 'https://www.rover.com/blog/dog/how-to-find-a-dog-sitter/',
    },
    {
        id: '3',
        title: 'Vaccination Schedule Every Pet Owner Must Know',
        body: "Keeping up with your pet's vaccines protects them from deadly diseases. Here's a complete guide for dogs and cats.",
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        tag: 'Health', tagColor: '#4CAF50', readTime: '5 min read',
        url: 'https://www.akc.org/expert-advice/health/puppy-vaccination-schedule/',
    },
    {
        id: '4',
        title: 'Best Foods to Keep Your Cat Healthy & Happy',
        body: "Nutrition is the foundation of your cat's health. Discover the best food options and what to avoid.",
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
        tag: 'Nutrition', tagColor: '#9C27B0', readTime: '3 min read',
        url: 'https://www.petmd.com/cat/nutrition/evr_ct_what_can_cats_eat',
    },
    {
        id: '5',
        title: 'Adopting a Rescue Dog: What to Expect in Week 1',
        body: "The first week with a rescue dog can be overwhelming. Here's how to make the transition smooth and loving.",
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
        tag: 'Adoption', tagColor: '#2196F3', readTime: '6 min read',
        url: 'https://www.aspca.org/adopt/adoption-tips',
    },
];

const MenuLink = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={22} color="#555" />
        <Text style={styles.menuLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#CCC" style={{ marginLeft: 'auto' }} />
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
    notificationBadge: { position: 'absolute', right: 2, top: 2, backgroundColor: '#FF4D4D', minWidth: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: 'white', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
    badgeCount: { color: 'white', fontSize: 10, fontFamily: 'Fredoka-Bold' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    card: { width: (width - 60) / 3, backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 5 },
    serviceText: { fontSize: 11, textAlign: 'center', marginTop: 5, color: '#444' },
    fab: { position: 'absolute', bottom: 110, alignSelf: 'center', backgroundColor: '#FF741C', width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    blogSection: { marginTop: 10, paddingBottom: 20 },
    blogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
    blogTitle: { fontSize: 18, fontFamily: 'Fredoka-Bold', color: '#333' },
    blogCard: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, marginHorizontal: 20, marginBottom: 14 },
    blogImg: { width: '100%', height: 160 },
    blogTagRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 10 },
    blogTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    blogTagText: { fontSize: 11, fontFamily: 'Fredoka-Bold' },
    blogReadTime: { fontSize: 11, color: '#BBB', fontFamily: 'Fredoka-Regular' },
    blogCardTitle: { fontSize: 14, fontFamily: 'Fredoka-Bold', color: '#333', paddingHorizontal: 12, marginTop: 6 },
    blogCardBody: { fontSize: 12, fontFamily: 'Fredoka-Regular', color: '#888', paddingHorizontal: 12, marginTop: 4, lineHeight: 17 },
    blogReadMore: { fontSize: 12, fontFamily: 'Fredoka-SemiBold', color: '#FF741C', paddingHorizontal: 12, paddingBottom: 14, marginTop: 2 },

    // Notification panel
    fullOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    overlayDismiss: { flex: 1 },
    notifPanel: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: height * 0.72, paddingBottom: 10 },
    handleBar: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 2 },
    notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    notifIconBg: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
    notifTitle: { fontSize: 18, fontFamily: 'Fredoka-Bold', color: '#333' },
    notifCountBadge: { backgroundColor: '#FF741C', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1 },
    notifCountText: { color: 'white', fontSize: 11, fontFamily: 'Fredoka-Bold' },
    profilePicFallback: { backgroundColor: '#FFF0E8', justifyContent: 'center', alignItems: 'center' },
    clearBtn: { backgroundColor: '#FFF0E8', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
    clearBtnText: { color: '#FF741C', fontSize: 12, fontFamily: 'Fredoka-SemiBold' },
    closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
    notifEmpty: { alignItems: 'center', paddingVertical: 50 },
    notifEmptyTitle: { fontFamily: 'Fredoka-Bold', fontSize: 18, color: '#CCC', marginTop: 14 },
    notifEmptyText: { color: '#DDD', fontFamily: 'Fredoka-Regular', marginTop: 4, fontSize: 13 },
    notifItem: { flexDirection: 'row', alignItems: 'center', padding: 14, marginHorizontal: 16, marginTop: 10, borderRadius: 16, gap: 12 },
    notifAvatarBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    notifMsg: { fontFamily: 'Fredoka-Regular', color: '#555', fontSize: 13, lineHeight: 19, marginBottom: 5 },
    notifStatusPill: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 5 },
    notifStatusPillText: { color: 'white', fontSize: 11, fontFamily: 'Fredoka-Bold' },
    notifSub: { fontFamily: 'Fredoka-Regular', color: '#AAA', fontSize: 11 },

    // Sidebar
    sidebarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDEBAR_WIDTH, backgroundColor: 'white', padding: 25, elevation: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
    sidebarProfile: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
    largeProfilePic: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FF741C', marginBottom: 10 },
    userName: { fontSize: 22, fontFamily: 'Fredoka-Bold', color: '#333' },
    editBtn: { color: '#FF741C', fontFamily: 'Fredoka-SemiBold', marginTop: 4 },
    menuItems: { flex: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    menuLabel: { marginLeft: 14, fontSize: 16, fontFamily: 'Fredoka-Regular', color: '#333', flex: 1 },
    logout: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, marginBottom: 10 },
    logoutText: { color: '#FF4D4D', marginLeft: 14, fontFamily: 'Fredoka-Bold', fontSize: 16 },
});
