// App.tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, I18nManager, ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { usePrayerEngine } from './src/hooks/usePrayerEngine';
import { requestNotificationPermissions } from './src/hooks/useNotifications';
import { useStore } from './src/store';
import { COLORS, FONTS } from './src/constants';

SplashScreen.preventAutoHideAsync();

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

Notifications.addNotificationResponseReceivedListener((_response) => {});

function AppContent() {
  usePrayerEngine();
  return <AppNavigator />;
}

export default function App() {
  const { fontsLoaded, setFontsLoaded } = useStore();

  useEffect(() => {
    async function loadApp() {
      try {
        await Font.loadAsync({
          [FONTS.regular]: require('./assets/fonts/ThmanyahSans-Regular.ttf'),
          [FONTS.bold]: require('./assets/fonts/ThmanyahSans-Bold.ttf'),
        });
        await requestNotificationPermissions();
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Font load error — using system font:', e);
        setFontsLoaded(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    loadApp();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>مواقيت | أذكار السنة</Text>
      </View>
    );
  }

  return <AppContent />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
