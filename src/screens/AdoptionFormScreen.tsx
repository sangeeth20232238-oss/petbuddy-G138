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

export default function AdoptionFormScreen({ navigation }: Props) {
    const [outdoorSpace, setOutdoorSpace] = useState<'yes' | 'no' | null>(null);
    const [pastExperience, setPastExperience] = useState<'yes' | 'no' | null>(null);
    const [walks, setWalks] = useState<'yes' | 'no' | 'notSure' | null>(null);
    const [reason, setReason] = useState('');

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
                    <Text style={styles.sectionTitle}>Lifestyle</Text>
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
                                selected={walkies === 'yes'}
                                onSelect={() => setWalkies('yes')}
                            />
                            <Checkbox
                                label="No"
                                selected={walkies === 'no'}
                                onSelect={() => setWalkies('no')}
                            />
                            <Checkbox
                                label="Not sure"
                                selected={walkies === 'notSure'}
                                onSelect={() => setWalkies('notSure')}
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
                    style={styles.sendButton}
                    onPress={() => {
                        if (!outdoorSpace) {
                            Alert.alert('Validation Error', 'Please answer if you have outdoor space at home.');
                            return;
                        }
                        if (!pastExperience) {
                            Alert.alert('Validation Error', 'Please answer if you have past experience in pets.');
                            return;
                        }
                        if (!walkies) {
                            Alert.alert('Validation Error', 'Please answer if you can take your pets on walks.');
                            return;
                        }
                        Alert.alert('Success', 'Your adoption request has been sent!', [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ]);
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
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
        marginBottom: 20,
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
});
