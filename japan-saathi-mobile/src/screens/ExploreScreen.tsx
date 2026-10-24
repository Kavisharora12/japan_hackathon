import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { DESTINATIONS } from '@/data/destinations';
import { type TabKey } from '@/components/JapanSaathiTabBar';
import { Poster } from '@/components/Poster';

interface Props {
  onNavigateTab: (tab: TabKey) => void;
  onOpenTaxi: (destinationId: string) => void;
}

const COUNTERS = [
  {
    tab: 'scan' as TabKey,
    no: '01',
    ja: '食',
    title: 'Is this Jain?',
    body: 'Point your camera at any Japanese label. We find hidden fish stock, gelatin, onion or mirin.',
    fill: 'sakura',
  },
  {
    tab: 'plan' as TabKey,
    no: '02',
    ja: '計',
    title: "A trip that's checked",
    body: 'Tell us who is coming. Saathi designs the days, and our checker verifies every meal, rupee and stair.',
    fill: 'mizu',
  },
  {
    tab: 'today' as TabKey,
    no: '03',
    ja: '今',
    title: 'On the ground',
    body: "Today's stops, live weather with a rain plan, taxi cards, and re-planning from wherever you are.",
    fill: 'yamabuki',
  },
] as const;

export function ExploreScreen({ onNavigateTab, onOpenTaxi }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const heroDest = DESTINATIONS[0]; // Fushimi Inari, Kyoto

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Hero Section matching Japan Saathi's 1930s Tourist Poster style */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Japan,{'\n'}without the{'\n'}
          <Text style={styles.heroHighlight}>guesswork.</Text>
        </Text>

        <Text style={styles.heroSubtitle}>
          Know what&rsquo;s in your food, what to do at the shrine, and what the whole trip costs in rupees.
          Made for vegetarian, Jain and halal travellers.
        </Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onNavigateTab('scan')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Scan a label</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onNavigateTab('plan')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Design my trip</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Travel Poster with Japanese Calligraphy */}
        <View style={styles.heroPosterContainer}>
          <View style={styles.verticalKanjiBox}>
            <Text style={styles.verticalKanjiText}>安心の旅</Text>
          </View>

          <View style={styles.heroPosterFrame}>
            <Poster art={heroDest.art} tone={heroDest.tone} width={260} height={340} />
            <View style={styles.posterFooterPill}>
              <Text style={styles.posterFooterCity}>Kyoto</Text>
              <Text style={styles.posterFooterAr}>See it in AR →</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Three Railway Ticket Counters */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>THREE COUNTERS, ONE COMPANION</Text>
      </View>

      <View style={styles.counterGrid}>
        {COUNTERS.map((c) => (
          <TouchableOpacity
            key={c.no}
            style={[styles.counterCard, { backgroundColor: colors[c.fill] }]}
            onPress={() => onNavigateTab(c.tab)}
            activeOpacity={0.8}
          >
            <View style={styles.counterTop}>
              <Text style={styles.counterNo}>{c.no}</Text>
              <Text style={styles.counterKanji}>{c.ja}</Text>
            </View>
            <Text style={styles.counterTitle}>{c.title}</Text>
            <Text style={styles.counterBody}>{c.body}</Text>
            <Text style={styles.counterArrow}>Open →</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Destinations with Authentic Poster Art */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>TIMELESS LANDMARKS · INDIA–JAPAN LINKS</Text>
      </View>

      <View style={styles.destList}>
        {DESTINATIONS.slice(0, 6).map((dest) => (
          <View key={dest.id} style={styles.destCard}>
            <View style={styles.destCardInner}>
              <View style={styles.destPosterSmall}>
                <Poster art={dest.art} tone={dest.tone} width={100} height={130} />
              </View>

              <View style={styles.destInfo}>
                <Text style={styles.destCity}>{dest.city}</Text>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destKanji}>{dest.nameJa}</Text>
                <Text style={styles.destBlurb} numberOfLines={3}>{dest.blurb}</Text>
              </View>
            </View>

            {dest.indiaLink && (
              <View style={styles.indiaBox}>
                <Text style={styles.indiaFlag}>🇮🇳 🇯🇵 India Connection:</Text>
                <Text style={styles.indiaText}>{dest.indiaLink}</Text>
              </View>
            )}

            <View style={styles.destFooter}>
              <Text style={styles.destPace}>
                ⏳ {dest.hours} hrs · {dest.walking} walk
              </Text>
              <TouchableOpacity
                style={styles.taxiQuickBtn}
                onPress={() => onOpenTaxi(dest.id)}
              >
                <Text style={styles.taxiQuickBtnText}>🚖 Taxi Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.washi,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroSection: {
    paddingTop: 10,
    paddingBottom: 28,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
  },
  heroTitle: {
    fontSize: 48,
    lineHeight: 50,
    fontWeight: '900',
    color: colors.sumi,
    letterSpacing: -1,
  },
  heroHighlight: {
    color: colors.shu,
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.sumiSoft,
    marginTop: 14,
    fontWeight: '500',
    maxWidth: 480,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    backgroundColor: colors.sumi,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 28,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.washi,
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: colors.washi,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.sumi,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondaryButtonText: {
    color: colors.sumi,
    fontWeight: '800',
    fontSize: 15,
  },
  heroPosterContainer: {
    marginTop: 28,
    alignItems: 'center',
    position: 'relative',
  },
  verticalKanjiBox: {
    position: 'absolute',
    left: 10,
    top: 20,
    zIndex: 10,
  },
  verticalKanjiText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.shu,
    lineHeight: 34,
    width: 30,
  },
  heroPosterFrame: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: colors.sumi,
    transform: [{ rotate: '1.5deg' }],
    shadowColor: colors.sumi,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    backgroundColor: colors.white,
  },
  posterFooterPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.washi,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.sumi,
  },
  posterFooterCity: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.sumi,
  },
  posterFooterAr: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.sumiSoft,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.sumiSoft,
    textTransform: 'uppercase',
  },
  counterGrid: {
    gap: 14,
  },
  counterCard: {
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 14,
    padding: 18,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  counterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counterNo: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.sumi,
  },
  counterKanji: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.sumi,
  },
  counterTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.sumi,
    marginBottom: 6,
  },
  counterBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.sumi,
    opacity: 0.9,
    fontWeight: '500',
  },
  counterArrow: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.sumi,
    marginTop: 10,
  },
  destList: {
    gap: 16,
  },
  destCard: {
    backgroundColor: colors.washiDeep,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 14,
    padding: 14,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  destCardInner: {
    flexDirection: 'row',
    gap: 14,
  },
  destPosterSmall: {
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 6,
    overflow: 'hidden',
  },
  destInfo: {
    flex: 1,
  },
  destCity: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.shu,
  },
  destName: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.sumi,
    marginTop: 2,
  },
  destKanji: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.sumiSoft,
    marginBottom: 6,
  },
  destBlurb: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.sumiSoft,
  },
  indiaBox: {
    backgroundColor: colors.washi,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.shu,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2d6c3',
  },
  indiaFlag: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.sumi,
    marginBottom: 2,
  },
  indiaText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.sumiSoft,
  },
  destFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dfd3c0',
  },
  destPace: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sumiSoft,
  },
  taxiQuickBtn: {
    backgroundColor: colors.sumi,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  taxiQuickBtnText: {
    color: colors.washi,
    fontWeight: '800',
    fontSize: 12,
  },
});
