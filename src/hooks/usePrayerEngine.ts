// src/hooks/usePrayerEngine.ts

import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useStore } from '../store';
import {
  calculatePrayerTimes,
  getNextPrayer,
  getHijriDate,
  getPrayerList,
} from '../utils/prayerTimes';
import { SAUDI_CITIES } from '../constants';
import { scheduleAllAdhanNotifications } from './useNotifications';

export function usePrayerEngine() {
  const {
    userLat, userLng, hijriOffset,
    setLocation, setPrayerTimes, setNextPrayer, setHijriDate,
    notifyMinutesBefore, adhanSound, prayerTimes,
  } = useStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Request location & calculate on mount ────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;

        // Find nearest Saudi city
        const nearest = SAUDI_CITIES.reduce((prev, curr) => {
          const prevD = Math.hypot(prev.lat - lat, prev.lng - lng);
          const currD = Math.hypot(curr.lat - lat, curr.lng - lng);
          return currD < prevD ? curr : prev;
        });

        setLocation(lat, lng, nearest);
        computePrayers(lat, lng);
      } else {
        // Use default Jeddah
        computePrayers(userLat, userLng);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recompute when location or offset changes ────────
  useEffect(() => {
    computePrayers(userLat, userLng);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLat, userLng, hijriOffset]);

  // ── Live countdown ticker ────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!prayerTimes) return;
      const { next, current, secondsUntilNext, progressPercent } = getNextPrayer(prayerTimes);
      setNextPrayer(next, current, secondsUntilNext, progressPercent);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerTimes]);

  function computePrayers(lat: number, lng: number) {
    const times = calculatePrayerTimes(lat, lng, new Date());
    setPrayerTimes(times);

    const { next, current, secondsUntilNext, progressPercent } = getNextPrayer(times);
    setNextPrayer(next, current, secondsUntilNext, progressPercent);

    const hijri = getHijriDate(new Date(), hijriOffset);
    setHijriDate(hijri);

    // Schedule adhan notifications
    const list = getPrayerList(times);
    scheduleAllAdhanNotifications(list, notifyMinutesBefore).catch(console.warn);
  }
}
