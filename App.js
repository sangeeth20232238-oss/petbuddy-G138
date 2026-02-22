import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_400Regular, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

// Existing Screens
import MySplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Emergency Vet Feature Screens (Modular Folder)
import ClinicListScreen from './src/features/emergency-vet/ClinicListScreen';
import ClinicDetailScreen from './src/features/emergency-vet/ClinicDetailScreen';
import DoctorListScreen from './src/features/emergency-vet/DoctorListScreen';
import DoctorDetailScreen from './src/features/emergency-vet/DoctorDetailScreen';
import BookingCalendarScreen from './src/features/emergency-vet/BookingCalendarScreen';

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
        {/* Main App Flow */}
        <Stack.Screen name="Splash" component={MySplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} /> 
        
        {/* Emergency Vet Feature Stack */}
        <Stack.Screen name="ClinicList" component={ClinicListScreen} />
        <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="BookingCalendar" component={BookingCalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);