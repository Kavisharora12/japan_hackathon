import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';

interface Props {
  title?: string;
  subtitleJa?: string;
}

export function JapanSaathiHeader({ title = 'Japan Saathi', subtitleJa = '観光案内所' }: Props) {
  const { colors, mode, toggleTheme } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.eyebrow}>
          {title}
          <Text style={styles.subtle}> · Tourist Bureau for Indian travellers</Text>
        </Text>
      </View>
      <View style={styles.actions}>
        <Text style={styles.kanji}>{subtitleJa}</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          style={styles.themeButton}
        >
          <Text style={styles.themeButtonText}>{mode === 'dark' ? '☀' : '☾'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  textContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.sumiSoft,
  },
  subtle: {
    fontWeight: '500',
    textTransform: 'none',
  },
  kanji: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.sumiSoft,
    letterSpacing: 2,
  },
  themeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washiDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    color: colors.sumi,
    fontSize: 18,
    fontWeight: '800',
  },
});
