import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pet, PetCategory, RootStackParamList } from '../types';
import { PETS_DATA } from '../data/pets';

const { width } = Dimensions.get('window');

const CATEGORIES: PetCategory[] = [
    { id: '0', name: 'All', icon: '🐾', type: 'all' },
    { id: '1', name: 'Cat', icon: '🐱', type: 'cat' },
    { id: '2', name: 'Dog', icon: '🐶', type: 'dog' },
];

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllPets, setShowAllPets] = useState(false);

    const filteredPets = PETS_DATA.filter((pet) => {
        const matchesCategory = !selectedCategory || selectedCategory === 'all' || pet.type === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
            pet.name.toLowerCase().includes(query) ||
            pet.breed.toLowerCase().includes(query) ||
            pet.type.toLowerCase() === query;
        return matchesCategory && matchesSearch;
    });

    const displayedPets = showAllPets ? filteredPets : filteredPets.slice(0, 4);

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
                <Text style={styles.headerTitle}>Pet Adoption</Text>
                <View style={styles.placeholder} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search your pet / breed / type"
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Text style={styles.searchIcon}>🔍</Text>
                    </View>
                </View>

                {/* Hero Banner */}
                <View style={styles.bannerContainer}>
                    <LinearGradient
                        colors={['#FF9B6A', '#FF741C']}
                        start={{ x: 0, y: 3 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    >
                        <View style={styles.bannerContent}>
                            <Image
                                source={require('../../assets/pets/dog.png')}
                                style={styles.bannerImage}
                                resizeMode="contain"
                            />
                            <View style={styles.bannerTextContainer}>
                                <Text style={styles.bannerTitle}>Find Your Perfect</Text>
                                <Text style={styles.bannerTitle}>Companion</Text>
                            </View>
                        </View>
                        <View style={styles.bannerDots}>
                            <View style={[styles.dot, styles.activeDot]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    </LinearGradient>
                </View>

                {/* Pet Categories */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pet Categories</Text>
                    </View>

                    <View style={styles.categoriesContainer}>
                        {CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category.type ? styles.categoryButtonActive : null,
                                ]}
                                onPress={() =>
                                    setSelectedCategory(
                                        selectedCategory === category.type ? null : category.type
                                    )
                                }
                            >
                                <View style={styles.categoryIconContainer}>
                                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                                </View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Adopt Pet Section */}
                <View style={styles.adoptSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Adopt Companion</Text>
                        <TouchableOpacity onPress={() => setShowAllPets(!showAllPets)}>
                            <Text style={styles.seeAllLink}>{showAllPets ? 'Show less' : 'See all'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.petsGrid}>
                        {displayedPets.map((pet) => (
                            <TouchableOpacity
                                key={pet.id}
                                style={styles.petCard}
                                onPress={() => navigation.navigate('PetDetails', { pet })}
                            >
                                <Image source={pet.image} style={styles.petImage} />
                                <View style={styles.petInfo}>
                                    <View style={styles.petNameRow}>
                                        <Text style={styles.petName}>{pet.name}</Text>
                                        <View style={styles.genderIcon}>
                                            <Text style={styles.genderText}>
                                                {pet.gender === 'male' ? '♂' : '♀'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.petBreed}>
                                        {pet.breed} ({pet.age})
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
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
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 105,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    searchIcon: {
        fontSize: 20,
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#000',
    },
    bannerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    banner: {
        borderRadius: 20,
        padding: 20,
        height: 160,
        justifyContent: 'space-between',
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 28,
    },
    bannerImage: {
        width: 490,
        height: 300,
        position: 'absolute',
        left: -20,
        top: -60,
        bottom: 0,
    },
    bannerDots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    activeDot: {
        width: 24,
        backgroundColor: '#FFFFFF',
    },
    categoriesSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 50,
    },
    categoryButton: {
        alignItems: 'center',
        gap: 8,
    },
    categoryButtonActive: {
        opacity: 1,
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fcbea1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIcon: {
        fontSize: 28,
    },
    categoryName: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    adoptSection: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    seeAllLink: {
        fontSize: 14,
        color: '#807f7f',
    },
    petsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    petCard: {
        width: (width - 55) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    petImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F5F5F5',
    },
    petInfo: {
        padding: 12,
    },
    petNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    petName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    genderIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderText: {
        fontSize: 14,
        color: '#2196F3',
    },
    petBreed: {
        fontSize: 12,
        color: '#999',
    },
});
