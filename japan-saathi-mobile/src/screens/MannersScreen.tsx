import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { RITUALS, PHRASES, EMERGENCY } from '@/data/culture';

export function MannersScreen() {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedRitualId, setSelectedRitualId] = useState(RITUALS[0].id);
  const activeRitual = RITUALS.find((r) => r.id === selectedRitualId) || RITUALS[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Manners & Culture</Text>
        <Text style={styles.titleJa}>作法と言葉</Text>
      </View>
      <Text style={styles.subtitle}>
        The unwritten rules, step by step. Nobody expects perfection in Japan; simply trying earns warm smiles.
      </Text>

      {/* Ritual Navigation Tabs */}
      <Text style={styles.sectionLabel}>STEP-BY-STEP GUIDES:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ritualTabsRow}>
        {RITUALS.map((r) => {
          const active = r.id === activeRitual.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.ritualTab, active && styles.activeRitualTab]}
              onPress={() => setSelectedRitualId(r.id)}
            >
              <Text style={[styles.ritualTabText, active && styles.activeRitualTabText]}>
                {r.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Ritual Steps Book */}
      <View style={styles.ritualCard}>
        <View style={styles.ritualHeader}>
          <Text style={styles.ritualTitle}>{activeRitual.title}</Text>
          <Text style={styles.ritualJa}>{activeRitual.ja}</Text>
        </View>
        <Text style={styles.ritualIntro}>{activeRitual.intro}</Text>

        <View style={styles.stepsList}>
          {activeRitual.steps.map((step, idx) => (
            <View key={idx} style={styles.stepItem}>
              <View style={styles.stepSeal}>
                <Text style={styles.stepSealText}>{step.seal}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepDo}>{step.do}</Text>
                {step.tip && <Text style={styles.stepTip}>💡 {step.tip}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Essential Travel Phrases */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>VOCABULARY ON THE GO</Text>
        <Text style={styles.sectionTitle}>Essential Japanese Phrases</Text>
      </View>

      <View style={styles.phraseGroupsList}>
        {PHRASES.map((group, gIdx) => (
          <View key={gIdx} style={styles.phraseGroup}>
            <Text style={styles.phraseGroupTitle}>{group.group}</Text>
            <View style={styles.phraseCardsList}>
              {group.items.map((p, i) => (
                <View key={i} style={styles.phraseCard}>
                  <View style={styles.phraseTop}>
                    <Text style={styles.phraseJa}>{p.ja}</Text>
                    <Text style={styles.phraseMeaning}>{p.en}</Text>
                  </View>
                  <Text style={styles.phraseRomaji}>"{p.romaji}"</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Offline Emergency Numbers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>SAFETY FIRST</Text>
        <Text style={styles.sectionTitle}>Emergency Contacts (Offline)</Text>
      </View>

      <View style={styles.emergencyGrid}>
        {EMERGENCY.map((e, idx) => (
          <View key={idx} style={styles.emergencyCard}>
            <View style={styles.emergencyTop}>
              <Text style={styles.emergencyService}>{e.label}</Text>
              <Text style={styles.emergencyNumber}>{e.number}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.sumi,
  },
  titleJa: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.sumiSoft,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.sumiSoft,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumiSoft,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ritualTabsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  ritualTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washiDeep,
  },
  activeRitualTab: {
    backgroundColor: colors.sumi,
  },
  ritualTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumi,
  },
  activeRitualTabText: {
    color: colors.washi,
  },
  ritualCard: {
    backgroundColor: colors.sakura,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 4,
  },
  ritualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  ritualTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.sumi,
  },
  ritualJa: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.sumiSoft,
  },
  ritualIntro: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.sumi,
    marginTop: 4,
    marginBottom: 14,
    opacity: 0.9,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.sumi,
  },
  stepSeal: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.sumi,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepSealText: {
    color: colors.washi,
    fontSize: 16,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepDo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumi,
    lineHeight: 18,
  },
  stepTip: {
    fontSize: 11,
    color: colors.sumiSoft,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumiSoft,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.sumi,
    marginTop: 2,
  },
  phraseGroupsList: {
    gap: 14,
    marginBottom: 20,
  },
  phraseGroup: {
    gap: 6,
  },
  phraseGroupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.shu,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phraseCardsList: {
    gap: 8,
  },
  phraseCard: {
    backgroundColor: colors.washiDeep,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 10,
    padding: 12,
  },
  phraseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  phraseJa: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.sumi,
  },
  phraseMeaning: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.shu,
  },
  phraseRomaji: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sumiSoft,
    marginTop: 2,
    fontStyle: 'italic',
  },
  emergencyGrid: {
    gap: 10,
    marginBottom: 20,
  },
  emergencyCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 10,
    padding: 12,
    shadowColor: colors.sumi,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 3,
  },
  emergencyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyService: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.sumi,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.shu,
  },
});
