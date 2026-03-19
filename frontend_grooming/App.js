import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GroomingMain from './src/screens/GroomingMain';
import GroomingLocation from './src/screens/GroomingLocation';
import GroomingApt from './src/screens/GroomingApt';
import GroomingCheckout from './src/screens/GroomingCheckout';

export default function App() {
  const [screen, setScreen] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {screen === 'main' && (
        <GroomingMain onServicePress={() => setScreen('location')} />
      )}
      {screen === 'location' && (
        <GroomingLocation
          onBack={() => setScreen('main')}
          onLocationPress={(loc) => { setSelectedLocation(loc); setScreen('apt'); }}
        />
      )}
      {screen === 'apt' && (
        <GroomingApt
          location={selectedLocation}
          onBack={() => setScreen('location')}
          onConfirm={(data) => { setBookingData(data); setScreen('checkout'); }}
        />
      )}
      {screen === 'checkout' && (
        <GroomingCheckout
          bookingData={bookingData}
          onBack={() => setScreen('apt')}
          onConfirm={() => setScreen('main')}
        />
      )}
    </SafeAreaProvider>
  );
}
