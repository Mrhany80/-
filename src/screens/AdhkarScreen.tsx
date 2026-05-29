// src/screens/AdhkarScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, toArabicNumerals } from '../constants';
import {
  ADHKAR, getDhikrByCategory, getDhikrById, getDailyHadith,
} from '../data/adhkar';
import { getContextualDuaId } from '../utils/prayerTimes';
import { Dhikr, DhikrCategory } from '../types';

const CATEGORIES: { key: DhikrCategory; label: string }[] = [
  { key: 'morning', label: 'أذكار الصباح' },
  { key: 'evening', label: 'أذكار المساء' },
  { key: 'after_prayer', label: 'بعد الصلاة' },
  { key: 'quran', label: 'أدعية قرآنية' },
  { key: 'misc', label: 'أذكار متنوعة' },
];

export default function AdhkarScreen() {
  const [activeCategory, setActiveCategory] = useState<DhikrCategory>('morning');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const contextualId = useMemo(() => getContextualDuaId(), []);
  const contextualDhikr = contextualId ? getDhikrById(contextualId) : null;
  const dailyHadith = getDailyHadith();

  const list = useMemo(
    () => getDhikrByCategory(activeCategory),
    [activeCategory]
  );

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const renderItem = ({ item }: { item: Dhikr }) => {
    const isRead = readIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.dhikrCard, isRead && styles.dhikrCardRead]}
        onPress={() => markRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.dhikrHeader}>
          <View style={[styles.repeatBadge, isRead && styles.repeatBadgeRead]}>
            <Text style={[styles.repeatText, isRead && styles.repeatTextRead]}>
              ×{toArabicNumerals(item.repeat)}
            </Text>
          </View>
          {isRead && (
            <View style={styles.readBadge}>
              <Text style={styles.readText}>✓ تمت القراءة</Text>
            </View>
          )}
        </View>
        <Text style={[styles.arabicText, isRead && styles.arabicTextRead]}>
          {item.arabic}
        </Text>
        <Text style={styles.sourceText}>{item.source}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.screenTitle}>الأذكار والأدعية</Text>

      {/* Contextual Dua Banner */}
      {contextualDhikr && (
        <View style={styles.contextualBanner}>
          <Text style={styles.contextualLabel}>دعاء مقترح الآن</Text>
          <Text style={styles.contextualText}>{contextualDhikr.arabic}</Text>
          <Text style={styles.contextualSource}>{contextualDhikr.source}</Text>
        </View>
      )}

      {/* Daily Hadith */}
      <View style={styles.hadithBanner}>
        <Text style={styles.hadithLabel}>حديث اليوم</Text>
        <Text style={styles.hadithText}>{dailyHadith.arabic}</Text>
        <Text style={styles.hadithSource}>{dailyHadith.source}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, activeCategory === cat.key && styles.tabActive]}
            onPress={() => {
              setActiveCategory(cat.key);
              setReadIds(new Set());
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === cat.key && styles.tabTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dhikr List */}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.pearlWhite },

  screenTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primaryGreen,
    textAlign: 'center',
    paddingVertical: 16,
  },

  contextualBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#E8F4ED',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryGreen,
  },
  contextualLabel: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primaryGreen,
    marginBottom: 6,
  },
  contextualText: {
    fontFamily: FONTS.regular,
    fontSize: 17,
    color: COLORS.textDark,
    lineHeight: 30,
  },
  contextualSource: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  hadithBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FDF7E8',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  hadithLabel: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#8B6914',
    marginBottom: 4,
  },
  hadithText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 26,
  },
  hadithSource: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  tabs: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 4,
  },
  tabActive: {
    backgroundColor: COLORS.primaryGreen,
  },
  tabText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  dhikrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E0D8CC',
  },
  dhikrCardRead: {
    opacity: 0.6,
    backgroundColor: '#F5F5F0',
  },
  dhikrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  repeatBadge: {
    backgroundColor: '#E8F4ED',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  repeatBadgeRead: { backgroundColor: '#EFEFEF' },
  repeatText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primaryGreen,
  },
  repeatTextRead: { color: COLORS.textMuted },
  readBadge: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  readText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: '#FFFFFF',
  },
  arabicText: {
    fontFamily: FONTS.regular,
    fontSize: 19,
    color: COLORS.textDark,
    lineHeight: 38,
    textAlign: 'right',
    marginBottom: 10,
  },
  arabicTextRead: { color: COLORS.textMuted },
  sourceText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
});
