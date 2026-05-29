// src/components/home/LivingCrescent.tsx
// The signature widget component — a crescent that fills with prayer progress

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, ClipPath, Rect } from 'react-native-svg';

interface Props {
  progress: number; // 0–100
  accentColor: string;
  isDark: boolean;
}

export default function LivingCrescent({ progress, accentColor, isDark }: Props) {
  const fillAnim = useSharedValue(progress);

  useEffect(() => {
    fillAnim.value = withTiming(progress, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const SIZE = 140;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 54;
  const r = 40;
  const offset = 18;

  // Crescent path: big circle minus offset small circle
  const crescentPath = `
    M ${cx} ${cy - R}
    A ${R} ${R} 0 1 1 ${cx} ${cy + R}
    A ${r} ${r} 0 1 0 ${cx} ${cy - R}
    Z
  `;

  const fillPercent = Math.min(100, Math.max(0, progress));
  const fillHeight = (fillPercent / 100) * SIZE;
  const fillY = SIZE - fillHeight;

  return (
    <View style={[styles.container, { width: SIZE, height: SIZE }]}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <ClipPath id="crescent-clip">
            <Path d={crescentPath} />
          </ClipPath>
          <ClipPath id="fill-clip">
            <Rect x={0} y={fillY} width={SIZE} height={fillHeight} />
          </ClipPath>
        </Defs>

        {/* Background crescent (outline) */}
        <Path
          d={crescentPath}
          fill={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}
          stroke={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'}
          strokeWidth={1}
        />

        {/* Filled portion */}
        <Path
          d={crescentPath}
          fill={accentColor}
          clipPath="url(#fill-clip)"
          opacity={0.9}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
