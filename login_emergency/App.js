import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_400Regular, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

// Core Screens
import MySplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Emergency Vet Screens
import ClinicListScreen from './src/features/emergency-vet/ClinicListScreen';
import ClinicDetailScreen from './src/features/emergency-vet/ClinicDetailScreen';
import DoctorListScreen from './src/features/emergency-vet/DoctorListScreen';
import DoctorDetailScreen from './src/features/emergency-vet/DoctorDetailScreen';
import BookingCalendarScreen from './src/features/emergency-vet/BookingCalendarScreen';

// Pet Buddy Screens
import PetBuddyRequestScreen from './src/features/pet-buddy/PetBuddyRequestScreen';
import PetBuddyConfigScreen from './src/features/pet-buddy/PetBuddyConfigScreen';
import PetBuddyTrackingScreen from './src/features/pet-buddy/PetBuddyTrackingScreen';
import VolunteerOnboardingScreen from './src/features/pet-buddy/VolunteerOnboardingScreen';

// Profile
import EditProfileScreen from './src/features/profile/EditProfileScreen';

// Adoption Screens
import AdoptionHomeScreen from './src/features/adoption/screens/HomeScreen';
import PetDetailScreen from './src/features/adoption/screens/PetDetailScreen';
import AdoptionFormScreen from './src/features/adoption/screens/AdoptionFormScreen';

// Grooming Screens
import GroomingMain from './src/features/grooming/GroomingMain';
import GroomingLocation from './src/features/grooming/GroomingLocation';
import GroomingApt from './src/features/grooming/GroomingApt';
import GroomingCheckout from './src/features/grooming/GroomingCheckout';

// Pet SOS Screens
import SOSHomeScreen from './src/features/sos/screens/HomeScreen/HomeScreen';
import AllAlertsScreen from './src/features/sos/screens/AllAlertsScreen/AllAlertsScreen';
import AlertDetailScreen from './src/features/sos/screens/AlertDetailScreen/AlertDetailScreen';
import CreatePostScreen from './src/features/sos/screens/CreatePostScreen/CreatePostScreen';
import ShareNotifyScreen from './src/features/sos/screens/ShareNotifyScreen/ShareNotifyScreen';

// Wallet Screen
import MedicalWalletScreen from './src/features/wallet/screens/MedicalWallet';

// Chatbot Screen
import ChatScreen from './src/features/chatbot/ChatScreen';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Fredoka-Regular': Fredoka_400Regular,
    'Fredoka-SemiBold': Fredoka_600SemiBold,
    'Fredoka-Bold': Fredoka_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Core */}
        <Stack.Screen name="Splash" component={MySplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Emergency Vet */}
        <Stack.Screen name="ClinicList" component={ClinicListScreen} />
        <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="BookingCalendar" component={BookingCalendarScreen} />

        {/* Pet Buddy */}
        <Stack.Screen name="PetBuddyRequest" component={PetBuddyRequestScreen} />
        <Stack.Screen name="PetBuddyConfig" component={PetBuddyConfigScreen} />
        <Stack.Screen name="PetBuddyTracking" component={PetBuddyTrackingScreen} />
        <Stack.Screen name="VolunteerOnboarding" component={VolunteerOnboardingScreen} />

        {/* Profile */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

        {/* Adoption */}
        <Stack.Screen name="Adoption" component={AdoptionHomeScreen} />
        <Stack.Screen name="PetDetails" component={PetDetailScreen} />
        <Stack.Screen name="AdoptionForm" component={AdoptionFormScreen} />

        {/* Grooming */}
        <Stack.Screen name="Grooming" component={GroomingMain} />
        <Stack.Screen name="GroomingLocation" component={GroomingLocation} />
        <Stack.Screen name="GroomingApt" component={GroomingApt} />
        <Stack.Screen name="GroomingCheckout" component={GroomingCheckout} />

        {/* Pet SOS */}
        <Stack.Screen name="PetSOS" component={SOSHomeScreen} />
        <Stack.Screen name="AllAlerts" component={AllAlertsScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="ShareNotify" component={ShareNotifyScreen} />

        {/* Wallet */}
        <Stack.Screen name="Wallet" component={MedicalWalletScreen} />

        {/* Chatbot */}
        <Stack.Screen name="ChatBot" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
registerRootComponent(App);
