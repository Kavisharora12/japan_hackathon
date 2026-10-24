import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { CHEF_CARD } from '@/lib/diet/chefCard';
import { DIETS, DIET_LABEL, type Diet } from '@/lib/diet/types';

interface Props {
  visible: boolean;
  initialDiet?: Diet;
  onClose: () => void;
}

export function ChefCardModal({ visible, initialDiet = 'jain', onClose }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedDiet, setSelectedDiet] = useState<Diet>(initialDiet);
  const card = CHEF_CARD[selectedDiet];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Close</Text>
            </TouchableOpacity>
            <Text style={styles.eyebrow}>{DIET_LABEL[selectedDiet]} Chef Card</Text>
          </View>

          {/* Diet selector tabs */}
          <View style={styles.tabRow}>
            {DIETS.map((diet) => {
              const active = diet === selectedDiet;
              return (
                <TouchableOpacity
                  key={diet}
                  style={[styles.dietTab, active && styles.activeDietTab]}
                  onPress={() => setSelectedDiet(diet)}
                >
                  <Text style={[styles.dietTabText, active && styles.activeDietTabText]}>
                    {DIET_LABEL[diet]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* The High-Contrast Card to hand to staff */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.staffHeaderJa}>お店の方へ</Text>
                <Text style={styles.staffHeaderEn}>To the restaurant staff</Text>
              </View>

              <Text style={styles.cardJapaneseText} selectable>
                {card.ja}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.cardEnglishText}>
                {card.en}
              </Text>
            </View>

            {/* Instruction footnote */}
            <View style={styles.noteBox}>
              <Text style={styles.noteIcon}>💡</Text>
              <Text style={styles.noteText}>
                Turn up your phone's brightness and hand this screen to the waiter or chef. They can point to safe items on their menu.
              </Text>
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
    backgroundColor: colors.washi,
  },
  container: {
    flex: 1,
    backgroundColor: colors.washi,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sumi,
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dietTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  activeDietTab: {
    backgroundColor: colors.sumi,
  },
  dietTabText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.sumi,
  },
  activeDietTabText: {
    color: colors.washi,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.sumi,
    borderRadius: 8,
    padding: 20,
    shadowColor: colors.sumi,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 16,
  },
  staffHeaderJa: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.shu,
  },
  staffHeaderEn: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.sumiSoft,
    marginTop: 2,
  },
  cardJapaneseText: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.black,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#d8cfc4',
    marginVertical: 18,
  },
  cardEnglishText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.sumiSoft,
    fontWeight: '500',
  },
  noteBox: {
    flexDirection: 'row',
    marginTop: 20,
    padding: 14,
    backgroundColor: colors.washiDeep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.sumiSoft,
    alignItems: 'center',
    gap: 12,
  },
  noteIcon: {
    fontSize: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.sumi,
    fontWeight: '600',
  },
});
