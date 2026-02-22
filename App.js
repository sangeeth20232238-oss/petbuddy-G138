import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_400Regular, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

<<<<<<< HEAD
// Existing Screens
=======
// 1. Import your new Dashboard screen
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
import MySplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
<<<<<<< HEAD
import DashboardScreen from './src/screens/DashboardScreen';

// 1. Import Emergency Vet Feature Screens
import ClinicListScreen from './src/features/emergency-vet/ClinicListScreen';
import ClinicDetailScreen from './src/features/emergency-vet/ClinicDetailScreen';
import DoctorListScreen from './src/features/emergency-vet/DoctorListScreen';
import DoctorDetailScreen from './src/features/emergency-vet/DoctorDetailScreen';
import BookingCalendarScreen from './src/features/emergency-vet/BookingCalendarScreen';
=======
import DashboardScreen from './src/screens/DashboardScreen'; // <--- ADD THIS
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Fredoka-Regular': Fredoka_400Regular,
    'Fredoka-SemiBold': Fredoka_600SemiBold,
    'Fredoka-Bold': Fredoka_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
        {/* Auth & Onboarding Flow */}
=======
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
        <Stack.Screen name="Splash" component={MySplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
<<<<<<< HEAD
        <Stack.Screen name="Dashboard" component={DashboardScreen} /> 
        
        {/* 2. Emergency Vet Feature Flow */}
        <Stack.Screen name="ClinicList" component={ClinicListScreen} />
        <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="BookingCalendar" component={BookingCalendarScreen} />
=======
        
        {/* 2. Add the Dashboard to the map */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} /> 
>>>>>>> b463653276e8d9a483999f4e9edcd38ceab605f2
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);