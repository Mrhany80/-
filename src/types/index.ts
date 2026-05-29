// src/types/index.ts

export type PrayerName =
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface PrayerTime {
  name: PrayerName;
  nameAr: string;
  time: Date;
  timeString: string;
}

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface CityCoords {
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  timezone: number;
}

export interface Dhikr {
  id: string;
  arabic: string;
  translation?: string;
  source: string;
  repeat: number;
  category: DhikrCategory;
}

export type DhikrCategory =
  | 'morning'
  | 'evening'
  | 'after_prayer'
  | 'quran'
  | 'misc';

export interface TasbihEntry {
  date: string;
  subhanAllah: number;
  alhamdulillah: number;
  allahuAkbar: number;
  custom: number;
}

export type PrayerPeriod =
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameAr: string;
}

export type TabParamList = {
  Home: undefined;
  Adhkar: undefined;
  Qibla: undefined;
  Tasbih: undefined;
  Map: undefined;
  Settings: undefined;
};
