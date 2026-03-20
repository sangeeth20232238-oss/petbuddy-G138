import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    Dimensions, StatusBar, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { doc, setDoc, getDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

const { height } = Dimensions.get('window');

const FloatingField = ({ label, placeholder, isPassword, value, onChangeText, showPassword, setShowPassword }) => (
    <View style={styles.inputWrapper}>
        <Text style={[styles.floatingText, { fontFamily: 'Fredoka-SemiBold' }]}>{label}</Text>
        <View style={styles.box}>
            <TextInput
                style={[styles.input, { fontFamily: 'Fredoka-Regular' }]}
                placeholder={placeholder}
                placeholderTextColor="rgba(0,0,0,0.2)"
                secureTextEntry={isPassword && !showPassword}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                keyboardType={!isPassword ? 'email-address' : 'default'}
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="black" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '506859726227-q6vr5uiipc4gqrn3d69gau239tqg0gmp.apps.googleusercontent.com',
        androidClientId: '506859726227-b9svulvdh5shrvf648po83a2uvngbukk.apps.googleusercontent.com',
        expoClientId: '506859726227-q6vr5uiipc4gqrn3d69gau239tqg0gmp.apps.googleusercontent.com',
        selectAccount: true,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            setGoogleLoading(true);
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(async (result) => {
                    const user = result.user;
                    const userRef = doc(db, 'users', user.uid);
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) {
                        await setDoc(userRef, {
                            name: user.displayName || 'User',
                            email: user.email,
                            profilePic: user.photoURL || '',
                            createdAt: new Date(),
                        });
                    }
                    navigation.replace('Dashboard');
                })
                .catch((err) => {
                    console.error('Google Sign-In Error:', err);
                    Alert.alert('Google Sign-In Failed', err.message);
                })
                .finally(() => setGoogleLoading(false));
        }
    }, [response]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter your email and password');
            return;
        }
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigation.replace('Dashboard'))
            .catch(() => Alert.alert('Login Failed', 'Invalid email or password.'))
            .finally(() => setLoading(false));
    };

    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert('Email Required', 'Please enter your email address first.');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => Alert.alert('Success', 'Password reset link sent to your email!'))
            .catch((err) => Alert.alert('Error', err.message));
    };

    const handleGoogleLogin = () => {
        if (!request) {
            Alert.alert('Please wait', 'Google Sign-In is loading...');
            return;
        }
        promptAsync();
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="dark-content" />
            <LinearGradient colors={['#FFFFFF', '#FF741C']} locations={[0.43, 1.0]} style={styles.background} />

            <Text style={[styles.header, { fontFamily: 'Fredoka-Bold' }]}>Login</Text>

            <FloatingField
                label="Email"
                placeholder="test@petbuddy.lk"
                value={email}
                onChangeText={setEmail}
            />
            <FloatingField
                label="Password"
                placeholder="********"
                isPassword
                value={password}
                onChangeText={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />

            <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                <Text style={[styles.forgotText, { fontFamily: 'Fredoka-SemiBold' }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.mainBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
                <Text style={[styles.mainBtnText, { fontFamily: 'Fredoka-Bold' }]}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={[styles.orText, { fontFamily: 'Fredoka-Bold' }]}>Or</Text>
                <View style={styles.line} />
            </View>

            {/* Google Sign-In */}
            <TouchableOpacity
                style={[styles.googleBtn, googleLoading && { opacity: 0.7 }]}
                onPress={handleGoogleLogin}
                disabled={googleLoading}
                activeOpacity={0.85}
            >
                {googleLoading ? (
                    <ActivityIndicator color="#DB4437" size="small" />
                ) : (
                    <>
                        <Ionicons name="logo-google" size={22} color="#DB4437" />
                        <Text style={[styles.googleBtnText, { fontFamily: 'Fredoka-SemiBold' }]}>
                            Continue with Google
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { fontFamily: 'Fredoka-SemiBold' }]}>New Customer? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={[styles.enrolLink, { fontFamily: 'Fredoka-Bold' }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            {/* Terms link */}
            <TouchableOpacity style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>
                <Text style={[styles.termsText, { fontFamily: 'Fredoka-Regular' }]}>
                    By continuing, you agree to our{' '}
                    <Text style={{ fontFamily: 'Fredoka-SemiBold', textDecorationLine: 'underline', color: '#FF741C' }}>
                        Terms & Conditions
                    </Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingTop: height * 0.12, paddingBottom: 40 },
    background: { ...StyleSheet.absoluteFillObject },
    header: { fontSize: 44, textAlign: 'center', marginBottom: 50, color: '#000' },
    inputWrapper: { marginBottom: 35, width: '100%' },
    floatingText: { position: 'absolute', top: -12, left: 20, zIndex: 2, color: '#FF741C', fontSize: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 6 },
    box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FF741C', borderRadius: 20, paddingHorizontal: 20, height: 62 },
    input: { flex: 1, fontSize: 16, color: '#000' },
    forgotBtn: { alignSelf: 'flex-end', marginTop: -15 },
    forgotText: { textDecorationLine: 'underline' },
    mainBtn: { backgroundColor: '#FF741C', padding: 18, borderRadius: 15, marginTop: 35, alignItems: 'center', elevation: 4 },
    mainBtnText: { color: '#FFF', fontSize: 22 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
    line: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    orText: { marginHorizontal: 15, fontSize: 16 },
    googleBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFF', borderRadius: 15, paddingVertical: 15,
        elevation: 4, gap: 12, borderWidth: 1, borderColor: '#F0F0F0',
    },
    googleBtnText: { fontSize: 16, color: '#333' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
    footerText: { fontSize: 15 },
    enrolLink: { color: '#FF741C', fontSize: 15 },
    termsLink: { alignItems: 'center', marginTop: 18 },
    termsText: { fontSize: 12, color: 'rgba(0,0,0,0.45)', textAlign: 'center', lineHeight: 18 },
});
