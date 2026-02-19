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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) =>
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
        a1.start();
        a2.start();
        a3.start();
        return () => { a1.stop(); a2.stop(); a3.stop(); };
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.typingContainer}>
            <View style={styles.aiAvatar}>
                <MaterialCommunityIcons name="robot-excited-outline" size={16} color="#FF741C" />
            </View>
            <View style={styles.typingBubble}>
                {[dot1, dot2, dot3].map((dot, i) => (
                    <Animated.View
                        key={i}
                        style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
                    />
                ))}
            </View>
        </View>
    );
};

// ─── Message Bubble ──────────────────────────────────────────────────────────
const MessageBubble: React.FC<{ message: Message; index: number }> = ({ message, index }) => {
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

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onSuggestionPress: (text: string) => void }> = ({ onSuggestionPress }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, [pulseAnim]);

    const suggestions = [
        '🐶 Best food for my dog?',
        '🐱 Cat grooming tips',
        '💉 Vaccination schedule',
        '🐾 Adopt a pet near me',
        '🎾 Exercise ideas for pets',
    ];

    return (
        <View style={styles.emptyContainer}>
            <Animated.View style={[styles.emptyIconWrapper, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                    colors={['#FF9A5C', '#FF741C']}
                    style={styles.emptyIconGradient}
                >
                    <MaterialCommunityIcons name="robot-excited-outline" size={60} color="#FFF" />
                </LinearGradient>
            </Animated.View>
            <Text style={styles.emptyTitle}>AI Chat Bot 🐾</Text>
            <Text style={styles.emptySubtitle}>Your smart pet companion , 
                ask me anything about your furry friends!</Text>
            <View style={styles.suggestionsGrid}>
                {suggestions.map((s, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.suggestionChip}
                        activeOpacity={0.7}
                        onPress={() => onSuggestionPress(s)}
                    >
                        <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// ─── Demo Response (frontend only) ──────────────────────────────────────────
async function fetchAIResponse(_userMessage: string): Promise<string> {
    // Demo delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    return 'This is a demo message. 🐾 ';
}

// ─── Main Chat Screen ─────────────────────────────────────────────────────────
export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const sendBtnScale = useRef(new Animated.Value(1)).current;

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    const animateSendButton = () => {
        Animated.sequence([
            Animated.timing(sendBtnScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
            Animated.spring(sendBtnScale, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
        ]).start();
    };

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        scrollToBottom();

        try {
            const responseText = await fetchAIResponse(text.trim());
            const aiMsg: Message = {
                id: `a-${Date.now()}`,
                text: responseText,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errMsg: Message = {
                id: `a-${Date.now()}`,
                text: '⚠️ Unable to reach the AI service. Please check your connection or API configuration.',
                sender: 'ai',
                timestamp: new Date(),
            };
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

    const handleSuggestionPress = useCallback(async (text: string) => {
        await sendMessage(text);
    }, [sendMessage]);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <LinearGradient
                colors={['#FFFFFF', '#FFFFFF', '#FFF0E6', '#FF741C']}
                locations={[0, 0.43, 0.75, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
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

                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                        <Feather name="more-vertical" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                {/* ── Chat Area ── */}
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        contentContainerStyle={[
                            styles.chatContent,
                            messages.length === 0 && styles.chatContentEmpty,
                        ]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<EmptyState onSuggestionPress={handleSuggestionPress} />}
                        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                        onContentSizeChange={scrollToBottom}
                        renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
                    />

                    {/* ── Input Bar ── */}
                    <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
                        <View style={[styles.inputBar, isFocused && styles.inputBarFocused]}>
                            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
                                <Feather name="mic" size={20} color="#FF741C" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.textInput}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Ask about your pet..."
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
                                        <Ionicons
                                            name="arrow-up"
                                            size={20}
                                            color="#3e3d3d"
                                        />
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    safeArea: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        backgroundColor: 'rgba(255,255,255,0.85)',
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 8,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        letterSpacing: 0.3,
    },
    onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
    onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' },
    onlineText: { fontSize: 12, color: '#666', fontWeight: '400' },

    // Chat
    chatContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    chatContentEmpty: {
        flex: 1,
        justifyContent: 'center',
    },

    // Messages
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
        maxWidth: '85%',
    },
    userMessageWrapper: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    aiMessageWrapper: {
        alignSelf: 'flex-start',
    },
    bubbleColumn: { flexDirection: 'column' },
    bubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxWidth: SCREEN_WIDTH * 0.72,
    },
    userBubble: {
        backgroundColor: '#FF741C',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    messageText: { fontSize: 15, lineHeight: 22 },
    userText: { color: '#FFFFFF', fontWeight: '400' },
    aiText: { color: '#1A1A1A', fontWeight: '400' },
    timestamp: { fontSize: 11, marginTop: 4, color: '#999' },
    userTimestamp: { textAlign: 'right', marginRight: 4 },
    aiTimestamp: { marginLeft: 4 },

    // AI Avatar
    aiAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF0E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#FFD4B3',
    },

    // Typing
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF741C',
        opacity: 0.8,
    },

    // Empty state
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    emptyIconWrapper: {
        marginBottom: 20,
        shadowColor: '#FF741C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    emptyIconGradient: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 32,
        maxWidth: 260,
    },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    suggestionChip: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: '#FFD4B3',
        shadowColor: '#FF741C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    suggestionText: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
    },

    // Input Bar
    inputSafeArea: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingTop: 8,
        marginBottom: 15,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    inputBarFocused: {
        borderColor: 'rgba(255,116,28,0.4)',
        shadowColor: '#FF741C',
        shadowOpacity: 0.15,
    },
    micBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,116,28,0.08)',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
        paddingHorizontal: 8,
        paddingVertical: 6,
        maxHeight: 500,
        lineHeight: 22,
    },
    sendBtn: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    sendBtnDisabled: {
        opacity: 0.6,
    },
    sendBtnGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimer: {
        fontSize: 14,
        color: 'rgba(37, 36, 36, 0.7)',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: -1,
    },
});
