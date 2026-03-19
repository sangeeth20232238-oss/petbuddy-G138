// Screen 4 - Create Post Screen: Form to create a lost pet alert
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import BottomTabBar from '../../components/BottomTabBar';
import { createAlert } from '../../backend/alertService';
import { uploadImage } from '../../backend/storageService';
import styles from './createPostStyles';

const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    petName: '',
    phoneNumber: '',
    lostDate: '',
    species: '',
    breed: '',
    color: '',
    collar: '',
    location: '',
    additionalDescription: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!formData.ownerName || !formData.petName) {
      Alert.alert('Required Fields', 'Please fill in at least Owner Name and Pet Name.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageUri) {
        const uploadedUrl = await uploadImage(imageUri);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const alertData = {
        ...formData,
        imageUrl,
        description: `This is my Lost Pet named ${formData.petName}!`,
      };

      const alertId = await createAlert(alertData);

      if (alertId) {
        navigation.navigate('ShareNotify', { alertId });
      } else {
        // Navigate anyway for demo
        navigation.navigate('ShareNotify', { alertId: 'demo' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // Navigate for demo even on error
      navigation.navigate('ShareNotify', { alertId: 'demo' });
    } finally {
      setSubmitting(false);
    }
  };

  const formFields = [
    { key: 'ownerName', placeholder: 'Owner Name :' },
    { key: 'petName', placeholder: 'Pet Name :' },
    { key: 'phoneNumber', placeholder: 'Phone Number :', keyboardType: 'phone-pad' as const },
    { key: 'lostDate', placeholder: 'Lost Date :' },
    { key: 'species', placeholder: 'Species :' },
    { key: 'breed', placeholder: 'Breed :' },
    { key: 'color', placeholder: 'Color :' },
    { key: 'collar', placeholder: 'Collar :' },
    { key: 'location', placeholder: 'Location :' },
    { key: 'additionalDescription', placeholder: 'Additional Description :' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet SOS</Text>
        </View>

        {/* Upload Photo Section */}
        <TouchableOpacity style={styles.uploadSection} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadIcon}>
              <Ionicons name="image-outline" size={28} color="#E87A3A" />
            </View>
          )}
          <Text style={styles.uploadText}>Upload Pet Photo</Text>
        </TouchableOpacity>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Lost Pet Details</Text>

          {formFields.map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#BBB"
                value={formData[field.key as keyof typeof formData]}
                onChangeText={(text) => updateField(field.key, text)}
                keyboardType={(field as any).keyboardType || 'default'}
                multiline={field.key === 'additionalDescription'}
              />
              <Ionicons name="pencil-outline" size={18} color="#E87A3A" style={styles.inputIcon} />
            </View>
          ))}
        </View>

        {/* Create Post Button */}
        <TouchableOpacity
          style={[styles.createButton, submitting && styles.createButtonDisabled]}
          onPress={handleCreatePost}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
};

export default CreatePostScreen;
