import { Platform } from 'react-native';

export const JapanSaathiColors = {
  washi: '#f6efe3',        // warm handmade paper
  washiDeep: '#ede3d1',    // card paper
  sumi: '#2b2522',         // ink black
  sumiSoft: '#5d544e',     // soft ink
  sakura: '#f4cfc8',       // cherry blossom pastel
  tokiha: '#ee9a8b',       // coral
  shu: '#b8452c',          // vermilion torii-red
  mizu: '#b5d6d0',         // water teal
  sora: '#c3dbe6',         // sky blue
  kon: '#24324a',          // indigo
  matcha: '#cfdcae',       // matcha green
  yamabuki: '#ecc46a',     // golden kerria
  fuji: '#cfc2e2',         // wisteria
  ok: '#4f7a52',           // green (safe)
  warn: '#a8731f',         // amber (unsure)
  bad: '#b8432f',          // red (avoid)
  white: '#ffffff',
  black: '#000000',
  border: '#2b2522',
};

export const Colors = {
  light: {
    text: JapanSaathiColors.sumi,
    background: JapanSaathiColors.washi,
    backgroundElement: JapanSaathiColors.washiDeep,
    backgroundSelected: JapanSaathiColors.sakura,
    textSecondary: JapanSaathiColors.sumiSoft,
  },
  dark: {
    text: '#f1e8da',
    background: '#1d2333',
    backgroundElement: '#262d40',
    backgroundSelected: '#3a445d',
    textSecondary: '#c2b8aa',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    rounded: 'system-ui, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
};

export const MaxContentWidth = 768;
export const BottomTabInset = 70;
