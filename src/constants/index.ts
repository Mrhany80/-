// src/constants/index.ts

import { CityCoords, PrayerName } from '../types';

// ─── Colors ─────────────────────────────────────────────
export const COLORS = {
  primaryGreen: '#1A5C38',
  gold: '#C9A84C',
  deepNight: '#0D1B2A',
  pearlWhite: '#F8F5EF',
  warmSand: '#E8DCC8',
  softCream: '#FAF7F2',
  textDark: '#1C1C1E',
  textLight: '#FFFFFF',
  textMuted: '#6B6B6B',
  border: '#E0D8CC',

  prayer: {
    fajr: { bg: '#0D1B2A', accent: '#3D5A80', text: '#C8D8E8' },
    sunrise: { bg: '#FF8C42', accent: '#FFD166', text: '#FFFFFF' },
    dhuhr: { bg: '#F8F5EF', accent: '#1A5C38', text: '#1C1C1E' },
    asr: { bg: '#D4956A', accent: '#C9A84C', text: '#FFFFFF' },
    maghrib: { bg: '#8B2500', accent: '#C9A84C', text: '#FFFFFF' },
    isha: { bg: '#0D1B2A', accent: '#C9A84C', text: '#E0E0E0' },
  },
} as const;

// ─── Fonts ──────────────────────────────────────────────
export const FONTS = {
  regular: 'ThmanyahSans-Regular',
  bold: 'ThmanyahSans-Bold',
} as const;

// ─── Prayer Names Arabic ─────────────────────────────────
export const PRAYER_NAMES_AR: Record<PrayerName, string> = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

// ─── Saudi Cities ────────────────────────────────────────
export const SAUDI_CITIES: CityCoords[] = [
  { name: 'Jeddah', nameAr: 'جدة', lat: 21.4858, lng: 39.1925, timezone: 3 },
  { name: 'Riyadh', nameAr: 'الرياض', lat: 24.6877, lng: 46.7219, timezone: 3 },
  { name: 'Mecca', nameAr: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, timezone: 3 },
  { name: 'Medina', nameAr: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { name: 'Dammam', nameAr: 'الدمام', lat: 26.4207, lng: 50.0888, timezone: 3 },
  { name: 'Khobar', nameAr: 'الخبر', lat: 26.2172, lng: 50.1971, timezone: 3 },
  { name: 'Taif', nameAr: 'الطائف', lat: 21.2702, lng: 40.4158, timezone: 3 },
  { name: 'Abha', nameAr: 'أبها', lat: 18.2164, lng: 42.5053, timezone: 3 },
  { name: 'Tabuk', nameAr: 'تبوك', lat: 28.3998, lng: 36.5716, timezone: 3 },
  { name: 'Hail', nameAr: 'حائل', lat: 27.5114, lng: 41.7208, timezone: 3 },
  { name: 'Qassim', nameAr: 'القصيم', lat: 26.3260, lng: 43.9750, timezone: 3 },
  { name: 'Najran', nameAr: 'نجران', lat: 17.4924, lng: 44.1277, timezone: 3 },
  { name: 'Jizan', nameAr: 'جازان', lat: 16.8894, lng: 42.5511, timezone: 3 },
  { name: 'Yanbu', nameAr: 'ينبع', lat: 24.0894, lng: 38.0618, timezone: 3 },
  { name: 'Khamis Mushait', nameAr: 'خميس مشيط', lat: 18.3069, lng: 42.7341, timezone: 3 },
];

// ─── Mecca Coordinates (Qibla target) ───────────────────
export const MECCA_COORDS = { lat: 21.4225, lng: 39.8262 };

// ─── Hijri Month Names ───────────────────────────────────
export const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

// ─── Arabic Numerals ─────────────────────────────────────
export const toArabicNumerals = (n: number | string): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
};
