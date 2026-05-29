# مواقيت | أذكار السنة
## تطبيق أوقات الصلاة للمملكة العربية السعودية

---

## 🚀 البدء السريع

### 1. تحميل خط ثمانية (مطلوب)
```
اذهب إلى: https://font.thmanyah.com/
حمّل: ThmanyahSans-Regular.ttf + ThmanyahSans-Bold.ttf
ضعهم في: assets/fonts/
```

### 2. تثبيت المكتبات
```bash
npm install
```

### 3. تشغيل المشروع
```bash
# للتطوير
npx expo start

# على جهاز Android
npx expo start --android

# على جهاز iOS
npx expo start --ios
```

---

## 📦 بناء APK لـ Android

### الطريقة 1: EAS Build (موصى بها)
```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# إعداد المشروع (مرة واحدة)
eas build:configure

# بناء APK للتجربة
eas build --platform android --profile preview

# بناء AAB للنشر على Google Play
eas build --platform android --profile production
```

### الطريقة 2: بناء محلي
```bash
# توليد الكود الأصلي
npx expo prebuild --platform android

# بناء APK debug
cd android && ./gradlew assembleDebug

# ملف APK يوجد في:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🍎 بناء IPA لـ iOS

```bash
# EAS Build (يحتاج Apple Developer Account)
eas build --platform ios --profile production

# أو للمحاكي فقط
eas build --platform ios --profile preview
```

---

## ⚙️ ملف eas.json للبناء

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  }
}
```

---

## 🔑 إعداد مفاتيح API

### OpenWeather (لخلفية السماء)
1. سجّل في https://openweathermap.org/api
2. أضف المفتاح في `app.json`:
```json
"extra": { "openWeatherApiKey": "YOUR_KEY_HERE" }
```

---

## 📁 هيكل المشروع

```
mawaqeet/
├── App.tsx                    ← نقطة البداية
├── app.json                   ← إعدادات Expo
├── assets/
│   └── fonts/
│       ├── ThmanyahSans-Regular.ttf   ← مطلوب تحميله
│       └── ThmanyahSans-Bold.ttf      ← مطلوب تحميله
└── src/
    ├── constants/index.ts     ← الألوان، الخطوط، المدن
    ├── types/index.ts         ← TypeScript types
    ├── store/index.ts         ← Zustand global state
    ├── utils/
    │   └── prayerTimes.ts     ← محرك المواقيت (أم القرى)
    ├── data/
    │   └── adhkar.ts          ← قاعدة الأذكار (١٠٠+ ذكر)
    ├── hooks/
    │   ├── usePrayerEngine.ts ← GPS + حساب تلقائي
    │   └── useNotifications.ts← جدولة الأذان
    ├── screens/
    │   ├── HomeScreen.tsx     ← الرئيسية + الهلال الحي
    │   ├── AdhkarScreen.tsx   ← الأذكار + الذكاء السياقي
    │   ├── QiblaScreen.tsx    ← اتجاه القبلة
    │   ├── TasbihScreen.tsx   ← المسبحة الموجية
    │   ├── PulseMapScreen.tsx ← نبضة المملكة
    │   └── SettingsScreen.tsx ← الإعدادات
    ├── components/
    │   └── home/
    │       ├── LivingCrescent.tsx ← الهلال الحي
    │       └── KhushuModal.tsx    ← وضع الخشوع
    └── navigation/
        └── AppNavigator.tsx   ← شريط التنقل
```

---

## ✨ الميزات الفريدة

| الميزة | الوصف |
|--------|--------|
| 🌙 الهلال الحي | هلال يمتلئ مع اقتراب وقت الصلاة |
| 🧠 الذكاء السياقي | يعرض الدعاء المناسب تلقائياً بالوقت واليوم |
| 🗺️ نبضة المملكة | خريطة تضيء مدن المملكة لحظة دخول الصلاة |
| 📿 مسبحة الموجة | موجة صوتية بصرية عند كل نقرة |
| 🤍 وضع الخشوع | شاشة بيضاء بآية قرآنية فقط |
| 🧭 ويدجت القبلة | بوصلة حية على الشاشة الرئيسية |

---

## 🕌 المراجع الشرعية

- **الحساب**: طريقة أم القرى الرسمية
- **الأذكار**: حصن المسلم، صحيح البخاري، صحيح مسلم
- **لا يوجد**: أحاديث ضعيفة أو موضوعة

---

## 📱 متطلبات النظام

- **Android**: 7.0 (API 24) أو أعلى
- **iOS**: 14.0 أو أعلى
- **Node.js**: 18 أو أعلى
- **Expo SDK**: 51+
