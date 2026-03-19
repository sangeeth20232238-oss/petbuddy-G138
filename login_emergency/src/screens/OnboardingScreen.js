import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        title: "All-in-One Pet Care\nRescue & Adoption",
        desc: "Discover a simple way to care for your pets from finding loving rescue companions to accessing trusted vets and groomers.",
        highlight: "Everything you need, in one place.",
        image: require('../../assets/onboarding1.png'),
        button: "Next"
    },
    {
        title: "Find Your Perfect\nCompanion",
        desc: "Browse a curated list of adoptable pets from verified shelters. Learn their stories, view details, and connect directly with rescue centers helping animals ",
        highlight: "find safe and happy homes.",
        image: require('../../assets/onboarding2.png'),
        button: "Next"
    },
    {
        title: "Vets & Groomers\nNear You",
        desc: "Explore a location-based directory of pet services. Book appointments, get expert help, and manage your pet’s wellbeing with trusted ",
        highlight: "professionals anytime, anywhere.",
        image: require('../../assets/onboarding3.png'),
        button: "Get Started"
    }
];

export default function OnboardingScreen({ navigation }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigation.navigate('Signup'); 
        }
    };

    const data = onboardingData[currentStep];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Image source={data.image} style={styles.topImage} />
            <View style={styles.card}>
                <View style={styles.dotContainer}>
                    {[0, 1, 2].map((i) => (
                        <View key={i} style={[styles.dot, currentStep === i && styles.activeDot]} />
                    ))}
                </View>

                <Text style={[styles.title, {fontFamily: 'Fredoka-Bold'}]}>{data.title}</Text>
                <Text style={[styles.description, {fontFamily: 'Fredoka-Regular'}]}>
                    {data.desc}
                    <Text style={styles.highlightText}>{data.highlight}</Text>
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={[styles.buttonText, {fontFamily: 'Fredoka-Bold'}]}>{data.button}</Text>
                </TouchableOpacity>

                {currentStep === 2 && (
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, {fontFamily: 'Fredoka-SemiBold'}]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginText, {fontFamily: 'Fredoka-Bold'}]}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    topImage: { width: width, height: height * 0.55, resizeMode: 'cover' },
    card: {
        flex: 1, backgroundColor: '#FFFFFF', marginTop: -35, borderTopLeftRadius: 35,
        borderTopRightRadius: 35, padding: 30, alignItems: 'center', elevation: 5,
    },
    dotContainer: { flexDirection: 'row', marginBottom: 20 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4D4D4', marginHorizontal: 4 },
    activeDot: { backgroundColor: '#FF741C', width: 22 },
    title: { fontSize: 24, textAlign: 'center', color: '#000', marginBottom: 15 },
    description: { fontSize: 15, textAlign: 'center', color: '#444', lineHeight: 22 },
    highlightText: { color: '#FF741C' },
    button: { backgroundColor: '#FF741C', width: '100%', paddingVertical: 15, borderRadius: 15, marginTop: 30, alignItems: 'center' },
    buttonText: { color: '#FFFFFF', fontSize: 20 },
    footer: { flexDirection: 'row', marginTop: 15 },
    footerText: { color: '#000' },
    loginText: { color: '#FF741C' },
});