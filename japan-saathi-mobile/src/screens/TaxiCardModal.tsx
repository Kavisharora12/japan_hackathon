import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { DESTINATIONS, type Destination } from '@/data/destinations';

interface Props {
  visible: boolean;
  initialDestinationId?: string;
  onClose: () => void;
}

export function TaxiCardModal({ visible, initialDestinationId, onClose }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedId, setSelectedId] = useState<string>(initialDestinationId || DESTINATIONS[0].id);
  const currentDest = DESTINATIONS.find((d) => d.id === selectedId) || DESTINATIONS[0];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Close</Text>
            </TouchableOpacity>
            <Text style={styles.eyebrow}>Taxi Driver Card</Text>
          </View>

          {/* Quick Destination Switcher */}
          <View style={styles.selectorWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorContent}>
              {DESTINATIONS.map((dest) => {
                const active = dest.id === currentDest.id;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    style={[styles.destChip, active && styles.activeDestChip]}
                    onPress={() => setSelectedId(dest.id)}
                  >
                    <Text style={[styles.destChipText, active && styles.activeDestChipText]}>
                      {dest.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* The Giant Kanji Card */}
            <View style={styles.taxiCard}>
              <Text style={styles.toDriver}>運転手さんへ</Text>
              <Text style={styles.toDriverEn}>To the taxi driver</Text>

              <Text style={styles.kanjiDestination} selectable>
                {currentDest.nameJa}
              </Text>

              <View style={styles.requestBox}>
                <Text style={styles.requestJa}>{currentDest.taxi.ja}</Text>
                <Text style={styles.requestRomaji}>{currentDest.taxi.romaji}</Text>
              </View>

              <View style={styles.addressBox}>
                <Text style={styles.postalMark}>〒 住所 (Address for Navi)</Text>
                <Text style={styles.addressText} selectable>
                  {currentDest.taxi.address}
                </Text>
              </View>
            </View>

            {/* Phonetic speech guide & taxi etiquette */}
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>How to say it:</Text>
              <Text style={styles.phoneticText}>"{currentDest.taxi.say}"</Text>

              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>🚪</Text>
                <Text style={styles.tipText}>
                  Don't touch the taxi door! In Japan, the left passenger door opens and closes automatically by the driver.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  backButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: colors.sumi,
  },
  eyebrow: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.sumiSoft,
  },
  selectorWrapper: {
    backgroundColor: colors.washiDeep,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
  },
  selectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  destChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  activeDestChip: {
    backgroundColor: colors.sumi,
  },
  destChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sumi,
  },
  activeDestChipText: {
    color: colors.washi,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  taxiCard: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.sumi,
    borderRadius: 10,
    padding: 20,
    shadowColor: colors.sumi,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  toDriver: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.shu,
  },
  toDriverEn: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.sumiSoft,
    marginBottom: 16,
  },
  kanjiDestination: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.black,
    lineHeight: 48,
    marginBottom: 16,
  },
  requestBox: {
    backgroundColor: colors.washi,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    marginBottom: 16,
  },
  requestJa: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.sumi,
    lineHeight: 28,
  },
  requestRomaji: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.sumiSoft,
    marginTop: 6,
    fontStyle: 'italic',
  },
  addressBox: {
    borderTopWidth: 2,
    borderTopColor: colors.sumi,
    paddingTop: 12,
  },
  postalMark: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sumiSoft,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 24,
  },
  guideCard: {
    marginTop: 20,
    backgroundColor: colors.washi,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    padding: 16,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumiSoft,
    textTransform: 'uppercase',
  },
  phoneticText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.sumi,
    marginTop: 4,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.washiDeep,
    padding: 12,
    borderRadius: 8,
  },
  tipIcon: {
    fontSize: 22,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.sumi,
  },
});
