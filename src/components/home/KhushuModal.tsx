// src/components/home/KhushuModal.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions,
} from 'react-native';
import { FONTS, COLORS } from '../../constants';
import { KHUSHU_VERSES } from '../../data/adhkar';
import { useStore } from '../../store';

const { width, height } = Dimensions.get('window');

export default function KhushuModal() {
  const { toggleKhushu } = useStore();
  const [verseIndex, setVerseIndex] = useState(0);
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 600, useNativeDriver: true,
    }).start();
  }, []);

  // Breathing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.02, duration: 3000, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Rotate verse every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((i) => (i + 1) % KHUSHU_VERSES.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const verse = KHUSHU_VERSES[verseIndex];

  return (
    <TouchableWithoutFeedback onPress={toggleKhushu}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.content, { transform: [{ scale: breatheAnim }] }]}
        >
          <Text style={styles.arabicText}>{verse.arabic}</Text>
          <Text style={styles.ref}>{verse.ref}</Text>
          <Text style={styles.hint}>اضغط للخروج من وضع الخشوع</Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  content: {
    width: width - 48,
    alignItems: 'center',
  },
  arabicText: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 20,
  },
  ref: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.primaryGreen,
    marginBottom: 40,
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: 'rgba(0,0,0,0.3)',
  },
});
