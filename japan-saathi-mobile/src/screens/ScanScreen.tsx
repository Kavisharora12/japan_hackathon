import React, { useState, useMemo } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';
import { analyzeText, type ScanResult } from '@/lib/diet/analyze';
import { DIETS, DIET_LABEL, type Diet } from '@/lib/diet/types';
import { Stamp } from '@/components/Stamp';

interface Props {
  scanEndpoint: string;
  onOpenChefCard: (diet: Diet) => void;
}

type ScanResponse = ScanResult & { error?: string };

const PRESET_SAMPLES = [
  {
    title: 'Cup Noodle (Meat & Fish Dashi)',
    text: '油揚げめん（小麦粉、植物油脂、食塩、しょうゆ）、スープ（豚脂、粉末しょうゆ、かつおエキス、チキンエキス、ねぎ、香辛料）、かやく（えび、卵、ねぎ）、調味料（アミノ酸等）',
  },
  {
    title: 'Seaweed Rice Cracker (Senbei)',
    text: 'うるち米（国産）、しょうゆ、砂糖、海苔、みりん、でん粉、食塩、かつお節エキス不使用',
  },
  {
    title: 'Matcha Sweet Mochi (Vegan)',
    text: 'もち粉、砂糖、抹茶、小豆、水飴、トレハロース、食塩',
  },
];

export function ScanScreen({ scanEndpoint, onOpenChefCard }: Props) {
  const { colors } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedDiets, setSelectedDiets] = useState<Diet[]>(['jain', 'veg']);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const toggleDiet = (diet: Diet) => {
    if (selectedDiets.includes(diet)) {
      if (selectedDiets.length > 1) {
        setSelectedDiets(selectedDiets.filter((d) => d !== diet));
      }
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const handleAnalyze = (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    const res = analyzeText(textToAnalyze, selectedDiets);
    setResult(res);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    const res = analyzeText(sampleText, selectedDiets);
    setResult(res);
  };

  const scanImage = async (source: 'camera' | 'library') => {
    setScanError(null);
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setScanError('Camera access is required. Allow it in your device settings, or choose a saved photo.');
          return;
        }
      }

      const picked = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (picked.canceled || !picked.assets[0]) return;

      setIsScanning(true);
      setPhotoUri(picked.assets[0].uri);
      setResult(null);

      const image = await ImageManipulator.manipulateAsync(
        picked.assets[0].uri,
        [{ resize: { width: Math.min(picked.assets[0].width, 1568) } }],
        { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      if (!image.base64) throw new Error('Could not prepare the photo. Please try another picture.');

      const response = await fetch(scanEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.base64, mediaType: 'image/jpeg' }),
      });
      const payload = await response.json() as ScanResponse;
      if (!response.ok) throw new Error(payload.error || `Scan failed (${response.status}).`);
      setResult(payload);
    } catch (error) {
      setScanError(
        error instanceof TypeError
          ? `Cannot reach the scan server at ${scanEndpoint}. Start the web app and check the phone connection.`
          : error instanceof Error
            ? error.message
            : 'Could not scan this photo. Please try again.',
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Label check</Text>
        <Text style={styles.titleJa}>原材料チェック</Text>
      </View>
      <Text style={styles.subtitle}>
        Photograph a label or paste its ingredients. We check for hidden fish stock (かつお/出汁), gelatin, onion, garlic, or mirin alcohol.
      </Text>

      {/* Dietary selection */}
      <Text style={styles.sectionLabel}>YOUR DIET RULES:</Text>
      <View style={styles.dietRow}>
        {DIETS.map((d) => {
          const isSelected = selectedDiets.includes(d);
          return (
            <TouchableOpacity
              key={d}
              style={[styles.dietChip, isSelected && styles.activeDietChip]}
              onPress={() => toggleDiet(d)}
            >
              <Text style={[styles.dietChipText, isSelected && styles.activeDietChipText]}>
                {isSelected ? '✓ ' : '+ '}{DIET_LABEL[d]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chef card shortcut */}
      <TouchableOpacity
        style={styles.chefCardButton}
        onPress={() => onOpenChefCard(selectedDiets[0] || 'veg')}
      >
        <Text style={styles.chefCardIcon}>👨‍🍳</Text>
        <View style={styles.chefCardTexts}>
          <Text style={styles.chefCardTitle}>Show Chef Card to Staff</Text>
          <Text style={styles.chefCardDesc}>Polite Japanese dietary card to hand to waiters</Text>
        </View>
        <Text style={styles.chefCardArrow}>→</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>SCAN A FOOD LABEL:</Text>
      <View style={styles.photoActions}>
        <TouchableOpacity
          style={[styles.photoButton, isScanning && styles.disabledButton]}
          disabled={isScanning}
          onPress={() => scanImage('camera')}
        >
          <Text style={styles.photoButtonText}>Take label photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.libraryButton, isScanning && styles.disabledButton]}
          disabled={isScanning}
          onPress={() => scanImage('library')}
        >
          <Text style={styles.libraryButtonText}>Choose photo</Text>
        </TouchableOpacity>
      </View>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />}
      {isScanning && (
        <View style={styles.scanStatus}>
          <ActivityIndicator color={colors.shu} />
          <Text style={styles.scanStatusText}>Reading the label…</Text>
        </View>
      )}
      {scanError && <Text style={styles.scanError}>{scanError}</Text>}

      {/* Input Box */}
      <Text style={styles.sectionLabel}>PASTE JAPANESE INGREDIENTS (原材料名):</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Paste ingredients from packaging (e.g. かつおエキス, 豚肉, ゼラチン...)"
          placeholderTextColor="#8a8076"
          value={inputText}
          onChangeText={setInputText}
        />
        <View style={styles.inputActions}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => handleAnalyze(inputText)}
          >
            <Text style={styles.checkButtonText}>Check Ingredients (Offline)</Text>
          </TouchableOpacity>
          {inputText ? (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setInputText(''); setResult(null); }}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Preset sample labels */}
      <Text style={styles.sectionLabel}>TEST PACKAGES FROM JAPAN:</Text>
      <View style={styles.sampleRow}>
        {PRESET_SAMPLES.map((sample, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.sampleCard}
            onPress={() => handleSelectSample(sample.text)}
          >
            <Text style={styles.sampleTitle}>{sample.title}</Text>
            <Text style={styles.sampleSnippet} numberOfLines={2}>{sample.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stamp Verdict Results */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultHeading}>
            {result.reading.product_name || (result.reading.transcription ? 'LABEL CHECK RESULTS' : 'PASSPORT STAMP VERDICTS')}
          </Text>
          {result.reading.transcription.length > 0 && (
            <Text style={styles.transcription}>{result.reading.transcription}</Text>
          )}
          {result.results.filter((res) => selectedDiets.includes(res.diet)).map((res) => (
            <View key={res.diet} style={styles.verdictCard}>
              <View style={styles.verdictInner}>
                <View style={styles.verdictDetails}>
                  <Text style={styles.verdictDietName}>{DIET_LABEL[res.diet]}</Text>

                  {res.reasons.length > 0 ? (
                    <View style={styles.reasonsList}>
                      {res.reasons.map((r, i) => (
                        <Text key={i} style={styles.reasonItem}>
                          • {r}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.safeText}>No restricted ingredients detected!</Text>
                  )}

                  {res.culprits.length > 0 && (
                    <View style={styles.culpritsBox}>
                      <Text style={styles.culpritLabel}>Flagged items on label:</Text>
                      {res.culprits.map((c, i) => (
                        <View key={i} style={styles.culpritRow}>
                          <Text style={styles.culpritFound}>{c.found}</Text>
                          <Text style={styles.culpritEn}>({c.en})</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* The Rubber Stamp */}
                <View style={styles.stampWrapper}>
                  <Stamp verdict={res.verdict} label={DIET_LABEL[res.diet]} size={105} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

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
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.sumi,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  photoButtonText: {
    color: colors.washi,
    fontSize: 13,
    fontWeight: '800',
  },
  libraryButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  libraryButtonText: {
    color: colors.sumi,
    fontSize: 13,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.55,
  },
  photoPreview: {
    width: 112,
    height: 112,
    marginTop: 8,
    borderRadius: 8,
  },
  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  scanStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumiSoft,
  },
  scanError: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: colors.bad,
    fontWeight: '700',
  },
  transcription: {
    marginTop: 8,
    color: colors.sumiSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumiSoft,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  dietRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  dietChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    backgroundColor: colors.washiDeep,
  },
  activeDietChip: {
    backgroundColor: colors.sumi,
  },
  dietChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sumi,
  },
  activeDietChipText: {
    color: colors.washi,
  },
  chefCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sakura,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    marginBottom: 12,
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 3,
  },
  chefCardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  chefCardTexts: {
    flex: 1,
  },
  chefCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.sumi,
  },
  chefCardDesc: {
    fontSize: 12,
    color: colors.sumiSoft,
  },
  chefCardArrow: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.sumi,
  },
  inputCard: {
    backgroundColor: colors.washiDeep,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 80,
    fontSize: 14,
    lineHeight: 20,
    color: colors.sumi,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dfd4c4',
  },
  checkButton: {
    backgroundColor: colors.sumi,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.sumi,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  checkButtonText: {
    color: colors.washi,
    fontWeight: '800',
    fontSize: 13,
  },
  clearBtn: {
    paddingHorizontal: 10,
  },
  clearBtnText: {
    fontSize: 13,
    color: colors.sumiSoft,
    fontWeight: '600',
  },
  sampleRow: {
    gap: 8,
    marginBottom: 16,
  },
  sampleCard: {
    backgroundColor: colors.washi,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    borderRadius: 10,
    padding: 10,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.sumi,
  },
  sampleSnippet: {
    fontSize: 11,
    color: colors.sumiSoft,
    marginTop: 2,
  },
  resultContainer: {
    marginTop: 16,
    gap: 14,
  },
  resultHeading: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.sumi,
  },
  verdictCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sumi,
    borderRadius: 14,
    padding: 16,
    shadowColor: colors.sumi,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  verdictInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  verdictDetails: {
    flex: 1,
  },
  verdictDietName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.sumi,
    marginBottom: 4,
  },
  reasonsList: {
    gap: 2,
  },
  reasonItem: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.bad,
    lineHeight: 16,
  },
  safeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ok,
  },
  culpritsBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0ece3',
  },
  culpritLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.sumiSoft,
    textTransform: 'uppercase',
  },
  culpritRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  culpritFound: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.bad,
  },
  culpritEn: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.sumiSoft,
  },
  stampWrapper: {
    paddingLeft: 6,
  },
});
