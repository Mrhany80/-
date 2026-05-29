// src/screens/TasbihScreen.tsx

import React, { useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Vibration, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withSequence, Easing, runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS, toArabicNumerals } from '../constants';
import { useStore } from '../store';

const { width } = Dimensions.get('window');
const BTN_SIZE = width * 0.55;

const TASBIH_OPTIONS: { key: 'subhanallah' | 'alhamdulillah' | 'allahakbar'; label: string; goal: number }[] = [
  { key: 'subhanallah', label: 'سبحان الله', goal: 33 },
  { key: 'alhamdulillah', label: 'الحمد لله', goal: 33 },
  { key: 'allahakbar', label: 'الله أكبر', goal: 34 },
];

// Animated wave ring
function WaveRing({ trigger }: { trigger: number }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (trigger === 0) return;
    scale.value = 0.5;
    opacity.value = 0.7;
    scale.value = withTiming(1.8, { duration: 800, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) });
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.waveRingWrapper, style]}>
      <Svg width={BTN_SIZE} height={BTN_SIZE}>
        <Circle
          cx={BTN_SIZE / 2}
          cy={BTN_SIZE / 2}
          r={BTN_SIZE / 2 - 4}
          stroke={COLORS.primaryGreen}
          strokeWidth={3}
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

export default function TasbihScreen() {
  const {
    tasbihCount, tasbihGoal, tasbihType, tasbihDailyTotal,
    incrementTasbih, resetTasbih, setTasbihType, setTasbihGoal,
  } = useStore();

  const tapTrigger = useRef(0);
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  const btnScale = useSharedValue(1);

  const handleTap = useCallback(() => {
    // Haptic feedback
    Vibration.vibrate(30);

    // Button press animation
    btnScale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );

    // Wave trigger
    tapTrigger.current += 1;
    runOnJS(forceUpdate)();
    runOnJS(incrementTasbih)();
  }, [incrementTasbih]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const progressPercent = Math.min(100, (tasbihCount / tasbihGoal) * 100);
  const isGoalReached = tasbihCount >= tasbihGoal;

  const currentOption = TASBIH_OPTIONS.find((o) => o.key === tasbihType) ?? TASBIH_OPTIONS[0];

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>المسبحة الرقمية</Text>

      {/* Type selector */}
      <View style={styles.typeRow}>
        {TASBIH_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.typeBtn, tasbihType === opt.key && styles.typeBtnActive]}
            onPress={() => {
              setTasbihType(opt.key);
              setTasbihGoal(opt.goal);
              resetTasbih();
            }}
          >
            <Text style={[styles.typeBtnText, tasbihType === opt.key && styles.typeBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tap Button with wave effect */}
      <View style={styles.tapArea}>
        <WaveRing trigger={tapTrigger.current} />
        <Animated.View style={[styles.tapBtnOuter, isGoalReached && styles.tapBtnGoal, btnStyle]}>
          <TouchableOpacity
            style={styles.tapBtnInner}
            onPress={handleTap}
            activeOpacity={0.9}
          >
            <Text style={styles.countText}>
              {toArabicNumerals(tasbihCount)}
            </Text>
            <Text style={styles.goalText}>
              / {toArabicNumerals(tasbihGoal)}
            </Text>
            <Text style={styles.tapHint}>اضغط للتسبيح</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Progress arc (simple bar below button) */}
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%`, backgroundColor: isGoalReached ? COLORS.gold : COLORS.primaryGreen },
            ]}
          />
        </View>
      </View>

      {/* Daily total + reset */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>إجمالي اليوم</Text>
          <Text style={styles.statValue}>{toArabicNumerals(tasbihDailyTotal)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>الجلسة الحالية</Text>
          <Text style={[styles.statValue, isGoalReached && { color: COLORS.gold }]}>
            {toArabicNumerals(tasbihCount)}
            {isGoalReached && ' ✓'}
          </Text>
        </View>
      </View>

      {/* Reset */}
      <TouchableOpacity style={styles.resetBtn} onPress={resetTasbih}>
        <Text style={styles.resetText}>إعادة تعيين</Text>
      </TouchableOpacity>
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

  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: COLORS.primaryGreen },
  typeBtnText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  typeBtnTextActive: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },

  tapArea: {
    width: BTN_SIZE + 80,
    height: BTN_SIZE + 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  waveRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapBtnOuter: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.primaryGreen,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  tapBtnGoal: {
    borderColor: COLORS.gold,
    backgroundColor: '#FDF7E8',
  },
  tapBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FONTS.bold,
    fontSize: 56,
    color: COLORS.primaryGreen,
    lineHeight: 64,
  },
  goalText: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: COLORS.textMuted,
  },
  tapHint: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
  },

  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E0D8CC',
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primaryGreen,
  },

  resetBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryGreen,
  },
  resetText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.primaryGreen,
  },
});
