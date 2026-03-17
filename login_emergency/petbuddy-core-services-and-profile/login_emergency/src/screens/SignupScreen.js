import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

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

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleRegister = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                Alert.alert("Success", "Account created for PetBuddy!");
                navigation.replace('Dashboard'); 
            })
            .catch(error => Alert.alert("Registration Failed", error.message));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient colors={['#FFFFFF', '#FF741C']} locations={[0.50, 1.0]} style={styles.background} />

            <Text style={[styles.header, { fontFamily: 'Fredoka-Bold' }]}>Sign Up</Text>

            <FloatingField label="Email" placeholder="test@petbuddy.lk" value={email} onChangeText={setEmail} />
            <FloatingField label="Password" placeholder="********" isPassword value={password} onChangeText={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
            <FloatingField label="Confirm Password" placeholder="********" isPassword value={confirmPassword} onChangeText={setConfirmPassword} showPassword={showPassword} setShowPassword={setShowPassword} />

            <View style={styles.termsContainer}>
                <TouchableOpacity style={[styles.checkbox, isChecked && styles.checkboxActive]} onPress={() => setIsChecked(!isChecked)}>
                    {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
                </TouchableOpacity>
                <Text style={[styles.termsText, { fontFamily: 'Fredoka-SemiBold' }]}>
                    I agree to all the <Text style={styles.linkText}>Terms and Conditions</Text>
                </Text>
            </View>

            <TouchableOpacity style={[styles.mainBtn, !isChecked && { opacity: 0.6 }]} disabled={!isChecked} onPress={handleRegister}>
                <Text style={[styles.mainBtnText, { fontFamily: 'Fredoka-Bold' }]}>Register</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { fontFamily: 'Fredoka-SemiBold' }]}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.loginLink, { fontFamily: 'Fredoka-Bold' }]}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 30, paddingTop: height * 0.08 },
    background: { ...StyleSheet.absoluteFillObject },
    header: { fontSize: 44, textAlign: 'center', marginBottom: 40, color: '#000' },
    inputWrapper: { marginBottom: 30, width: '100%' },
    floatingText: { position: 'absolute', top: -12, left: 20, zIndex: 2, color: '#FF741C', fontSize: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 6 },
    box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FF741C', borderRadius: 20, paddingHorizontal: 20, height: 62 },
    input: { flex: 1, fontSize: 16, color: '#000' },
    termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingHorizontal: 5 },
    checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#FF741C', borderRadius: 6, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
    checkboxActive: { backgroundColor: '#FF741C' },
    termsText: { fontSize: 13, color: '#000', flex: 1 },
    linkText: { color: '#FF741C', textDecorationLine: 'underline' },
    mainBtn: { backgroundColor: '#FF741C', padding: 18, borderRadius: 15, marginTop: 10, alignItems: 'center', elevation: 4 },
    mainBtnText: { color: '#FFF', fontSize: 24 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 35 },
    footerText: { fontSize: 15 },
    loginLink: { color: '#FF741C', fontSize: 15 }
});