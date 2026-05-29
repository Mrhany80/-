// src/store/index.ts

import { create } from 'zustand';
import { PrayerTimes, PrayerTime, CityCoords, HijriDate } from '../types';
import { SAUDI_CITIES } from '../constants';

interface AppState {
  // Location
  userCity: CityCoords;
  userLat: number;
  userLng: number;
  setLocation: (lat: number, lng: number, city?: CityCoords) => void;

  // Prayer Times
  prayerTimes: PrayerTimes | null;
  nextPrayer: PrayerTime | null;
  currentPrayer: PrayerTime | null;
  secondsUntilNext: number;
  progressPercent: number;
  setPrayerTimes: (times: PrayerTimes) => void;
  setNextPrayer: (
    next: PrayerTime,
    current: PrayerTime | null,
    seconds: number,
    progress: number
  ) => void;

  // Hijri Date
  hijriDate: HijriDate | null;
  hijriOffset: number;
  setHijriDate: (d: HijriDate) => void;
  setHijriOffset: (offset: number) => void;

  // Khushu Mode
  khushuMode: boolean;
  khushuAutoEnabled: boolean;
  toggleKhushu: () => void;
  setKhushuAuto: (v: boolean) => void;

  // Tasbih
  tasbihCount: number;
  tasbihGoal: number;
  tasbihType: 'subhanallah' | 'alhamdulillah' | 'allahakbar' | 'custom';
  incrementTasbih: () => void;
  resetTasbih: () => void;
  setTasbihType: (t: AppState['tasbihType']) => void;
  setTasbihGoal: (n: number) => void;
  tasbihDailyTotal: number;
  addTasbihToDaily: (n: number) => void;

  // Settings
  adhanSound: string;
  notifyMinutesBefore: number;
  darkMode: 'auto' | 'light' | 'dark';
  setAdhanSound: (s: string) => void;
  setNotifyMinutes: (n: number) => void;
  setDarkMode: (m: 'auto' | 'light' | 'dark') => void;

  // Font loaded
  fontsLoaded: boolean;
  setFontsLoaded: (v: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Location
  userCity: SAUDI_CITIES[0], // Default: Jeddah
  userLat: 21.4858,
  userLng: 39.1925,
  setLocation: (lat, lng, city) =>
    set((s) => ({
      userLat: lat,
      userLng: lng,
      userCity: city ?? s.userCity,
    })),

  // Prayer Times
  prayerTimes: null,
  nextPrayer: null,
  currentPrayer: null,
  secondsUntilNext: 0,
  progressPercent: 0,
  setPrayerTimes: (times) => set({ prayerTimes: times }),
  setNextPrayer: (next, current, seconds, progress) =>
    set({
      nextPrayer: next,
      currentPrayer: current,
      secondsUntilNext: seconds,
      progressPercent: progress,
    }),

  // Hijri
  hijriDate: null,
  hijriOffset: 0,
  setHijriDate: (d) => set({ hijriDate: d }),
  setHijriOffset: (offset) => set({ hijriOffset: offset }),

  // Khushu
  khushuMode: false,
  khushuAutoEnabled: true,
  toggleKhushu: () => set((s) => ({ khushuMode: !s.khushuMode })),
  setKhushuAuto: (v) => set({ khushuAutoEnabled: v }),

  // Tasbih
  tasbihCount: 0,
  tasbihGoal: 33,
  tasbihType: 'subhanallah',
  tasbihDailyTotal: 0,
  incrementTasbih: () =>
    set((s) => ({
      tasbihCount: s.tasbihCount + 1,
      tasbihDailyTotal: s.tasbihDailyTotal + 1,
    })),
  resetTasbih: () => set({ tasbihCount: 0 }),
  setTasbihType: (t) => set({ tasbihType: t, tasbihCount: 0 }),
  setTasbihGoal: (n) => set({ tasbihGoal: n }),
  addTasbihToDaily: (n) => set((s) => ({ tasbihDailyTotal: s.tasbihDailyTotal + n })),

  // Settings
  adhanSound: 'mecca',
  notifyMinutesBefore: 10,
  darkMode: 'auto',
  setAdhanSound: (s) => set({ adhanSound: s }),
  setNotifyMinutes: (n) => set({ notifyMinutesBefore: n }),
  setDarkMode: (m) => set({ darkMode: m }),

  // Fonts
  fontsLoaded: false,
  setFontsLoaded: (v) => set({ fontsLoaded: v }),
}));
