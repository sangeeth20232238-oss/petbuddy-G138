import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    Linking,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetails'>;

export default function PetDetailScreen({ route, navigation }: Props) {
    const { pet } = route.params;

    const handlePhoneCall = () => {
        if (!pet.contactPhone) {
            Alert.alert('Not Available', 'Contact phone number is not available for this pet.');
            return;
        }
        Linking.openURL(`tel:${pet.contactPhone}`).catch(() => {
            Alert.alert('Error', 'Unable to open phone dialer');
        });
    };

    const handleMessage = () => {
        if (!pet.contactPhone) {
            Alert.alert('Not Available', 'Contact phone number is not available for this pet.');
            return;
        }
        Linking.openURL(`sms:${pet.contactPhone}`).catch(() => {
            Alert.alert('Error', 'Unable to open messaging app');
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Standard Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pet Adoption</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={pet.image} style={styles.image} resizeMode="cover" />
                </View>

                {/* Content Section */}
                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.name}>{pet.name}</Text>
                            <Text style={styles.breedText}>
                                {pet.breed} {pet.type} ( {pet.age} ) <Text style={styles.genderSymbol}>{pet.gender === 'male' ? '♂' : '♀'}</Text>
                            </Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>Vaccinated</Text>
                            <MaterialCommunityIcons name="needle" size={20} color="#FF741C" style={styles.statusIcon} />
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{pet.gender === 'male' ? 'Male' : 'Female'}</Text>
                            <Text style={styles.statLabel}>Sex</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{pet.color || 'Unknown'}</Text>
                            <Text style={styles.statLabel}>Color</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{pet.breed}</Text>
                            <Text style={styles.statLabel}>Breed</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{pet.weight || 'N/A'}</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                    </View>

                    {/* Shelter Section */}
                    <View style={styles.shelterSection}>
                        <View style={styles.shelterInfo}>
                            <Image
                                source={require('../../../../assets/pets/sh.jpg')}
                                style={styles.shelterAvatar}
                            />
                            <View>
                                <Text style={styles.shelterLabel}>Shelter by:</Text>
                                <Text style={styles.shelterName}>{pet.shelterName || 'PetBuddy Shelter'}</Text>
                                <View style={styles.locationRow}>
                                    <MaterialCommunityIcons name="map-marker" size={14} color="#FF741C" />
                                    <Text style={styles.locationText}>{pet.location || 'Unknown Location'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton} onPress={handlePhoneCall}>
                                <MaterialCommunityIcons name="phone" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={handleMessage}>
                                <MaterialCommunityIcons name="message-text" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description Section */}
                    <Text style={styles.description}>
                        {pet.description}
                    </Text>

                    {/* Adopt Button */}
                    <TouchableOpacity
                        style={styles.adoptButton}
                        onPress={() => navigation.navigate('AdoptionForm', { pet })}
                    >
                        <Text style={styles.adoptButtonText}>Adopt Me</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5EF',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: width,
        height: height * 0.45,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 45,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF5EF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Fredoka-Bold',
        color: '#222',
        marginLeft: 50,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#FFF5EF',
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#444',
    },
    breedText: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    genderSymbol: {
        color: '#4DA8FF',
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#666',
        marginRight: 4,
    },
    statusIcon: {
        transform: [{ rotate: '45deg' }],
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statBox: {
        backgroundColor: 'white',
        width: (width - 70) / 4,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF741C',
    },
    statLabel: {
        fontSize: 12,
        color: '#AAA',
        marginTop: 4,
    },
    shelterSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    shelterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shelterAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    shelterLabel: {
        fontSize: 12,
        color: '#AAA',
    },
    shelterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    locationText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FF741C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {},
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#444',
        marginBottom: 25,
    },
    adoptButton: {
        backgroundColor: '#FF741C',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF741C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    adoptButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
