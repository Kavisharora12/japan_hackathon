import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JapanSaathiColors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = typeof JapanSaathiColors;

const THEME_KEY = 'japan-saathi.theme';

const DARK_COLORS: ThemeColors = {
  ...JapanSaathiColors,
  washi: '#1d2333',
  washiDeep: '#262d40',
  sumi: '#f1e8da',
  sumiSoft: '#c2b8aa',
  sakura: '#603a3b',
  tokiha: '#613d3b',
  shu: '#f08a6c',
  mizu: '#2e4c4a',
  sora: '#354b5c',
  kon: '#a8bad5',
  matcha: '#3b4b32',
  yamabuki: '#594a29',
  fuji: '#4a4059',
  ok: '#8fc994',
  warn: '#e5ba67',
  bad: '#f08a6c',
  white: '#30384a',
  black: '#f1e8da',
  border: '#f1e8da',
};

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: JapanSaathiColors,
  toggleTheme: () => undefined,
});

export function SaathiThemeProvider({ children }: React.PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (mounted && (saved === 'light' || saved === 'dark')) setMode(saved);
      })
      .catch((error) => console.error('Could not load theme preference', error));
    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem(THEME_KEY, next).catch((error) => {
      console.error('Could not save theme preference', error);
    });
  };

  const value = useMemo(
    () => ({ mode, colors: mode === 'dark' ? DARK_COLORS : JapanSaathiColors, toggleTheme }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSaathiTheme() {
  return useContext(ThemeContext);
}
