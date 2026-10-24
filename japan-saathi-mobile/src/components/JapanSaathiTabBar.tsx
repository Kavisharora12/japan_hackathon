import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';

export type TabKey = 'explore' | 'scan' | 'plan' | 'today' | 'manners';

interface Props {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

const TABS: { key: TabKey; ja: string; en: string }[] = [
  { key: 'explore', ja: '旅', en: 'Explore' },
  { key: 'scan', ja: '食', en: 'Scan food' },
  { key: 'plan', ja: '計', en: 'Studio' },
  { key: 'today', ja: '今', en: 'Today' },
  { key: 'manners', ja: '礼', en: 'Manners' },
];

export function JapanSaathiTabBar({ activeTab, onSelectTab }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrapper}>
      <View style={styles.pillContainer}>
        {TABS.map((t) => {
          const isActive = t.key === activeTab;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectTab(t.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.kanjiText, isActive && styles.activeKanjiText]}>
                {t.ja}
              </Text>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {t.en}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 100,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: colors.washi,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 18,
    padding: 4,
    maxWidth: 440,
    width: '100%',
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: colors.sumi,
  },
  kanjiText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.sumiSoft,
  },
  activeKanjiText: {
    color: colors.washi,
    transform: [{ scale: 1.08 }],
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.sumiSoft,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.washi,
  },
});
