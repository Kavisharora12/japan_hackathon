import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { DESTINATIONS, destinationById, type Destination } from '@/data/destinations';

interface Props {
  onOpenTaxi: (destinationId: string) => void;
}

const ITINERARY_DAYS = [
  {
    day: 1,
    city: 'Tokyo',
    theme: 'Historic Asakusa & Nakamuraya',
    stops: ['sensoji', 'nakamuraya', 'shibuya'],
    weather: { temp: 20, condition: 'Partly Cloudy', rainChance: 10, isRainy: false },
  },
  {
    day: 2,
    city: 'Fuji',
    theme: 'Lake Views & Alpine Breeze',
    stops: ['kawaguchiko'],
    weather: { temp: 16, condition: 'Clear Sky', rainChance: 5, isRainy: false },
  },
  {
    day: 3,
    city: 'Kyoto',
    theme: 'Golden Pavilion & Bamboo Grove',
    stops: ['kinkakuji', 'arashiyama'],
    weather: { temp: 19, condition: 'Rain expected at 2 PM', rainChance: 70, isRainy: true },
  },
  {
    day: 4,
    city: 'Kyoto',
    theme: 'Torii Gates & Kiyomizu Stage',
    stops: ['fushimi-inari', 'kiyomizu'],
    weather: { temp: 21, condition: 'Sunny', rainChance: 15, isRainy: false },
  },
  {
    day: 5,
    city: 'Osaka / Nara',
    theme: 'Sacred Deer & Neon Street Food',
    stops: ['todaiji', 'dotonbori'],
    weather: { temp: 22, condition: 'Mild Breeze', rainChance: 20, isRainy: false },
  },
];

export function TodayScreen({ onOpenTaxi }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const currentDay = ITINERARY_DAYS[selectedDayIdx];

  const currentStops = currentDay.stops
    .map(destinationById)
    .filter((d): d is Destination => Boolean(d));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today on the Ground</Text>
        <Text style={styles.titleJa}>本日の旅</Text>
      </View>
      <Text style={styles.subtitle}>
        Real-time companion. Step-by-step route with transit times, live weather, rain plans, and taxi cards.
      </Text>

      {/* Day Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorRow}>
        {ITINERARY_DAYS.map((d, idx) => {
          const active = idx === selectedDayIdx;
          return (
            <TouchableOpacity
              key={d.day}
              style={[styles.dayTab, active && styles.activeDayTab]}
              onPress={() => setSelectedDayIdx(idx)}
            >
              <Text style={[styles.dayTabNum, active && styles.activeDayTabNum]}>Day {d.day}</Text>
              <Text style={[styles.dayTabCity, active && styles.activeDayTabCity]}>{d.city}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Weather & Rain Alert Widget */}
      <View style={[styles.weatherCard, currentDay.weather.isRainy && styles.rainWeatherCard]}>
        <View style={styles.weatherTop}>
          <View>
            <Text style={styles.weatherCity}>{currentDay.city} Live Weather</Text>
            <Text style={styles.weatherTemp}>{currentDay.weather.temp}°C</Text>
          </View>
          <View style={styles.weatherConditionBox}>
            <Text style={styles.weatherIcon}>
              {currentDay.weather.isRainy ? '🌧️' : '⛅'}
            </Text>
            <Text style={styles.weatherConditionText}>{currentDay.weather.condition}</Text>
          </View>
        </View>

        {currentDay.weather.isRainy ? (
          <View style={styles.rainPlanBox}>
            <Text style={styles.rainPlanTitle}>☔ Rain Plan Active</Text>
            <Text style={styles.rainPlanText}>
              Rain will make temple stone steps slippery. Swap outdoor walks with Nishiki Covered Market or Kyoto Railway Museum!
            </Text>
          </View>
        ) : (
          <View style={styles.goodWeatherBox}>
            <Text style={styles.goodWeatherText}>
              ☀️ Excellent weather for walking and outdoor photography!
            </Text>
          </View>
        )}
      </View>

      {/* Day Theme */}
      <View style={styles.themeBanner}>
        <Text style={styles.themeDayLabel}>DAY {currentDay.day} FOCUS:</Text>
        <Text style={styles.themeTitle}>{currentDay.theme}</Text>
      </View>

      {/* Route Stops */}
      <View style={styles.stopsList}>
        {currentStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <View style={styles.stopIndexBadge}>
                <Text style={styles.stopIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.stopTitleBox}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopNameJa}>{stop.nameJa}</Text>
              </View>
            </View>

            <Text style={styles.stopBlurb}>{stop.blurb}</Text>

            {stop.indiaLink && (
              <View style={styles.indiaLinkBadge}>
                <Text style={styles.indiaLinkText}>🇮🇳 {stop.indiaLink}</Text>
              </View>
            )}

            <View style={styles.stopFooter}>
              <Text style={styles.stopMeta}>
                ⏳ {stop.hours}h · {stop.walking} walk · {stop.setting}
              </Text>
              <TouchableOpacity
                style={styles.taxiCardBtn}
                onPress={() => onOpenTaxi(stop.id)}
              >
                <Text style={styles.taxiCardBtnText}>🚖 Taxi Card</Text>
              </TouchableOpacity>
            </View>

            {index < currentStops.length - 1 && (
              <View style={styles.transitLeg}>
                <Text style={styles.transitLegText}>↓ ~15-20 mins via local metro / taxi</Text>
              </View>
            )}
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
  daySelectorRow: {
    gap: 8,
    paddingBottom: 14,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washiDeep,
    alignItems: 'center',
  },
  activeDayTab: {
    backgroundColor: colors.sumi,
  },
  dayTabNum: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.sumi,
  },
  activeDayTabNum: {
    color: colors.washi,
  },
  dayTabCity: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.sumiSoft,
    marginTop: 2,
  },
  activeDayTabCity: {
    color: colors.washi,
  },
  weatherCard: {
    backgroundColor: colors.sora,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 4,
  },
  rainWeatherCard: {
    backgroundColor: colors.fuji,
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherCity: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.sumi,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.sumi,
  },
  weatherConditionBox: {
    alignItems: 'flex-end',
  },
  weatherIcon: {
    fontSize: 28,
  },
  weatherConditionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumi,
    marginTop: 2,
  },
  rainPlanBox: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.shu,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  rainPlanTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.shu,
    marginBottom: 2,
  },
  rainPlanText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.sumi,
  },
  goodWeatherBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#b4c9d5',
  },
  goodWeatherText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sumi,
  },
  themeBanner: {
    backgroundColor: colors.washiDeep,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    marginBottom: 14,
  },
  themeDayLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumiSoft,
  },
  themeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.sumi,
    marginTop: 2,
  },
  stopsList: {
    gap: 14,
  },
  stopCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 12,
    padding: 14,
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 3,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stopIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sumi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIndexText: {
    color: colors.washi,
    fontSize: 13,
    fontWeight: '800',
  },
  stopTitleBox: {
    flex: 1,
  },
  stopName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.sumi,
  },
  stopNameJa: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumiSoft,
  },
  stopBlurb: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.sumiSoft,
    marginBottom: 8,
  },
  indiaLinkBadge: {
    backgroundColor: colors.washi,
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.shu,
    marginBottom: 8,
  },
  indiaLinkText: {
    fontSize: 11,
    color: colors.sumi,
    fontWeight: '600',
  },
  stopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eae1d2',
  },
  stopMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.sumiSoft,
  },
  taxiCardBtn: {
    backgroundColor: colors.sumi,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  taxiCardBtnText: {
    color: colors.washi,
    fontWeight: '700',
    fontSize: 12,
  },
  transitLeg: {
    alignItems: 'center',
    marginTop: 10,
  },
  transitLegText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.shu,
  },
});
