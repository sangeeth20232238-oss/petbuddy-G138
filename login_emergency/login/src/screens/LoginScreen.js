import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Added reset import

const { width, height } = Dimensions.get('window');

// DEFINED OUTSIDE TO FIX KEYBOARD BUG
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
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="black" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // LOGIN LOGIC
    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigation.replace('Dashboard'))
            .catch(() => Alert.alert("Login Failed", "Invalid email or password."));
    };

    // FORGOT PASSWORD LOGIC
    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert("Email Required", "Please enter your email address in the field above first.");
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert(
                    "Success",
                    "A password reset link has been sent to your email! Please check your inbox (and spam folder)."
                );
            })
            .catch((error) => {
                // Common error: auth/user-not-found if the email isn't in your Firebase list
                Alert.alert("Reset Error", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient colors={['#FFFFFF', '#FF741C']} locations={[0.43, 1.0]} style={styles.background} />

            <Text style={[styles.header, { fontFamily: 'Fredoka-Bold' }]}>Login</Text>

            <FloatingField label="Email" placeholder="test@petbuddy.lk" value={email} onChangeText={setEmail} />
            <FloatingField label="Password" placeholder="********" isPassword value={password} onChangeText={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} />

            <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                <Text style={[styles.forgotText, { fontFamily: 'Fredoka-SemiBold' }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainBtn} onPress={handleLogin}>
                <Text style={[styles.mainBtnText, { fontFamily: 'Fredoka-Bold' }]}>Login</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
                <View style={styles.line} /><Text style={[styles.orText, { fontFamily: 'Fredoka-Bold' }]}>Or</Text><View style={styles.line} />
            </View>

            <Text style={[styles.continueText, { fontFamily: 'Fredoka-SemiBold' }]}>Continue With</Text>

            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-google" size={26} color="#DB4437" /></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-facebook" size={26} color="#4267B2" /></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-apple" size={26} color="#000" /></TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { fontFamily: 'Fredoka-SemiBold' }]}>New Customer? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={[styles.enrolLink, { fontFamily: 'Fredoka-Bold' }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 30, paddingTop: height * 0.12 },
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
    continueText: { textAlign: 'center', marginBottom: 15, fontSize: 16 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
    socialBtn: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, elevation: 4 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { fontSize: 15 },
    enrolLink: { color: '#FF741C', fontSize: 15 }
});