import React from 'react';
import Svg, { Rect, Circle, Path, G, Ellipse, Text as SvgText } from 'react-native-svg';
import type { Art, Tone } from '@/data/destinations';

const TONES: Record<Tone, { sky: string; far: string; near: string }> = {
  sakura: { sky: '#f4cfc8', far: '#e9b5ad', near: '#d9968c' },
  yamabuki: { sky: '#f3dea4', far: '#e8c47a', near: '#c99b4f' },
  tokiha: { sky: '#f6c7ba', far: '#eca695', near: '#cf8070' },
  matcha: { sky: '#dde7c4', far: '#c0d19c', near: '#90ab70' },
  sora: { sky: '#cbe0ea', far: '#aac7d6', near: '#80a2b8' },
  fuji: { sky: '#ddd3ea', far: '#c4b5db', near: '#9d8ec0' },
  mizu: { sky: '#cfe6e1', far: '#abd0c8', near: '#80afa7' },
};

const INK = '#2b2522';
const SHU = '#d4573b';
const KON = '#24324a';
const GOLD = '#e2b33c';
const CREAM = '#fbf3e6';

interface Props {
  art: Art;
  tone: Tone;
  width?: number;
  height?: number;
}

export function Poster({ art, tone, width = 300, height = 400 }: Props) {
  const t = TONES[tone] || TONES.sakura;

  return (
    <Svg viewBox="0 0 300 400" width={width} height={height} preserveAspectRatio="xMidYMid slice">
      <Rect width="300" height="400" fill={t.sky} />
      {/* sun with print-offset ring */}
      <Circle cx="205" cy="120" r="58" fill={CREAM} />
      <Circle cx="208" cy="123" r="58" fill="none" stroke={INK} strokeOpacity="0.12" strokeWidth="1.5" />
      {/* distant Fuji-like ridge */}
      <Path d="M-10 260 L70 205 Q95 188 120 205 L190 250 L240 230 L310 255 L310 400 L-10 400Z" fill={t.far} />
      <Path d="M60 212 Q95 186 130 212 L118 214 L108 207 L96 215 L84 208 L72 215Z" fill={CREAM} />
      <Landmark art={art} />
      {/* foreground hill */}
      <Path d="M-10 330 Q80 300 160 322 T310 318 L310 400 L-10 400Z" fill={t.near} />
      {/* poster frame */}
      <Rect x="8" y="8" width="284" height="384" fill="none" stroke={INK} strokeWidth="2" />
    </Svg>
  );
}

function Landmark({ art }: { art: Art }) {
  switch (art) {
    case 'torii':
    case 'sea-torii':
      return (
        <G>
          {art === 'sea-torii' && (
            <G>
              <Rect x="-10" y="300" width="320" height="100" fill="#9cc9c0" />
              {[312, 326, 340].map((y) => (
                <Path key={y} d={`M0 ${y} q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0`} stroke={CREAM} strokeWidth="2" fill="none" />
              ))}
            </G>
          )}
          <Rect x="98" y="168" width="13" height="150" fill={SHU} />
          <Rect x="189" y="168" width="13" height="150" fill={SHU} />
          <Rect x="88" y="188" width="124" height="10" fill={SHU} />
          <Rect x="144" y="160" width="12" height="28" fill={SHU} />
          <Path d="M70 150 Q150 166 230 150 L234 140 Q150 156 66 140Z" fill={INK} />
          <Rect x="80" y="160" width="140" height="9" fill={SHU} />
          <Rect x="95" y="310" width="19" height="10" fill={INK} />
          <Rect x="186" y="310" width="19" height="10" fill={INK} />
        </G>
      );
    case 'pavilion':
      return (
        <G>
          <Rect x="40" y="306" width="220" height="40" fill="#8fbcb4" />
          <Rect x="95" y="262" width="110" height="44" fill="#6b4a2b" />
          <Rect x="95" y="272" width="110" height="18" fill={CREAM} />
          <Path d="M80 262 L220 262 L204 250 L96 250Z" fill={KON} />
          <Rect x="104" y="214" width="92" height="36" fill={GOLD} />
          <Path d="M90 214 L210 214 L196 202 L104 202Z" fill={KON} />
          <Rect x="120" y="172" width="60" height="30" fill={GOLD} />
          <Path d="M106 172 L194 172 L150 140Z" fill={KON} />
          <Rect x="147" y="128" width="6" height="12" fill={GOLD} />
          <Rect x="104" y="314" width="92" height="6" fill={GOLD} opacity="0.45" />
          <Rect x="120" y="326" width="60" height="4" fill={GOLD} opacity="0.3" />
        </G>
      );
    case 'pagoda':
      return (
        <G fill={KON}>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 300 - i * 32;
            const w = 92 - i * 12;
            return (
              <G key={i}>
                <Rect x={150 - w / 4} y={y - 18} width={w / 2} height="20" fill={SHU} />
                <Path d={`M${150 - w / 2 - 10} ${y - 18} L${150 + w / 2 + 10} ${y - 18} L${150 + w / 4} ${y - 30} L${150 - w / 4} ${y - 30}Z`} />
              </G>
            );
          })}
          <Rect x="148" y="118" width="4" height="52" fill={GOLD} />
          <Rect x="140" y="304" width="20" height="18" fill={SHU} />
        </G>
      );
    case 'hall':
      return (
        <G>
          <Rect x="60" y="270" width="180" height="50" fill={CREAM} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Rect key={i} x={66 + i * 24} y="270" width="6" height="50" fill="#6b4a2b" />
          ))}
          <Path d="M36 270 L264 270 L232 244 L68 244Z" fill={KON} />
          <Rect x="86" y="226" width="128" height="18" fill="#6b4a2b" />
          <Path d="M52 226 L248 226 L206 192 L94 192Z" fill={KON} />
          <Rect x="92" y="180" width="10" height="14" fill={GOLD} />
          <Rect x="198" y="180" width="10" height="14" fill={GOLD} />
        </G>
      );
    case 'bamboo':
      return (
        <G>
          {[30, 62, 88, 120, 148, 182, 210, 240, 268].map((x, i) => (
            <G key={x}>
              <Rect x={x} y={i % 2 ? 40 : 20} width={i % 3 ? 12 : 16} height="320" fill={i % 2 ? '#5f8a4a' : '#77a05c'} />
              {[90, 150, 210, 270].map((y) => (
                <Rect key={y} x={x - 1} y={y + (i % 2) * 14} width={i % 3 ? 14 : 18} height="3" fill={INK} opacity="0.35" />
              ))}
            </G>
          ))}
          <Path d="M100 340 Q150 300 200 340Z" fill="#c9b48a" />
        </G>
      );
    case 'lantern':
      return (
        <G>
          <Path d="M40 120 L260 120 L250 104 L50 104Z" fill={KON} />
          <Rect x="52" y="120" width="14" height="210" fill={SHU} />
          <Rect x="234" y="120" width="14" height="210" fill={SHU} />
          <Rect x="140" y="124" width="20" height="8" fill={INK} />
          <Rect x="100" y="132" width="100" height="12" rx="3" fill={INK} />
          <Ellipse cx="150" cy="210" rx="64" ry="72" fill={SHU} />
          <Rect x="112" y="186" width="76" height="48" fill={INK} />
          <SvgText x="150" y="222" textAnchor="middle" fontSize="30" fill={CREAM} fontWeight="800">雷門</SvgText>
          <Rect x="112" y="276" width="76" height="12" rx="3" fill={INK} />
        </G>
      );
    case 'fuji':
    default:
      return (
        <G>
          <Path d="M-10 300 L120 140 Q150 112 180 140 L310 300Z" fill="#7d9bb5" />
          <Path d="M120 140 Q150 112 180 140 L196 160 L178 154 L166 166 L150 152 L134 166 L122 154 L104 160Z" fill={CREAM} />
          <Rect x="-10" y="296" width="320" height="104" fill="#9cc2d4" />
          <G transform="translate(232, 196)">
            {[0, 1, 2, 3, 4].map((i) => (
              <G key={i}>
                <Rect x={-10 + i * 1.5} y={92 - i * 20} width={20 - i * 3} height="12" fill={SHU} />
                <Path d={`M${-18 + i * 2.4} ${92 - i * 20} H${18 - i * 2.4} L${11 - i * 2} ${84 - i * 20} H${-11 + i * 2}Z`} fill={KON} />
              </G>
            ))}
            <Rect x="-1" y="0" width="2" height="16" fill={GOLD} />
          </G>
        </G>
      );
  }
}

