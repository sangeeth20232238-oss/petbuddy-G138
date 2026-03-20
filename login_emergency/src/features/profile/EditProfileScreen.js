import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [petName, setPetName] = useState('');
    const [image, setImage] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, 'users', user.uid)).then(snap => {
            if (snap.exists()) {
                setName(snap.data().name || '');
                setPetName(snap.data().petName || '');
                const pic = snap.data().profilePic || null;
                setImage(pic);
                setImgError(false);
            }
        });
    }, []);

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true, aspect: [1, 1], quality: 0.7,
        });
        if (!res.canceled) {
            setImage(res.assets[0].uri);
            setImgError(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Error', 'Name is required.');
        setUploading(true);
        try {
            let finalImageUrl = image;
            if (image && !image.startsWith('http') && !image.startsWith('data:')) {
                const base64 = await FileSystem.readAsStringAsync(image, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                finalImageUrl = `data:image/jpeg;base64,${base64}`;
            }
            await setDoc(doc(db, 'users', user.uid), {
                name: name.trim(),
                petName: petName.trim(),
                profilePic: finalImageUrl || '',
                lastUpdate: new Date().toISOString(),
            }, { merge: true });
            Alert.alert('Success', 'Profile updated!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setUploading(false);
        }
    };

    const showImage = image && !imgError;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FF741C" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontFamily: 'Fredoka-Bold' }]}>Edit Profile</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Avatar */}
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
                {showImage ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.avatar}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                        <MaterialCommunityIcons name="account" size={60} color="#FF741C" />
                    </View>
                )}
                <View style={styles.cameraOverlay}>
                    <MaterialCommunityIcons name="camera" size={18} color="white" />
                </View>
            </TouchableOpacity>
            <Text style={[styles.changeBtn, { fontFamily: 'Fredoka-SemiBold' }]}>Tap to change photo</Text>

            {/* Name input */}
            <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontFamily: 'Fredoka-SemiBold' }]}>Full Name</Text>
                <TextInput
                    style={[styles.input, { fontFamily: 'Fredoka-Regular' }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#CCC"
                />
            </View>

            {/* Pet Name input */}
            <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontFamily: 'Fredoka-SemiBold' }]}>Pet Name</Text>
                <TextInput
                    style={[styles.input, { fontFamily: 'Fredoka-Regular' }]}
                    value={petName}
                    onChangeText={setPetName}
                    placeholder="Enter your pet's name"
                    placeholderTextColor="#CCC"
                />
            </View>

            <TouchableOpacity style={[styles.saveBtn, uploading && { opacity: 0.7 }]} onPress={handleSave} disabled={uploading}>
                {uploading
                    ? <ActivityIndicator color="white" />
                    : <Text style={[styles.saveBtnText, { fontFamily: 'Fredoka-Bold' }]}>Save Changes</Text>
                }
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', paddingHorizontal: 16, paddingTop: 45, paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, color: '#333' },
    avatarWrapper: { marginTop: 40, position: 'relative' },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FF741C' },
    avatarFallback: { backgroundColor: '#FFF0E8', justifyContent: 'center', alignItems: 'center' },
    cameraOverlay: {
        position: 'absolute', bottom: 2, right: 2,
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#FF741C', justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: 'white',
    },
    changeBtn: { color: '#FF741C', marginTop: 10, fontSize: 13 },
    inputWrapper: { width: width - 60, marginTop: 36 },
    inputLabel: { color: '#FF741C', fontSize: 14, marginBottom: 8, marginLeft: 4 },
    input: {
        borderWidth: 1, borderColor: '#FF741C', borderRadius: 16,
        paddingHorizontal: 20, height: 56, fontSize: 16, color: '#333',
    },
    saveBtn: {
        backgroundColor: '#FF741C', width: width - 60,
        padding: 18, borderRadius: 15, marginTop: 40, alignItems: 'center', elevation: 4,
    },
    saveBtnText: { color: 'white', fontSize: 18 },
});
