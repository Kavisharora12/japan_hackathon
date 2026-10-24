import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { FX, PER_DAY_JPY, FLIGHT_INR, COMPARE, type Style, CITIES, type City } from '@/data/costs';
import { type TabKey } from '@/components/JapanSaathiTabBar';

interface Props {
  onNavigateTab: (tab: TabKey) => void;
}

export function PlanScreen({ onNavigateTab }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [days, setDays] = useState(7);
  const [adults, setAdults] = useState(2);
  const [seniors, setSeniors] = useState(0);
  const [kids, setKids] = useState(0);
  const [style, setStyle] = useState<Style>('comfort');
  const [selectedCities, setSelectedCities] = useState<City[]>(['Tokyo', 'Kyoto', 'Osaka']);

  const totalPeople = adults + seniors + kids;
  const rates = PER_DAY_JPY[style];
  const perDayJpy = rates.stay + rates.food + rates.localTransport + rates.activities;
  const tripJpyPerPerson = perDayJpy * days;
  const groundInrPerPerson = Math.round(tripJpyPerPerson * FX.jpyToInr);
  const flightInrPerPerson = FLIGHT_INR[style];
  const totalInrPerPerson = groundInrPerPerson + flightInrPerPerson;
  const totalGroupInr = totalInrPerPerson * totalPeople;

  const toggleCity = (city: City) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter((c) => c !== city));
      }
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trip Studio</Text>
        <Text style={styles.titleJa}>旅行設計</Text>
      </View>
      <Text style={styles.subtitle}>
        Real costs in ₹ Rupees. Compare Japan with Europe, Dubai, and Switzerland. Verified for Indian families.
      </Text>

      {/* Intake: Days & Style */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>1. DURATION & STYLE</Text>

        <View style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>Trip Length:</Text>
          <View style={styles.counterControl}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setDays(Math.max(3, days - 1))}
            >
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{days} Days</Text>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setDays(Math.min(21, days + 1))}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.segmentedRow}>
          {(['budget', 'comfort', 'premium'] as Style[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.segmentBtn, style === s && styles.activeSegmentBtn]}
              onPress={() => setStyle(s)}
            >
              <Text style={[styles.segmentBtnText, style === s && styles.activeSegmentBtnText]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Intake: Travellers */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>2. TRAVELLERS (TOTAL: {totalPeople})</Text>

        <View style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>Adults:</Text>
          <View style={styles.counterControl}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setAdults(Math.max(1, adults - 1))}>
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{adults}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setAdults(adults + 1)}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stepperRow}>
          <View>
            <Text style={styles.stepperLabel}>Seniors (60+):</Text>
            <Text style={styles.stepperSub}>Flags stairs & recommends elevators</Text>
          </View>
          <View style={styles.counterControl}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setSeniors(Math.max(0, seniors - 1))}>
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{seniors}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setSeniors(seniors + 1)}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cities */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>3. CITIES ON ROUTE</Text>
        <View style={styles.cityGrid}>
          {CITIES.map((c) => {
            const on = selectedCities.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={[styles.cityChip, on && styles.activeCityChip]}
                onPress={() => toggleCity(c)}
              >
                <Text style={[styles.cityChipText, on && styles.activeCityChipText]}>
                  {on ? '✓ ' : '+ '}{c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Rupee Price Board */}
      <View style={styles.priceBoard}>
        <Text style={styles.priceBoardEyebrow}>ESTIMATED TRIP BUDGET</Text>
        <Text style={styles.mainPriceText}>
          ₹{totalInrPerPerson.toLocaleString('en-IN')}
          <Text style={styles.pricePerPerson}> / person</Text>
        </Text>
        <Text style={styles.groupTotalText}>
          Total for {totalPeople} travellers: ₹{totalGroupInr.toLocaleString('en-IN')}
        </Text>

        <View style={styles.priceBreakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownItem}>✈️ Round-trip Flights (Return):</Text>
            <Text style={styles.breakdownVal}>₹{flightInrPerPerson.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownItem}>🏨 Hotels ({days} nights):</Text>
            <Text style={styles.breakdownVal}>₹{Math.round(rates.stay * days * FX.jpyToInr).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownItem}>🍱 Veg/Jain Meals & Drinks:</Text>
            <Text style={styles.breakdownVal}>₹{Math.round(rates.food * days * FX.jpyToInr).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownItem}>🚅 Shinkansen & Metro:</Text>
            <Text style={styles.breakdownVal}>₹{Math.round(rates.localTransport * days * FX.jpyToInr).toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Comparison: Why Japan? */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>REALITY CHECK · SAME DAYS & FLIGHTS</Text>
        <Text style={styles.sectionTitle}>Why Japan beats Europe & Dubai</Text>
      </View>

      <View style={styles.compareList}>
        <View style={[styles.compareCard, { borderColor: colors.shu }]}>
          <View style={styles.compareTop}>
            <Text style={styles.compareFlag}>🇯🇵 Japan ({days} days, {style})</Text>
            <Text style={styles.japanPrice}>₹{totalInrPerPerson.toLocaleString('en-IN')}</Text>
          </View>
          <Text style={styles.compareVerdict}>High safety, high cleanliness, yen advantage</Text>
        </View>

        {COMPARE.map((comp) => {
          const foreignGround = comp.perDayInr[style] * days;
          const foreignTotal = foreignGround + comp.flightInr;
          const diff = foreignTotal - totalInrPerPerson;
          const percent = Math.round((diff / totalInrPerPerson) * 100);
          return (
            <View key={comp.name} style={styles.compareCard}>
              <View style={styles.compareTop}>
                <Text style={styles.compareDestName}>{comp.name}</Text>
                <Text style={styles.foreignPrice}>₹{foreignTotal.toLocaleString('en-IN')}</Text>
              </View>
              <Text style={styles.compareSub}>
                {percent > 0 ? `+${percent}% more costly than Japan` : 'Comparable, but Japan offers richer culture & safety'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Button to jump to Today mode */}
      <TouchableOpacity
        style={styles.viewPlanBtn}
        onPress={() => onNavigateTab('today')}
      >
        <Text style={styles.viewPlanBtnText}>今 View Day-by-Day Route in "Today" Mode →</Text>
      </TouchableOpacity>

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
  card: {
    backgroundColor: colors.washiDeep,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumiSoft,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepperLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.sumi,
  },
  stepperSub: {
    fontSize: 11,
    color: colors.sumiSoft,
    marginTop: 2,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.washi,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.sumi,
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.sumi,
    minWidth: 50,
    textAlign: 'center',
  },
  segmentedRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 20,
    padding: 3,
    backgroundColor: colors.washi,
    marginTop: 6,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeSegmentBtn: {
    backgroundColor: colors.sumi,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sumi,
    textTransform: 'capitalize',
  },
  activeSegmentBtnText: {
    color: colors.washi,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washi,
  },
  activeCityChip: {
    backgroundColor: colors.sumi,
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sumi,
  },
  activeCityChipText: {
    color: colors.washi,
  },
  priceBoard: {
    backgroundColor: colors.sakura,
    borderWidth: 2.5,
    borderColor: colors.sumi,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  priceBoardEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumi,
  },
  mainPriceText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.sumi,
    marginTop: 4,
  },
  pricePerPerson: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.sumiSoft,
  },
  groupTotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumi,
    marginTop: 2,
    marginBottom: 12,
  },
  priceBreakdown: {
    borderTopWidth: 1.5,
    borderTopColor: colors.sumi,
    paddingTop: 10,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownItem: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.sumi,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.sumi,
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
  compareList: {
    gap: 10,
    marginBottom: 20,
  },
  compareCard: {
    backgroundColor: colors.washiDeep,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 10,
    padding: 12,
  },
  compareTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compareFlag: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.sumi,
  },
  japanPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.shu,
  },
  compareDestName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.sumi,
  },
  foreignPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.sumi,
  },
  compareVerdict: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ok,
    marginTop: 4,
  },
  compareSub: {
    fontSize: 11,
    color: colors.sumiSoft,
    marginTop: 4,
  },
  viewPlanBtn: {
    backgroundColor: colors.sumi,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 4,
  },
  viewPlanBtnText: {
    color: colors.washi,
    fontSize: 14,
    fontWeight: '800',
  },
});
