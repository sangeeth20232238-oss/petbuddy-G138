import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { auth, db } from '../../../firebaseConfig'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    setName(docSnap.data().name || "");
                    setImage(docSnap.data().profilePic || null);
                }
            };
            fetchProfile();
        }
    }, []);

    const handleSave = async () => {
        if (!name) return Alert.alert("Error", "Name is required.");
        setUploading(true);

        try {
            let finalImageUrl = image;

            // Convert local image to base64 and store in Firestore
            if (image && !image.startsWith('http') && !image.startsWith('data:')) {
                const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
                finalImageUrl = `data:image/jpeg;base64,${base64}`;
            }

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                profilePic: finalImageUrl,
                lastUpdate: new Date().toISOString()
            }, { merge: true });

            setUploading(false);
            Alert.alert("Success", "Profile updated online!", [
                { text: "OK", onPress: () => navigation.navigate('Dashboard') }
            ]);
        } catch (error) {
            setUploading(false);
            Alert.alert("Upload Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Profile</Text>
            
            <TouchableOpacity onPress={async () => {
                let res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1] });
                if (!res.canceled) setImage(res.assets[0].uri);
            }}>
                <Image source={{ uri: image || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                <Text style={styles.changeBtn}>Change Photo</Text>
            </TouchableOpacity>

            <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Full Name" 
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={uploading}>
                {uploading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Online</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', padding: 30 },
    title: { fontSize: 24, fontWeight: '700', marginVertical: 30 },
    avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#F0F0F0' },
    changeBtn: { color: '#FF741C', marginTop: 15, fontWeight: '600' },
    input: { width: width - 60, borderBottomWidth: 1, borderColor: '#DDD', padding: 15, marginTop: 40, fontSize: 18 },
    saveBtn: { backgroundColor: '#FF741C', width: width - 60, padding: 20, borderRadius: 15, marginTop: 50, alignItems: 'center' },
    saveBtnText: { color: 'white', fontSize: 18, fontWeight: '700' }
});