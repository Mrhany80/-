// src/screens/SettingsScreen.tsx

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SAUDI_CITIES, toArabicNumerals } from '../constants';
import { useStore } from '../store';

const ADHAN_OPTIONS = [
  { key: 'mecca', label: 'مكة المكرمة — الشيخ علي أحمد ملا' },
  { key: 'medina', label: 'المدينة المنورة — الشيخ علي ماهر' },
  { key: 'kuwait', label: 'الكويت الكلاسيكي' },
  { key: 'quiet', label: 'صوت هادئ للليل' },
];

const NOTIFY_OPTIONS = [5, 10, 15];
const DARK_OPTIONS: { key: 'auto' | 'light' | 'dark'; label: string }[] = [
  { key: 'auto', label: 'تلقائي' },
  { key: 'light', label: 'فاتح' },
  { key: 'dark', label: 'داكن' },
];

export default function SettingsScreen() {
  const {
    adhanSound, setAdhanSound,
    notifyMinutesBefore, setNotifyMinutes,
    hijriOffset, setHijriOffset,
    darkMode, setDarkMode,
    khushuAutoEnabled, setKhushuAuto,
    userCity, setLocation,
  } = useStore();

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>الإعدادات</Text>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* City Selection */}
        <Text style={styles.sectionLabel}>المدينة</Text>
        <View style={styles.card}>
          {SAUDI_CITIES.map((city) => (
            <TouchableOpacity
              key={city.name}
              style={[
                styles.option,
                userCity.name === city.name && styles.optionActive,
              ]}
              onPress={() => setLocation(city.lat, city.lng, city)}
            >
              <Text
                style={[
                  styles.optionText,
                  userCity.name === city.name && styles.optionTextActive,
                ]}
              >
                {city.nameAr}
              </Text>
              {userCity.name === city.name && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Adhan Sound */}
        <Text style={styles.sectionLabel}>صوت الأذان</Text>
        <View style={styles.card}>
          {ADHAN_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.option,
                adhanSound === opt.key && styles.optionActive,
              ]}
              onPress={() => setAdhanSound(opt.key)}
            >
              <Text
                style={[
                  styles.optionText,
                  adhanSound === opt.key && styles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {adhanSound === opt.key && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification Timing */}
        <Text style={styles.sectionLabel}>تنبيه قبل الصلاة</Text>
        <View style={[styles.card, { flexDirection: 'row', gap: 8 }]}>
          {NOTIFY_OPTIONS.map((min) => (
            <TouchableOpacity
              key={min}
              style={[
                styles.numBtn,
                notifyMinutesBefore === min && styles.numBtnActive,
              ]}
              onPress={() => setNotifyMinutes(min)}
            >
              <Text
                style={[
                  styles.numBtnText,
                  notifyMinutesBefore === min && styles.numBtnTextActive,
                ]}
              >
                {toArabicNumerals(min)} دقيقة
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hijri Offset */}
        <Text style={styles.sectionLabel}>تعديل التقويم الهجري</Text>
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }]}>
          <TouchableOpacity
            style={styles.offsetBtn}
            onPress={() => setHijriOffset(Math.max(-2, hijriOffset - 1))}
          >
            <Text style={styles.offsetBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.offsetValue}>
            {hijriOffset === 0
              ? 'الافتراضي'
              : `${hijriOffset > 0 ? '+' : ''}${toArabicNumerals(hijriOffset)} يوم`}
          </Text>
          <TouchableOpacity
            style={styles.offsetBtn}
            onPress={() => setHijriOffset(Math.min(2, hijriOffset + 1))}
          >
            <Text style={styles.offsetBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Theme */}
        <Text style={styles.sectionLabel}>المظهر</Text>
        <View style={[styles.card, { flexDirection: 'row', gap: 8 }]}>
          {DARK_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.numBtn, darkMode === opt.key && styles.numBtnActive]}
              onPress={() => setDarkMode(opt.key)}
            >
              <Text style={[styles.numBtnText, darkMode === opt.key && styles.numBtnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Khushu Mode */}
        <Text style={styles.sectionLabel}>وضع الخشوع التلقائي</Text>
        <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.optionText}>تفعيل عند دخول وقت الصلاة</Text>
          <Switch
            value={khushuAutoEnabled}
            onValueChange={setKhushuAuto}
            trackColor={{ false: '#E0E0E0', true: COLORS.primaryGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* App info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>مواقيت | أذكار السنة</Text>
          <Text style={styles.infoSub}>طريقة الحساب: أم القرى الرسمية</Text>
          <Text style={styles.infoSub}>الأدعية: من صحيح البخاري ومسلم وحصن المسلم</Text>
          <Text style={styles.infoSub}>الإصدار ١.٠.٠</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.pearlWhite },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primaryGreen,
    textAlign: 'center',
    paddingVertical: 16,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },

  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 6,
    marginTop: 16,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E0D8CC',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0EBE3',
  },
  optionActive: { backgroundColor: '#F0F9F4' },
  optionText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textDark,
    textAlign: 'right',
  },
  optionTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primaryGreen,
  },
  checkmark: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.primaryGreen,
  },

  numBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    margin: 6,
  },
  numBtnActive: { backgroundColor: COLORS.primaryGreen },
  numBtnText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  numBtnTextActive: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },

  offsetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offsetBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
  },
  offsetValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textDark,
    minWidth: 80,
    textAlign: 'center',
  },

  infoCard: {
    marginTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.primaryGreen,
  },
  infoSub: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
