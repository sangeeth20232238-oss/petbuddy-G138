import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const { width } = Dimensions.get('window');

export default function VolunteerOnboardingScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nicImage, setNicImage] = useState(null);
    const [experience, setExperience] = useState('');
    const [breeds, setBreeds] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNicUpload = () => {
        Alert.alert("Upload NIC", "Choose an option", [
            {
                text: "Take Photo", onPress: async () => {
                    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
                    if (!result.canceled) setNicImage(result.assets[0].uri);
                }
            },
            {
                text: "Choose from Gallery", onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
                    if (!result.canceled) setNicImage(result.assets[0].uri);
                }
            },
            { text: "Cancel", style: "cancel" }
        ]);
    };

    const nextStep = async () => {
        if (step === 1) {
            if (!name.trim() || !phone.trim()) {
                Alert.alert("Required", "Please enter your name and phone number.");
                return;
            }
        }
        if (step === 2) {
            if (!nicImage) {
                Alert.alert("NIC Required", "You must upload your National ID to proceed.");
                return;
            }
        }
        if (step === 3) {
            if (!experience.trim()) {
                Alert.alert("Required", "Please describe your experience.");
                return;
            }
            setLoading(true);
            try {
                await addDoc(collection(db, 'volunteers'), {
                    name: name.trim(),
                    phone: phone.trim(),
                    nicUploaded: true,
                    experience: experience.trim(),
                    breeds: breeds.trim(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                });
                Alert.alert("Success!", "Your volunteer profile has been submitted for review.", [
                    { text: "OK", onPress: () => navigation.navigate('Dashboard') }
                ]);
            } catch (e) {
                Alert.alert("Error", "Could not save your profile. Please try again.");
            } finally {
                setLoading(false);
            }
            return;
        }
        setStep(step + 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Become a Buddy</Text>
            </View>

            <View style={styles.progressRow}>
                {[1, 2, 3].map(i => (
                    <View key={i} style={[styles.bar, step >= i && styles.activeBar]} />
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="account-edit-outline" size={70} color="#FF741C" />
                        <Text style={styles.stepTitle}>Your Details</Text>
                        <Text style={styles.stepDesc}>Tell us a bit about yourself</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#AAA"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor="#AAA"
                        />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="card-account-details-outline" size={70} color="#FF741C" />
                        <Text style={styles.stepTitle}>Verify Identity</Text>
                        <Text style={styles.stepDesc}>Upload your NIC — this is required for community safety.</Text>

                        <TouchableOpacity
                            style={[styles.uploadBox, nicImage && styles.uploadedBox]}
                            onPress={handleNicUpload}
                        >
                            {nicImage ? (
                                <Image source={{ uri: nicImage }} style={styles.nicPreview} />
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={40} color="#FF741C" />
                                    <Text style={styles.uploadText}>Tap to Upload NIC</Text>
                                    <Text style={styles.uploadHint}>Camera or Gallery</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {nicImage && (
                            <TouchableOpacity onPress={handleNicUpload} style={styles.reuploadBtn}>
                                <Text style={styles.reuploadText}>Re-upload</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons name="paw" size={70} color="#FF741C" />
                        <Text style={styles.stepTitle}>Dog Experience</Text>
                        <Text style={styles.stepDesc}>Help us match you with the right pets</Text>

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your experience with dogs (e.g. 3 years, own 2 dogs...)"
                            value={experience}
                            onChangeText={setExperience}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#AAA"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Breeds you can handle (e.g. Labrador, Poodle, any)"
                            value={breeds}
                            onChangeText={setBreeds}
                            placeholderTextColor="#AAA"
                        />
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={[styles.mainBtn, loading && styles.disabledBtn]}
                onPress={nextStep}
                disabled={loading}
            >
                <Text style={styles.mainBtnText}>
                    {loading ? "Submitting..." : step === 3 ? "Submit Profile" : "Continue"}
                </Text>
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
    content: { padding: 20, alignItems: 'center', paddingBottom: 120 },
    stepContainer: { alignItems: 'center', width: '100%' },
    stepTitle: { fontSize: 24, fontFamily: 'Fredoka-Bold', marginTop: 15 },
    stepDesc: { textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 25, fontFamily: 'Fredoka-Regular' },
    input: { width: '100%', backgroundColor: '#F5F5F5', borderRadius: 14, padding: 16, marginBottom: 15, fontFamily: 'Fredoka-Regular', fontSize: 15, color: '#333' },
    textArea: { height: 110, textAlignVertical: 'top' },
    uploadBox: { width: '100%', borderStyle: 'dashed', borderWidth: 2, borderColor: '#FF741C', borderRadius: 20, padding: 40, marginTop: 10, alignItems: 'center' },
    uploadedBox: { borderColor: '#4CAF50', borderStyle: 'solid', padding: 10 },
    uploadText: { color: '#FF741C', marginTop: 10, fontFamily: 'Fredoka-SemiBold', fontSize: 16 },
    uploadHint: { color: '#AAA', marginTop: 5, fontFamily: 'Fredoka-Regular', fontSize: 13 },
    nicPreview: { width: '100%', height: 180, borderRadius: 12 },
    reuploadBtn: { marginTop: 12 },
    reuploadText: { color: '#FF741C', fontFamily: 'Fredoka-SemiBold', textDecorationLine: 'underline' },
    mainBtn: { backgroundColor: '#FF741C', padding: 20, borderRadius: 15, position: 'absolute', bottom: 40, width: width - 40, left: 20, alignItems: 'center' },
    disabledBtn: { backgroundColor: '#CCC' },
    mainBtnText: { color: 'white', fontFamily: 'Fredoka-Bold', fontSize: 16 },
});
