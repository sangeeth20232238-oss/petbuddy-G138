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
import PetBuddyPaywallScreen from './src/features/pet-buddy/PetBuddyPaywallScreen';

// Profile 
import EditProfileScreen from './src/features/profile/EditProfileScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';

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
        <Stack.Screen name="Splash" component={MySplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Emergency Vet Flow */}
        <Stack.Screen name="ClinicList" component={ClinicListScreen} />
        <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="BookingCalendar" component={BookingCalendarScreen} />

        {/* Pet Buddy Flow */}
        <Stack.Screen name="PetBuddyRequest" component={PetBuddyRequestScreen} />
        <Stack.Screen name="PetBuddyConfig" component={PetBuddyConfigScreen} />
        <Stack.Screen name="PetBuddyTracking" component={PetBuddyTrackingScreen} />
        <Stack.Screen name="VolunteerOnboarding" component={VolunteerOnboardingScreen} />
        <Stack.Screen name="PetBuddyPaywall" component={PetBuddyPaywallScreen} />

        {/* Profile */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
registerRootComponent(App); 