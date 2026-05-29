// src/utils/prayerTimes.ts

import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { PrayerTime, PrayerTimes, HijriDate } from '../types';
import { HIJRI_MONTHS_AR, toArabicNumerals, PRAYER_NAMES_AR } from '../constants';

// ─── Calculate Prayer Times ──────────────────────────────
export function calculatePrayerTimes(
  lat: number,
  lng: number,
  date: Date = new Date()
): PrayerTimes {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.UmmAlQura();

  const pt = new AdhanPrayerTimes(coords, date, params);

  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

// ─── Format time to Arabic HH:MM ────────────────────────
export function formatTimeArabic(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const period = h < 12 ? 'ص' : 'م';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${toArabicNumerals(hour12.toString().padStart(2, '0'))}:${toArabicNumerals(mm)} ${period}`;
}

// ─── Get ordered prayer list ────────────────────────────
export function getPrayerList(times: PrayerTimes): PrayerTime[] {
  return [
    { name: 'fajr', nameAr: PRAYER_NAMES_AR.fajr, time: times.fajr, timeString: formatTimeArabic(times.fajr) },
    { name: 'sunrise', nameAr: PRAYER_NAMES_AR.sunrise, time: times.sunrise, timeString: formatTimeArabic(times.sunrise) },
    { name: 'dhuhr', nameAr: PRAYER_NAMES_AR.dhuhr, time: times.dhuhr, timeString: formatTimeArabic(times.dhuhr) },
    { name: 'asr', nameAr: PRAYER_NAMES_AR.asr, time: times.asr, timeString: formatTimeArabic(times.asr) },
    { name: 'maghrib', nameAr: PRAYER_NAMES_AR.maghrib, time: times.maghrib, timeString: formatTimeArabic(times.maghrib) },
    { name: 'isha', nameAr: PRAYER_NAMES_AR.isha, time: times.isha, timeString: formatTimeArabic(times.isha) },
  ];
}

// ─── Get current + next prayer ──────────────────────────
export function getNextPrayer(times: PrayerTimes): {
  current: PrayerTime | null;
  next: PrayerTime;
  secondsUntilNext: number;
  progressPercent: number;
} {
  const list = getPrayerList(times);
  const now = new Date();

  // Find next prayer
  let nextIndex = list.findIndex((p) => p.time > now);

  // After Isha → next is Fajr tomorrow
  if (nextIndex === -1) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = calculatePrayerTimes(
      // use default Jeddah if no coords stored
      21.4858, 39.1925, tomorrow
    );
    const tomorrowList = getPrayerList(tomorrowTimes);
    const tomorrowFajr = tomorrowList[0];
    const secondsUntilNext = Math.floor((tomorrowFajr.time.getTime() - now.getTime()) / 1000);
    const prevPrayer = list[list.length - 1];
    const totalSeconds = Math.floor((tomorrowFajr.time.getTime() - prevPrayer.time.getTime()) / 1000);
    const elapsed = totalSeconds - secondsUntilNext;
    const progressPercent = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
    return { current: list[list.length - 1], next: tomorrowFajr, secondsUntilNext, progressPercent };
  }

  const next = list[nextIndex];
  const current = nextIndex > 0 ? list[nextIndex - 1] : null;
  const secondsUntilNext = Math.floor((next.time.getTime() - now.getTime()) / 1000);

  let progressPercent = 0;
  if (current) {
    const totalSeconds = Math.floor((next.time.getTime() - current.time.getTime()) / 1000);
    const elapsed = totalSeconds - secondsUntilNext;
    progressPercent = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
  }

  return { current, next, secondsUntilNext, progressPercent };
}

// ─── Format countdown seconds → Arabic HH:MM:SS ─────────
export function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${toArabicNumerals(h.toString().padStart(2, '0'))}:${toArabicNumerals(m.toString().padStart(2, '0'))}:${toArabicNumerals(s.toString().padStart(2, '0'))}`;
  }
  return `${toArabicNumerals(m.toString().padStart(2, '0'))}:${toArabicNumerals(s.toString().padStart(2, '0'))}`;
}

// ─── Hijri Date Calculation ──────────────────────────────
export function getHijriDate(date: Date = new Date(), offset = 0): HijriDate {
  // Standard algorithmic Hijri conversion (adjusted for Saudi Umm Al-Qura approx)
  const jd = gregorianToJulian(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const hijri = julianToHijri(jd + offset);
  return {
    day: hijri.day,
    month: hijri.month,
    year: hijri.year,
    monthNameAr: HIJRI_MONTHS_AR[hijri.month - 1] ?? '',
  };
}

function gregorianToJulian(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524;
}

function julianToHijri(jd: number): { year: number; month: number; day: number } {
  jd = Math.floor(jd) + 0.5;
  const z = jd - 1948438.5 + 0.9999999;
  const cyc = Math.floor(z / 10631);
  z - cyc * 10631;
  const n = Math.floor((z - cyc * 10631) / 354.367) + 1;
  const nRem = z - cyc * 10631 - Math.floor((n - 1) * 354.367);
  const m = Math.ceil((nRem + 29) / 30);
  const d = Math.floor(nRem) - Math.floor((m - 1) * 29.5 + 0.001) + 1;
  return { year: 30 * cyc + n, month: m, day: Math.max(1, d) };
}

// ─── Qibla Direction ─────────────────────────────────────
export function calculateQiblaDirection(lat: number, lng: number): number {
  const meccaLat = 21.4225 * (Math.PI / 180);
  const meccaLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);

  const dLng = meccaLng - userLng;
  const y = Math.sin(dLng) * Math.cos(meccaLat);
  const x =
    Math.cos(userLat) * Math.sin(meccaLat) -
    Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(dLng);

  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  bearing = (bearing + 360) % 360;
  return bearing;
}

// ─── Distance to Mecca ───────────────────────────────────
export function distanceToMecca(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((21.4225 - lat) * Math.PI) / 180;
  const dLng = ((39.8262 - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((21.4225 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ─── Contextual Dua Engine ───────────────────────────────
export function getContextualDuaId(date: Date = new Date()): string | null {
  const h = date.getHours();
  const day = date.getDay(); // 0=Sun, 5=Fri
  const hijri = getHijriDate(date);

  // Friday
  if (day === 5 && h >= 4 && h < 7) return 'friday_fajr';
  // Day of Arafah (9 Dhul Hijja)
  if (hijri.month === 12 && hijri.day === 9) return 'arafah';
  // Last third of night (approx 1-4 AM)
  if (h >= 1 && h < 4) return 'tahajjud';
  // Rain (would need weather API — default null)
  // Morning adhkar time
  if (h >= 4 && h < 9) return 'morning_special';
  // Evening adhkar time
  if (h >= 16 && h < 20) return 'evening_special';

  return null;
}
