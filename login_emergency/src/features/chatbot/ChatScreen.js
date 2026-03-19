import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Keyboard,
    Modal,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Typing Indicator ────────────────────────────────────────────────────────
const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay(600 - delay),
                ])
            );
        const a1 = animateDot(dot1, 0);
        const a2 = animateDot(dot2, 150);
        const a3 = animateDot(dot3, 300);
        a1.start(); a2.start(); a3.start();
        return () => { a1.stop(); a2.stop(); a3.stop(); };
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.typingContainer}>
            <View style={styles.aiAvatar}>
                <MaterialCommunityIcons name="robot-excited-outline" size={16} color="#FF741C" />
            </View>
            <View style={styles.typingBubble}>
                {[dot1, dot2, dot3].map((dot, i) => (
                    <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />
                ))}
            </View>
        </View>
    );
};

// ─── Message Bubble ──────────────────────────────────────────────────────────
const MessageBubble = ({ message }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(message.sender === 'user' ? 30 : -30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: 50, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const isUser = message.sender === 'user';
    const timeStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Animated.View
            style={[
                styles.messageWrapper,
                isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
            ]}
        >
            {!isUser && (
                <View style={styles.aiAvatar}>
                    <MaterialCommunityIcons name="robot-excited-outline" size={16} color="#FF741C" />
                </View>
            )}
            <View style={styles.bubbleColumn}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                        {message.text}
                    </Text>
                </View>
                <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                    {timeStr}
                </Text>
            </View>
        </Animated.View>
    );
};

// ─── Auto Moving Symptom Row ─────────────────────────────────────────────────
const AutoMovingRow = ({ data, onPress }) => {
    const scrollRef = useRef(null);
    const scrollX = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!scrollRef.current) return;
            scrollX.current += 0.7;
            if (scrollX.current >= 600) scrollX.current = 0;
            scrollRef.current.scrollTo({ x: scrollX.current, animated: false });
        }, 25);
        return () => clearInterval(interval);
    }, []);

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.autoRowContent}
        >
            {[...data, ...data].map((item, index) => (
                <TouchableOpacity
                    key={`${item}-${index}`}
                    style={styles.autoSuggestionChip}
                    activeOpacity={0.8}
                    onPress={() => onPress(item)}
                >
                    <Text style={styles.autoSuggestionText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ onSuggestionPress }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, [pulseAnim]);

    const row1 = ['abdominal pain', 'breathing difficulty', 'broken bones', 'coughing', 'crusting of the skin', 'dehydration', 'diarrhea', 'eye discharge', 'eye inflammation'];
    const row2 = ['hair loss', 'joint pain', 'lameness', 'lethargy', 'loss of appetite', 'muscle pain', 'muscle stiffness', 'nasal discharge', 'pneumonia'];
    const row3 = ['seizures', 'skin lesions', 'sneezing', 'swelling', 'upset stomach', 'vomiting', 'weakness', 'weight loss'];

    return (
        <View style={styles.emptyContainer}>
            <Animated.View style={[styles.emptyIconWrapper, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#FF9A5C', '#FF741C']} style={styles.emptyIconGradient}>
                    <MaterialCommunityIcons name="robot-excited-outline" size={60} color="#FFF" />
                </LinearGradient>
            </Animated.View>
            <Text style={styles.emptyTitle}>AI Chat Bot 🐾</Text>
            <Text style={styles.emptySubtitle}>Your smart dog companion.</Text>
            <Text style={[styles.emptySubtitle, { marginBottom: 4 }]}>Tap a symptom below</Text>
            <Text style={[styles.emptySubtitle, { marginBottom: 10 }]}>or type what happened to your dog in the message bar</Text>
            <View style={styles.autoRowsWrapper}>
                <AutoMovingRow data={row1} onPress={onSuggestionPress} />
                <AutoMovingRow data={row2} onPress={onSuggestionPress} />
                <AutoMovingRow data={row3} onPress={onSuggestionPress} />
            </View>
        </View>
    );
};

// ─── Fetch AI Response ────────────────────────────────────────────────────────
async function fetchAIResponse(userMessage) {
    const API_URL = 'https://chatbot-4nngqcaljq-uc.a.run.app';
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON response'); }
        return data.reply || 'No response from server.';
    } catch (error) {
        throw error;
    }
}

// ─── Main Chat Screen ─────────────────────────────────────────────────────────
export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const flatListRef = useRef(null);
    const sendBtnScale = useRef(new Animated.Value(1)).current;

    const scrollToBottom = useCallback(() => {
        setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 100);
    }, []);

    const animateSendButton = () => {
        Animated.sequence([
            Animated.timing(sendBtnScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
            Animated.spring(sendBtnScale, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
        ]).start();
    };

    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;
        const userMsg = { id: `u-${Date.now()}`, text: text.trim(), sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        scrollToBottom();
        try {
            const responseText = await fetchAIResponse(text.trim());
            const aiMsg = { id: `a-${Date.now()}`, text: responseText, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            const errMsg = { id: `a-${Date.now()}`, text: '⚠️ Unable to reach the AI service. Please check your connection.', sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    }, [scrollToBottom]);

    const handleSend = useCallback(async () => {
        if (!inputText.trim()) return;
        animateSendButton();
        Keyboard.dismiss();
        const text = inputText;
        setInputText('');
        await sendMessage(text);
    }, [inputText, sendMessage]);

    const handleNewChat = () => { setMessages([]); setShowMenu(false); };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <LinearGradient
                colors={['#FFFFFF', '#FFFFFF', '#FFF0E6', '#FF741C']}
                locations={[0, 0.43, 0.75, 1]}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <LinearGradient colors={['#FF9A5C', '#FF741C']} style={styles.headerAvatar}>
                            <MaterialCommunityIcons name="robot-excited-outline" size={18} color="#FFF" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.headerTitle}>AI Chat Bot</Text>
                            <View style={styles.onlineRow}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.onlineText}>Online</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => setShowMenu(true)}>
                        <Feather name="more-vertical" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                {/* Menu Modal */}
                <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleNewChat}>
                                <Feather name="plus-circle" size={20} color="#1A1A1A" />
                                <Text style={styles.menuText}>New Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Chat Area */}
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        contentContainerStyle={[styles.chatContent, messages.length === 0 && styles.chatContentEmpty]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<EmptyState onSuggestionPress={sendMessage} />}
                        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                        onContentSizeChange={scrollToBottom}
                        renderItem={({ item }) => <MessageBubble message={item} />}
                    />

                    {/* Input Bar */}
                    <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
                        <View style={[styles.inputBar, isFocused && styles.inputBarFocused]}>
                            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
                                <Feather name="mic" size={20} color="#FF741C" />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.textInput}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="What happened to your dog?"
                                placeholderTextColor="#787878"
                                multiline
                                maxLength={1000}
                                returnKeyType="send"
                                onSubmitEditing={handleSend}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <Animated.View style={{ transform: [{ scale: sendBtnScale }] }}>
                                <TouchableOpacity
                                    style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                                    onPress={handleSend}
                                    activeOpacity={0.8}
                                    disabled={!inputText.trim()}
                                >
                                    <LinearGradient
                                        colors={inputText.trim() ? ['#FF9A5C', '#FF741C'] : ['#E0E0E0', '#CCCCCC']}
                                        style={styles.sendBtnGradient}
                                    >
                                        <Ionicons name="arrow-up" size={20} color="#3e3d3d" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <Text style={styles.disclaimer}>Always consult a qualified vet for medical advice. 🐾</Text>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)', backgroundColor: 'rgba(255,255,255,0.85)' },
    headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 8 },
    headerAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', letterSpacing: 0.3 },
    onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
    onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' },
    onlineText: { fontSize: 12, color: '#666', fontWeight: '400' },
    chatContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    chatContentEmpty: { flex: 1, justifyContent: 'center' },
    messageWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', maxWidth: '85%' },
    userMessageWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    aiMessageWrapper: { alignSelf: 'flex-start' },
    bubbleColumn: { flexDirection: 'column' },
    bubble: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, maxWidth: SCREEN_WIDTH * 0.72 },
    userBubble: { backgroundColor: '#FF741C', borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    messageText: { fontSize: 15, lineHeight: 22 },
    userText: { color: '#FFFFFF', fontWeight: '400' },
    aiText: { color: '#1A1A1A', fontWeight: '400' },
    timestamp: { fontSize: 11, marginTop: 4, color: '#999' },
    userTimestamp: { textAlign: 'right', marginRight: 4 },
    aiTimestamp: { marginLeft: 4 },
    aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF0E6', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4, borderWidth: 1, borderColor: '#FFD4B3' },
    typingContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16, paddingHorizontal: 16 },
    typingBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14, gap: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF741C', opacity: 0.8 },
    emptyContainer: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 0, marginTop: -50 },
    emptyIconWrapper: { marginBottom: 14, marginTop: -10, shadowColor: '#FF741C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
    emptyIconGradient: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    emptySubtitle: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 17, marginBottom: 2, maxWidth: 260 },
    autoRowsWrapper: { width: '100%', marginTop: -2 },
    autoRowContent: { paddingHorizontal: 6, alignItems: 'center' },
    autoSuggestionChip: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.2, borderColor: '#FFD4B3', shadowColor: '#FF741C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 2, marginRight: 8, marginBottom: 10, minHeight: 40, justifyContent: 'center', alignItems: 'center' },
    autoSuggestionText: { fontSize: 11, color: '#1A1A1A', fontWeight: '500', textTransform: 'capitalize' },
    inputSafeArea: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingTop: 8, marginBottom: 15 },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#FFFFFF', borderRadius: 30, paddingHorizontal: 8, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)' },
    inputBarFocused: { borderColor: 'rgba(255,116,28,0.4)', shadowColor: '#FF741C', shadowOpacity: 0.15 },
    micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,116,28,0.08)' },
    textInput: { flex: 1, fontSize: 16, color: '#1A1A1A', paddingHorizontal: 8, paddingVertical: 6, maxHeight: 500, lineHeight: 22 },
    sendBtn: { borderRadius: 20, overflow: 'hidden' },
    sendBtnDisabled: { opacity: 0.6 },
    sendBtnGradient: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    disclaimer: { fontSize: 14, color: 'rgba(37, 36, 36, 0.7)', textAlign: 'center', marginTop: 12, marginBottom: -1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 60, paddingRight: 16 },
    menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
    menuText: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
});
