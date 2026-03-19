import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GroomingMain from './src/screens/GroomingMain';
import GroomingLocation from './src/screens/GroomingLocation';
import GroomingApt from './src/screens/GroomingApt';
import GroomingCheckout from './src/screens/GroomingCheckout';
import CardPayment from './src/screens/CardPayment';
import CardPaymentFinal from './src/screens/CardPaymentFinal';
import AptConfirmation from './src/screens/AptConfirmation';

export default function App() {
  const [screen, setScreen] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [cardData, setCardData] = useState(null);

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
          onConfirm={(data) => {
            setBookingData(data);
            if (data.paymentMethod === 'card') setScreen('cardPayment');
            else setScreen('confirmation');
          }}
        />
      )}
      {screen === 'cardPayment' && (
        <CardPayment
          onBack={() => setScreen('checkout')}
          onAdd={(data) => { setCardData(data); setScreen('cardPaymentFinal'); }}
        />
      )}
      {screen === 'cardPaymentFinal' && (
        <CardPaymentFinal
          onBack={() => setScreen('cardPayment')}
          onPay={() => setScreen('confirmation')}
          cardData={cardData}
          bookingData={bookingData}
        />
      )}
      {screen === 'confirmation' && (
        <AptConfirmation
          onHome={() => setScreen('main')}
          bookingData={bookingData}
          cardData={cardData}
        />
      )}
    </SafeAreaProvider>
  );
}
