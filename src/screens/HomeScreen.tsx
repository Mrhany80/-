// src/screens/HomeScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { COLORS, FONTS, toArabicNumerals } from '../constants';
import { formatTimeArabic, formatCountdown, getPrayerList } from '../utils/prayerTimes';
import { PrayerName } from '../types';
import KhushuModal from '../components/home/KhushuModal';
import LivingCrescent from '../components/home/LivingCrescent';

const { width } = Dimensions.get('window');

interface PrayerTheme { bg: string; accent: string; text: string; }
const PRAYER_PERIOD_COLORS: Record<string, PrayerTheme> = {
  fajr: { bg: '#0D1B2A', accent: '#3D5A80', text: '#C8D8E8' },
  sunrise: { bg: '#FF8C42', accent: '#FFD166', text: '#FFFFFF' },
  dhuhr: { bg: '#F8F5EF', accent: '#1A5C38', text: '#1C1C1E' },
  asr: { bg: '#D4956A', accent: '#C9A84C', text: '#FFFFFF' },
  maghrib: { bg: '#8B2500', accent: '#C9A84C', text: '#FFFFFF' },
  isha: { bg: '#0D1B2A', accent: '#C9A84C', text: '#E0E0E0' },
};

export default function HomeScreen() {
  const {
    nextPrayer, currentPrayer, secondsUntilNext, progressPercent,
    prayerTimes, hijriDate, userCity, khushuMode,
  } = useStore();

  const prayerPeriod = (currentPrayer?.name ?? nextPrayer?.name ?? 'fajr') as PrayerName;
  const theme: PrayerTheme = PRAYER_PERIOD_COLORS[prayerPeriod] ?? PRAYER_PERIOD_COLORS['fajr'];
  const isDark = ['fajr', 'maghrib', 'isha'].includes(prayerPeriod);

  const textColor = isDark ? COLORS.textLight : COLORS.textDark;
  const mutedColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(28,28,30,0.55)';

  // Pulse animation for countdown
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (secondsUntilNext <= 60) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [secondsUntilNext <= 60]);

  const prayerList = prayerTimes ? getPrayerList(prayerTimes) : [];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ─────────────────────────────────── */}
          <View style={styles.header}>
            <Text style={[styles.cityName, { color: mutedColor }]}>
              {userCity.nameAr}
            </Text>
            {hijriDate && (
              <Text style={[styles.hijriDate, { color: mutedColor }]}>
                {toArabicNumerals(hijriDate.day)} {hijriDate.monthNameAr}{' '}
                {toArabicNumerals(hijriDate.year)} هـ
              </Text>
            )}
          </View>

          {/* ── Living Crescent + Next Prayer ───────────── */}
          <View style={styles.heroSection}>
            <LivingCrescent
              progress={progressPercent}
              accentColor={theme.accent}
              isDark={isDark}
            />

            <Text style={[styles.nextPrayerLabel, { color: mutedColor }]}>
              الصلاة القادمة
            </Text>
            <Text style={[styles.nextPrayerName, { color: textColor }]}>
              {nextPrayer?.nameAr ?? '---'}
            </Text>

            <Animated.Text
              style={[
                styles.countdown,
                { color: theme.accent, transform: [{ scale: pulseAnim }] },
              ]}
            >
              {secondsUntilNext > 0 ? formatCountdown(secondsUntilNext) : '٠٠:٠٠'}
            </Animated.Text>

            {currentPrayer && (
              <Text style={[styles.currentLabel, { color: mutedColor }]}>
                الآن: {currentPrayer.nameAr}
              </Text>
            )}
          </View>

          {/* ── Prayer Times List ────────────────────────── */}
          <View style={styles.prayerCard}>
            {prayerList.map((prayer) => {
              const isNext = prayer.name === nextPrayer?.name;
              const isCurrent = prayer.name === currentPrayer?.name;

              return (
                <View
                  key={prayer.name}
                  style={[
                    styles.prayerRow,
                    isNext && styles.prayerRowHighlight,
                    isCurrent && styles.prayerRowCurrent,
                  ]}
                >
                  <View style={styles.prayerRowLeft}>
                    {(isNext || isCurrent) && (
                      <View
                        style={[
                          styles.activeDot,
                          { backgroundColor: isNext ? COLORS.gold : COLORS.primaryGreen },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.prayerName,
                        (isNext || isCurrent) && styles.prayerNameActive,
                      ]}
                    >
                      {prayer.nameAr}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.prayerTime,
                      (isNext || isCurrent) && { color: COLORS.gold },
                    ]}
                  >
                    {prayer.timeString}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ── Today's Gregorian Date ─────────────────── */}
          <Text style={[styles.gregDate, { color: mutedColor }]}>
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Khushu Mode Overlay */}
      {khushuMode && <KhushuModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  cityName: {
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  hijriDate: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'right',
  },

  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  nextPrayerLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  nextPrayerName: {
    fontFamily: FONTS.bold,
    fontSize: 38,
    marginBottom: 4,
  },
  countdown: {
    fontFamily: FONTS.bold,
    fontSize: 52,
    letterSpacing: 2,
    marginBottom: 6,
  },
  currentLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },

  prayerCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  prayerRowHighlight: {
    backgroundColor: 'rgba(201,168,76,0.18)',
  },
  prayerRowCurrent: {
    backgroundColor: 'rgba(26,92,56,0.2)',
  },
  prayerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  prayerName: {
    fontFamily: FONTS.regular,
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
  },
  prayerNameActive: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  prayerTime: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
  },

  gregDate: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
