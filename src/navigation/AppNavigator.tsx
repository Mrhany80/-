// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import AdhkarScreen from '../screens/AdhkarScreen';
import QiblaScreen from '../screens/QiblaScreen';
import TasbihScreen from '../screens/TasbihScreen';
import PulseMapScreen from '../screens/PulseMapScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { COLORS, FONTS } from '../constants';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({
  emoji, label, focused,
}: {
  emoji: string; label: string; focused: boolean;
}) {
  return (
    <View style={tabStyles.iconWrapper}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      <Text
        style={[
          tabStyles.label,
          { color: focused ? COLORS.primaryGreen : COLORS.textMuted },
          focused && tabStyles.labelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarStyle: tabStyles.tabBar,
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🌙" label="الرئيسية" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Adhkar"
            component={AdhkarScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="📿" label="الأذكار" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Qibla"
            component={QiblaScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🧭" label="القبلة" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Tasbih"
            component={TasbihScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🔢" label="المسبحة" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Map"
            component={PulseMapScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🗺️" label="نبضة المملكة" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="⚙️" label="الإعدادات" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E0D8CC',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 4,
    paddingTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: FONTS.bold,
  },
});
