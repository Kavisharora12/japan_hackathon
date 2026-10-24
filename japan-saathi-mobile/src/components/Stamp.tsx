import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText, G } from 'react-native-svg';
import type { Verdict } from '@/lib/diet/types';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';

const LOOK: Record<Verdict, { ja: string; en: string; color: keyof ThemeColors }> = {
  safe: { ja: '安心', en: 'Looks OK', color: 'ok' },
  unsure: { ja: '確認', en: 'Ask staff', color: 'warn' },
  avoid: { ja: '不可', en: 'Avoid', color: 'bad' },
};

interface Props {
  verdict: Verdict;
  label: string;
  size?: number;
}

export function Stamp({ verdict, label, size = 110 }: Props) {
  const { colors } = useSaathiTheme();
  const l = LOOK[verdict];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        <G fill="none" stroke={colors[l.color]}>
          <Circle cx="60" cy="60" r="56" strokeWidth="3.5" />
          <Circle cx="60" cy="60" r="48" strokeWidth="1.5" />
          <SvgText
            x="60"
            y="32"
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            letterSpacing="2"
            fill={colors[l.color]}
            stroke="none"
          >
            {label.toUpperCase()}
          </SvgText>
          <SvgText
            x="60"
            y="72"
            textAnchor="middle"
            fontSize="30"
            fontWeight="900"
            fill={colors[l.color]}
            stroke="none"
          >
            {l.ja}
          </SvgText>
          <SvgText
            x="60"
            y="94"
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            letterSpacing="1.5"
            fill={colors[l.color]}
            stroke="none"
          >
            {l.en.toUpperCase()}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
});
