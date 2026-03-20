import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import Head from 'expo-router/head';
import { useEffect, useState } from 'react';
import { auth } from '../src/services/firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in with UID:', user.uid);
        setIsReady(true);
      } else {
        signInAnonymously(auth).catch((error) => console.error("Auth error:", error));
      }
    });
    return unsubscribe;
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F5' }}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: '#FFF9F5' },
        }}
      />
    </>
  );
}