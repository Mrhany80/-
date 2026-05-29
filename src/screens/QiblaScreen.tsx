// src/screens/QiblaScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { magnetometer } from 'react-native-sensors';
import { COLORS, FONTS, toArabicNumerals } from '../constants';
import { calculateQiblaDirection, distanceToMecca } from '../utils/prayerTimes';
import { useStore } from '../store';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width - 80;

export default function QiblaScreen() {
  const { userLat, userLng } = useStore();
  const [heading, setHeading] = useState(0);
  const [accuracy, setAccuracy] = useState<'low' | 'medium' | 'high'>('low');

  const qiblaDirection = calculateQiblaDirection(userLat, userLng);
  const distance = distanceToMecca(userLat, userLng);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevHeadingRef = useRef(0);

  useEffect(() => {
    const subscription = magnetometer.subscribe(({ x, y, z }) => {
      // Calculate compass heading from magnetometer
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 360) % 360;

      setHeading(angle);
      setAccuracy(Math.abs(z) < 50 ? 'high' : Math.abs(z) < 100 ? 'medium' : 'low');

      // Smooth rotation animation
      const delta = angle - prevHeadingRef.current;
      const normalizedDelta = ((delta + 540) % 360) - 180;
      const newVal = prevHeadingRef.current + normalizedDelta;
      prevHeadingRef.current = newVal;

      Animated.spring(rotateAnim, {
        toValue: newVal,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    });

    return () => subscription.unsubscribe();
  }, []);

  // The needle should point at (qiblaDirection - deviceHeading)
  const needleRotation = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: [
      `${qiblaDirection - 360}deg`,
      `${qiblaDirection + 360}deg`,
    ],
  });

  const accuracyColors = {
    low: '#E24B4A',
    medium: '#C9A84C',
    high: '#1A5C38',
  };

  const accuracyLabels = {
    low: 'دقة منخفضة — حرّك جهازك بشكل رقم ٨',
    medium: 'دقة متوسطة',
    high: 'دقة عالية',
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>اتجاه القبلة</Text>

      {/* Distance */}
      <View style={styles.distanceCard}>
        <Text style={styles.distanceLabel}>المسافة من موقعك إلى مكة المكرمة</Text>
        <Text style={styles.distanceValue}>
          {toArabicNumerals(distance)} كم
        </Text>
      </View>

      {/* Compass */}
      <View style={styles.compassContainer}>
        {/* Compass ring */}
        <View style={[styles.compassRing, { width: COMPASS_SIZE, height: COMPASS_SIZE }]}>
          {/* Degree markers */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <View
              key={deg}
              style={[styles.degreeMarker, { transform: [{ rotate: `${deg}deg` }] }]}
            >
              <View style={styles.markerLine} />
            </View>
          ))}

          {/* Cardinal directions */}
          <Text style={[styles.cardinal, { top: 8 }]}>ش</Text>
          <Text style={[styles.cardinal, { bottom: 8 }]}>ج</Text>
          <Text style={[styles.cardinal, { left: 8, top: '50%' }]}>غ</Text>
          <Text style={[styles.cardinal, { right: 8, top: '50%' }]}>شر</Text>

          {/* Needle */}
          <Animated.View
            style={[
              styles.needleContainer,
              { transform: [{ rotate: needleRotation }] },
            ]}
          >
            {/* Arrow toward Qibla (Mecca) */}
            <View style={styles.needleUp} />
            <View style={styles.needleDot} />
            <View style={styles.needleDown} />
          </Animated.View>

          {/* Center Kaaba icon */}
          <View style={styles.centerCircle}>
            <Text style={styles.kaabaEmoji}>🕋</Text>
          </View>
        </View>
      </View>

      {/* Accuracy indicator */}
      <View style={[styles.accuracyCard, { borderColor: accuracyColors[accuracy] }]}>
        <View style={[styles.accuracyDot, { backgroundColor: accuracyColors[accuracy] }]} />
        <Text style={[styles.accuracyText, { color: accuracyColors[accuracy] }]}>
          {accuracyLabels[accuracy]}
        </Text>
      </View>

      {/* Degree display */}
      <Text style={styles.degreeText}>
        {toArabicNumerals(Math.round(qiblaDirection))}° باتجاه الكعبة المشرفة
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.pearlWhite,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primaryGreen,
    paddingVertical: 16,
  },
  distanceCard: {
    backgroundColor: '#E8F4ED',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  distanceLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  distanceValue: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.primaryGreen,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  compassRing: {
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  degreeMarker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  markerLine: {
    width: 1.5,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 6,
  },
  cardinal: {
    position: 'absolute',
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primaryGreen,
  },
  needleContainer: {
    position: 'absolute',
    width: 4,
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleUp: {
    flex: 1,
    width: 4,
    backgroundColor: COLORS.primaryGreen,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  needleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
  },
  needleDown: {
    flex: 1,
    width: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  centerCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  kaabaEmoji: { fontSize: 20 },
  accuracyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  accuracyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accuracyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  degreeText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
  },
});
