import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Automatically move to Onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding'); 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#FF741C']} style={styles.background} />
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.footer}>
        <Image 
          source={require('../../assets/pets-footer.png')} 
          style={styles.petsImage} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  logo: { width: width * 0.65, height: 180 },
  footer: { position: 'absolute', bottom: -40, width: '100%' },
  petsImage: { width: width, height: height * 0.3 },
});