// src/hooks/useNotifications.ts

import * as Notifications from 'expo-notifications';
import { PrayerTime } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllAdhanNotifications(
  prayers: PrayerTime[],
  minutesBefore: number
): Promise<void> {
  // Cancel all existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  for (const prayer of prayers) {
    if (prayer.name === 'sunrise') continue; // No adhan for sunrise

    // Skip past prayers today
    if (prayer.time <= now) continue;

    // Main adhan notification
    await Notifications.scheduleNotificationAsync({
      identifier: `adhan_${prayer.name}`,
      content: {
        title: `وقت ${prayer.nameAr}`,
        body: 'حان وقت الصلاة — اللهم اجعلنا من المصلين',
        sound: true,
        data: { prayer: prayer.name },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: prayer.time,
      },
    });

    // Pre-prayer reminder
    if (minutesBefore > 0) {
      const reminderTime = new Date(prayer.time.getTime() - minutesBefore * 60 * 1000);
      if (reminderTime > now) {
        await Notifications.scheduleNotificationAsync({
          identifier: `reminder_${prayer.name}`,
          content: {
            title: `تذكير — ${prayer.nameAr} بعد ${minutesBefore} دقيقة`,
            body: 'استعد لصلاتك',
            sound: false,
            data: { prayer: prayer.name, type: 'reminder' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderTime,
          },
        });
      }
    }
  }
}
