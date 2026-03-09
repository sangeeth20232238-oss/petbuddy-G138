import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// THIS WAS MISSING - DEFINING THE WIDTH
const { width } = Dimensions.get('window');

export default function VolunteerOnboardingScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [nicUploaded, setNicUploaded] = useState(false);

    const handleUpload = () => {
        Alert.alert("Camera/Gallery", "Select your NIC photo", [
            { text: "Take Photo", onPress: () => setNicUploaded(true) },
            { text: "Choose from Gallery", onPress: () => setNicUploaded(true) },
            { text: "Cancel", style: "cancel" }
        ]);
    };

    const nextStep = () => {
        if (step === 1 && !nicUploaded) {
            Alert.alert("NIC Required", "You must upload your National ID to proceed.");
            return;
        }
        if (step < 3) setStep(step + 1);
        else navigation.navigate('Dashboard');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Buddy Verification</Text>
            </View>

            <View style={styles.progressRow}>
                {[1, 2, 3].map(i => (
                    <View key={i} style={[styles.bar, step >= i && styles.activeBar]} />
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="card-account-details-outline" size={80} color="#FF741C" />
                        <Text style={styles.stepTitle}>Verify Identity</Text>
                        <Text style={styles.stepDesc}>Upload your NIC for community safety.</Text>
                        <TouchableOpacity 
                            style={[styles.uploadBox, nicUploaded && styles.uploadedBox]} 
                            onPress={handleUpload}
                        >
                            <Ionicons name={nicUploaded ? "checkmark-circle" : "cloud-upload-outline"} size={40} color={nicUploaded ? "#4CAF50" : "#FF741C"} />
                            <Text style={[styles.uploadText, nicUploaded && styles.uploadedText]}>
                                {nicUploaded ? "NIC Uploaded" : "Upload NIC"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="paw" size={80} color="#FF741C" />
                        <Text style={styles.stepTitle}>Your Experience</Text>
                        <Text style={styles.stepDesc}>Do you have experience with large dogs?</Text>
                        <TouchableOpacity style={styles.qBox}>
                            <Text style={styles.qText}>Can you handle large breeds?</Text>
                            <Ionicons name="square-outline" size={24} color="#CCC" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextStep}>
                            <Text style={styles.skipBtn}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="shield-check-outline" size={80} color="#FF741C" />
                        <Text style={styles.stepTitle}>Final Check</Text>
                        <Text style={styles.stepDesc}>Agree to the volunteer code of conduct?</Text>
                        <TouchableOpacity onPress={nextStep}>
                            <Text style={styles.skipBtn}>Decide Later</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity 
                style={[styles.mainBtn, (step === 1 && !nicUploaded) && styles.disabledBtn]} 
                onPress={nextStep}
            >
                <Text style={styles.mainBtnText}>{step === 3 ? "Finish Signup" : "Continue"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
    title: { fontSize: 20, fontFamily: 'Fredoka-Bold', marginLeft: 40 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 40, marginBottom: 30 },
    bar: { height: 6, width: '30%', backgroundColor: '#EEE', borderRadius: 3 },
    activeBar: { backgroundColor: '#FF741C' },
    content: { padding: 20, alignItems: 'center' },
    stepContainer: { alignItems: 'center', width: '100%' },
    stepTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginTop: 20 },
    stepDesc: { textAlign: 'center', color: '#666', marginTop: 10 },
    uploadBox: { width: '100%', borderStyle: 'dashed', borderWidth: 2, borderColor: '#FF741C', borderRadius: 20, padding: 40, marginTop: 40, alignItems: 'center' },
    uploadedBox: { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' },
    uploadText: { color: '#FF741C', marginTop: 10, fontFamily: 'Fredoka-SemiBold' },
    uploadedText: { color: '#4CAF50' },
    mainBtn: { backgroundColor: '#FF741C', padding: 20, borderRadius: 15, position: 'absolute', bottom: 40, width: width - 40, left: 20, alignItems: 'center' },
    disabledBtn: { backgroundColor: '#CCC' },
    mainBtnText: { color: 'white', fontFamily: 'Fredoka-Bold', fontSize: 16 },
    skipBtn: { color: '#999', marginTop: 30, fontFamily: 'Fredoka-SemiBold', textDecorationLine: 'underline' },
    qBox: { flexDirection: 'row', width: '100%', padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12, marginTop: 15, alignItems: 'center', justifyContent: 'space-between' },
    qText: { color: '#444' }
});d