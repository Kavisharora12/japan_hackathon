import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ExploreScreen } from '@/screens/ExploreScreen';
import { ScanScreen } from '@/screens/ScanScreen';
import { PlanScreen } from '@/screens/PlanScreen';
import { TodayScreen } from '@/screens/TodayScreen';
import { MannersScreen } from '@/screens/MannersScreen';
import { JapanSaathiTabBar, type TabKey } from '@/components/JapanSaathiTabBar';
import { JapanSaathiHeader } from '@/components/JapanSaathiHeader';
import { ChefCardModal } from '@/screens/ChefCardModal';
import { TaxiCardModal } from '@/screens/TaxiCardModal';
import type { Diet } from '@/lib/diet/types';
import { useSaathiTheme, type ThemeColors } from '@/lib/theme';

// Cast for React 19 JSX compatibility
const RNWebView = WebView as any;

export default function App() {
  const { colors, mode } = useSaathiTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [useNativeFallback, setUseNativeFallback] = useState(false);
  const [targetUrl, setTargetUrl] = useState(process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<any>(null);

  // Native fallback state
  const [activeTab, setActiveTab] = useState<TabKey>('explore');
  const [chefModalVisible, setChefModalVisible] = useState(false);
  const [chefDiet, setChefDiet] = useState<Diet>('jain');
  const [taxiModalVisible, setTaxiModalVisible] = useState(false);
  const [taxiDestId, setTaxiDestId] = useState<string | undefined>(undefined);

  const sendScanResultToWeb = (result: { data?: unknown; error?: string }) => {
    const serialized = JSON.stringify(JSON.stringify(result));
    webViewRef.current?.injectJavaScript(
      `window.dispatchEvent(new CustomEvent('japan-saathi-native-scan', { detail: JSON.parse(${serialized}) })); true;`,
    );
  };

  const scanLabelFromWeb = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        sendScanResultToWeb({ error: 'Camera permission is needed to photograph a food label.' });
        return;
      }

      const picked = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (picked.canceled || !picked.assets[0]) return;

      const asset = picked.assets[0];
      const image = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: asset.width > 0 ? Math.min(asset.width, 1568) : 1568 } }],
        { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      if (!image.base64) throw new Error('Could not prepare the photo. Please try again.');

      const response = await fetch(`${targetUrl.replace(/\/$/, '')}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.base64, mediaType: 'image/jpeg' }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || `Scan failed (${response.status}).`);
      sendScanResultToWeb({ data: result });
    } catch (error) {
      sendScanResultToWeb({
        error: error instanceof Error ? error.message : 'Could not scan this photo. Please try again.',
      });
    }
  };

  // Android hardware back button handles WebView history
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (!useNativeFallback && canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }
  }, [canGoBack, useNativeFallback]);

  if (useNativeFallback) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <JapanSaathiHeader />
          <View style={styles.nativeSwitchBanner}>
            <Text style={styles.nativeSwitchText}>📱 Offline Native Mode</Text>
            <TouchableOpacity onPress={() => { setHasError(false); setUseNativeFallback(false); }}>
              <Text style={styles.nativeSwitchLink}>Switch to Web Server →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {activeTab === 'explore' && (
              <ExploreScreen
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenTaxi={(id) => { setTaxiDestId(id); setTaxiModalVisible(true); }}
              />
            )}
            {activeTab === 'scan' && (
              <ScanScreen
                scanEndpoint={`${targetUrl.replace(/\/$/, '')}/api/scan`}
                onOpenChefCard={(d) => { setChefDiet(d); setChefModalVisible(true); }}
              />
            )}
            {activeTab === 'plan' && (
              <PlanScreen onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'today' && (
              <TodayScreen onOpenTaxi={(id) => { setTaxiDestId(id); setTaxiModalVisible(true); }} />
            )}
            {activeTab === 'manners' && <MannersScreen />}
          </View>
          <JapanSaathiTabBar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t)} />
          <ChefCardModal
            visible={chefModalVisible}
            initialDiet={chefDiet}
            onClose={() => setChefModalVisible(false)}
          />
          <TaxiCardModal
            visible={taxiModalVisible}
            initialDestinationId={taxiDestId}
            onClose={() => setTaxiModalVisible(false)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>📡</Text>
            <Text style={styles.errorTitle}>Cannot Reach Japan Saathi</Text>
            <Text style={styles.errorTarget}>Target: {targetUrl}</Text>
            <Text style={styles.errorInstructions}>
              Make sure on your laptop:{'\n'}
              1. Next.js is running: {'\n'}
                 cd japan-saathi; npm run dev{'\n\n'}
              2. Port 3000 is reversed via USB:{'\n'}
                 adb reverse tcp:3000 tcp:3000
            </Text>

            <View style={styles.errorActionRow}>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => {
                  setHasError(false);
                  setIsLoading(true);
                  webViewRef.current?.reload();
                }}
              >
                <Text style={styles.retryBtnText}>↻ Retry Connection</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fallbackBtn}
                onPress={() => setUseNativeFallback(true)}
              >
                <Text style={styles.fallbackBtnText}>📱 Open Offline UI</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.webViewWrapper}>
            <RNWebView
              ref={webViewRef}
              source={{ uri: targetUrl }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              geolocationEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={['*']}
              startInLoadingState={true}
              onMessage={(event: { nativeEvent: { data: string } }) => {
                try {
                  const message = JSON.parse(event.nativeEvent.data) as { type?: string };
                  if (message.type === 'scan-food-label') void scanLabelFromWeb();
                } catch (error) {
                  console.warn('Invalid WebView message:', error);
                }
              }}
              onNavigationStateChange={(navState: any) => {
                setCanGoBack(navState.canGoBack);
              }}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={(syntheticEvent: any) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                setHasError(true);
                setIsLoading(false);
              }}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.shu} />
                  <Text style={styles.loadingText}>Loading Japan Saathi...</Text>
                  <Text style={styles.loadingSub}>Connecting to {targetUrl}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.washi,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.washi,
  },
  webViewWrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.washi,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.washi,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '800',
    color: colors.sumi,
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 12,
    color: colors.sumiSoft,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.washi,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.sumi,
    marginBottom: 4,
  },
  errorTarget: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.shu,
    marginBottom: 16,
  },
  errorInstructions: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.sumiSoft,
    backgroundColor: colors.washiDeep,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    width: '100%',
    marginBottom: 20,
  },
  errorActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retryBtn: {
    backgroundColor: colors.sumi,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryBtnText: {
    color: colors.washi,
    fontWeight: '800',
    fontSize: 14,
  },
  fallbackBtn: {
    backgroundColor: colors.washiDeep,
    borderWidth: 1.5,
    borderColor: colors.sumi,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  fallbackBtnText: {
    color: colors.sumi,
    fontWeight: '800',
    fontSize: 14,
  },
  nativeSwitchBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.sakura,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.sumi,
  },
  nativeSwitchText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.sumi,
  },
  nativeSwitchLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.shu,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
});
