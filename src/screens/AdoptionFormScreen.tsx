import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    const [walkies, setWalkies] = useState<'yes' | 'no' | 'notSure' | null>(null);
    const [reason, setReason] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Pet Adoption <Text style={styles.orangeTitle}>Request</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        We will ask you some questions for finding you pets of your choice
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Lifestyle</Text>

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
                <TouchableOpacity style={styles.sendButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F5',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 60,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 110, // Extra space for persistent bottom tab
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
    },
    orangeTitle: {
        color: '#FF741C',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 30,
        lineHeight: 24,
    },
    formCard: {
        backgroundColor: '#FFEFE5',
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: 30,
        marginHorizontal: -20,
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF741C',
        textAlign: 'center',
        marginBottom: 30,
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
