import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Dimensions,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'AdoptionForm'>;

const Checkbox = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onSelect} activeOpacity={0.7}>
        <View style={styles.checkbox}>
            {selected && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

export default function AdoptionFormScreen({ route, navigation }: Props) {
    const { pet } = route.params;
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [outdoorSpace, setOutdoorSpace] = useState<'yes' | 'no' | null>(null);
    const [pastExperience, setPastExperience] = useState<'yes' | 'no' | null>(null);
    const [walks, setWalks] = useState<'yes' | 'no' | 'notSure' | null>(null);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(fullName.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid full name (letters only, min 2 characters).');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-]/g, ''))) {
            Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number.');
            return;
        }

        if (!outdoorSpace || !pastExperience || !walks) {
            Alert.alert('Validation Error', 'Please answer all lifestyle questions.');
            return;
        }

        const API_URL = ENDPOINTS.ADOPTIONS;
        setIsLoading(true);
        try {

            // Add a 20-second timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);


            const response = await fetch(API_URL, {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: pet.id,
                    petName: pet.name,
                    applicantName: fullName,
                    applicantPhone: phone,
                    outdoorSpace,
                    pastExperience,
                    walks,
                    reason,
                }),
            });

            clearTimeout(timeoutId);

            const responseData = await response.json().catch(() => ({}));

            if (response.ok) {
                Alert.alert('Success', 'Your adoption request has been sent!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                const errorMessage = responseData.message || responseData.error || 'Server responded with an error';
                Alert.alert('Server Error', `Error ${response.status}: ${errorMessage}`);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                Alert.alert('Timeout', 'The server is taking too long to respond. Is your PC and Phone on the same Wi-Fi?');
            } else if (error.message === 'Network request failed') {
                Alert.alert('Connection Error', `Could not reach the server at ${API_URL}. \n\n1. Make sure your PC and Phone are on the same Wi-Fi.\n2. Check if the backend is running.\n3. Verify your PC\'s IP address in src/config/api.ts.`);
            } else {
                Alert.alert('Error', error.message || 'An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Pet Adoption Request
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Contact Info</Text>

                    {/* Full Name */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Full Name</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={[styles.textArea, { height: 50 }]}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Phone Number</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={[styles.textArea, { height: 50 }]}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Lifestyle</Text>
                    <Text style={styles.lifestyleSubtitle}>
                        We will ask you some questions for finding you pets of your choice...
                    </Text>

                    {/* Question 1 */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Do you have outdoor space at home?</Text>
                        <View style={styles.optionsRow}>
                            <Checkbox
                                label="Yes"
                                selected={outdoorSpace === 'yes'}
                                onSelect={() => setOutdoorSpace('yes')}
                            />
                            <Checkbox
                                label="No"
                                selected={outdoorSpace === 'no'}
                                onSelect={() => setOutdoorSpace('no')}
                            />
                        </View>
                    </View>

                    {/* Question 2 */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Do you have past experience in pets?</Text>
                        <View style={styles.optionsRow}>
                            <Checkbox
                                label="Yes"
                                selected={pastExperience === 'yes'}
                                onSelect={() => setPastExperience('yes')}
                            />
                            <Checkbox
                                label="No"
                                selected={pastExperience === 'no'}
                                onSelect={() => setPastExperience('no')}
                            />
                        </View>
                    </View>

                    {/* Question 3 */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Will you be able to take out your pets on walk?</Text>
                        <View style={styles.optionsRow}>
                            <Checkbox
                                label="Yes"
                                selected={walks === 'yes'}
                                onSelect={() => setWalks('yes')}
                            />
                            <Checkbox
                                label="No"
                                selected={walks === 'no'}
                                onSelect={() => setWalks('no')}
                            />
                            <Checkbox
                                label="Not sure"
                                selected={walks === 'notSure'}
                                onSelect={() => setWalks('notSure')}
                            />
                        </View>
                    </View>

                    {/* Text Input Section */}
                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>Why do you like this pet more, and why do you want to adopt it?</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={4}
                                placeholder="If not interested simply write no..."
                                placeholderTextColor="#999"
                                value={reason}
                                onChangeText={setReason}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>

                {/* Send Button */}
                <TouchableOpacity
                    style={[styles.sendButton, isLoading && styles.disabledButton]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={isLoading}
                >
                    <Text style={styles.sendButtonText}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEFE5',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
        elevation: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingTop: 105,
        paddingBottom: 110,
    },

    formCard: {
        backgroundColor: '#FFEFE5',
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: -40,
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF741C',
        textAlign: 'center',
        marginBottom: 15,
    },
    lifestyleSubtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
        lineHeight: 24,
    },
    questionSection: {
        marginBottom: 25,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 15,
        lineHeight: 22,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 40,
        rowGap: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 1.5,
        borderColor: '#FF741C',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#FF741C',
        borderRadius: 2,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#555',
    },
    textAreaContainer: {
        borderWidth: 1.5,
        borderColor: '#FF741C',
        borderRadius: 4,
        marginTop: 5,
        backgroundColor: 'transparent',
    },
    textArea: {
        padding: 15,
        height: 100,
        fontSize: 15,
        color: '#333',
        fontStyle: 'italic',
    },
    sendButton: {
        backgroundColor: '#FF741C',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 40,
        shadowColor: '#FF741C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#CCC',
        shadowColor: 'transparent',
        elevation: 0,
    },
});
