// src/screens/PulseMapScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Text as SvgText, G } from 'react-native-svg';
import { COLORS, FONTS, toArabicNumerals } from '../constants';
import { useStore } from '../store';
import { getPrayerList } from '../utils/prayerTimes';

const { width } = Dimensions.get('window');
const MAP_W = width - 32;
const MAP_H = MAP_W * 1.1;

// City positions on simplified Saudi map (normalized 0–1)
const CITY_POSITIONS = [
  { nameAr: 'الرياض', x: 0.58, y: 0.44 },
  { nameAr: 'جدة', x: 0.22, y: 0.52 },
  { nameAr: 'مكة', x: 0.24, y: 0.55 },
  { nameAr: 'المدينة', x: 0.26, y: 0.38 },
  { nameAr: 'الدمام', x: 0.76, y: 0.41 },
  { nameAr: 'الطائف', x: 0.30, y: 0.57 },
  { nameAr: 'أبها', x: 0.33, y: 0.72 },
  { nameAr: 'تبوك', x: 0.16, y: 0.22 },
  { nameAr: 'حائل', x: 0.45, y: 0.30 },
  { nameAr: 'القصيم', x: 0.50, y: 0.35 },
  { nameAr: 'نجران', x: 0.42, y: 0.80 },
  { nameAr: 'جازان', x: 0.26, y: 0.82 },
  { nameAr: 'ينبع', x: 0.20, y: 0.44 },
];

// Simplified Saudi Arabia outline (SVG path, normalized)
const SAUDI_PATH = `
  M 0.18,0.08 L 0.35,0.05 L 0.55,0.08 L 0.72,0.10
  L 0.92,0.16 L 0.98,0.25 L 0.95,0.35 L 0.88,0.40
  L 0.88,0.55 L 0.82,0.62 L 0.72,0.68 L 0.60,0.72
  L 0.55,0.80 L 0.52,0.90 L 0.44,0.95 L 0.35,0.92
  L 0.28,0.88 L 0.22,0.82 L 0.18,0.74 L 0.14,0.65
  L 0.10,0.55 L 0.08,0.44 L 0.08,0.35 L 0.10,0.25
  L 0.12,0.16 L 0.15,0.10 Z
`;

function scalePath(path: string, w: number, h: number): string {
  return path.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) =>
    `${parseFloat(x) * w},${parseFloat(y) * h}`
  );
}

export default function PulseMapScreen() {
  const { prayerTimes, nextPrayer, userCity } = useStore();
  const pulseAnims = useRef<Record<string, Animated.Value>>({});
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set());

  // Initialize pulse animations
  CITY_POSITIONS.forEach(({ nameAr }) => {
    if (!pulseAnims.current[nameAr]) {
      pulseAnims.current[nameAr] = new Animated.Value(0);
    }
  });

  // Simulate cities lighting up in wave order when near prayer time
  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const now = new Date();
    const secsUntil = (nextPrayer.time.getTime() - now.getTime()) / 1000;

    // When within 3 minutes of prayer, trigger wave
    if (secsUntil > 0 && secsUntil < 180) {
      triggerWave();
    }
  }, [nextPrayer?.name]);

  function triggerWave() {
    // Wave from East to West (Dammam first, Tabuk last)
    const waveOrder = ['الدمام', 'الرياض', 'القصيم', 'حائل', 'مكة', 'جدة', 'المدينة', 'الطائف', 'أبها', 'نجران', 'جازان', 'ينبع', 'تبوك'];

    waveOrder.forEach((city, i) => {
      setTimeout(() => {
        setActiveCities((prev) => new Set([...prev, city]));
        const anim = pulseAnims.current[city];
        if (anim) {
          anim.setValue(0);
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.3, duration: 2400, useNativeDriver: true }),
          ]).start();
        }
        // Clear after 3 seconds
        setTimeout(() => {
          setActiveCities((prev) => {
            const next = new Set(prev);
            next.delete(city);
            return next;
          });
        }, 3000);
      }, i * 200);
    });
  }

  const prayerList = prayerTimes ? getPrayerList(prayerTimes) : [];
  const scaledPath = scalePath(SAUDI_PATH, MAP_W, MAP_H);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>نبضة المملكة</Text>
      <Text style={styles.subtitle}>
        شاهد المملكة وهي تصلي موجةً واحدة
      </Text>

      {/* Map */}
      <View style={styles.mapContainer}>
        <Svg width={MAP_W} height={MAP_H}>
          {/* Saudi Arabia outline */}
          <Path
            d={scaledPath}
            fill="#E8F4ED"
            stroke={COLORS.primaryGreen}
            strokeWidth={1.5}
            opacity={0.8}
          />

          {/* City dots with pulse */}
          {CITY_POSITIONS.map(({ nameAr, x, y }) => {
            const cx = x * MAP_W;
            const cy = y * MAP_H;
            const isActive = activeCities.has(nameAr);
            const isUserCity = nameAr === userCity.nameAr;

            return (
              <G key={nameAr}>
                {/* Pulse ring (drawn conditionally) */}
                {isActive && (
                  <Circle
                    cx={cx} cy={cy} r={14}
                    fill="none"
                    stroke={COLORS.primaryGreen}
                    strokeWidth={2}
                    opacity={0.6}
                  />
                )}
                {/* City dot */}
                <Circle
                  cx={cx} cy={cy} r={isUserCity ? 7 : 5}
                  fill={isUserCity ? COLORS.gold : isActive ? COLORS.primaryGreen : 'rgba(26,92,56,0.4)'}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                />
                {/* City name */}
                <SvgText
                  x={cx}
                  y={cy - 10}
                  fontSize={9}
                  fill={COLORS.textDark}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {nameAr}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Next prayer info */}
      {nextPrayer && (
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>الصلاة القادمة في المملكة</Text>
          <Text style={styles.nextPrayer}>{nextPrayer.nameAr}</Text>
          <Text style={styles.nextTime}>{nextPrayer.timeString}</Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} />
          <Text style={styles.legendText}>موقعك الحالي</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primaryGreen }]} />
          <Text style={styles.legendText}>دخل وقت الصلاة</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.pearlWhite, alignItems: 'center' },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primaryGreen,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    backgroundColor: '#F0F9F4',
    borderWidth: 0.5,
    borderColor: COLORS.primaryGreen,
  },
  nextCard: {
    marginTop: 16,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  nextPrayer: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: '#FFFFFF',
  },
  nextTime: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.gold,
  },
  legend: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textDark,
  },
});
