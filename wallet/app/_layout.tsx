import { Stack } from 'expo-router';
import { View } from 'react-native';
import Head from 'expo-router/head';

export default function Layout() {
  return (
    <>
      {/* This Head tag forces the browser to fit the app to the device screen width */}
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