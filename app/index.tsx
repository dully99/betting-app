import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../components/PrimaryButton';
import DisclaimerText from '../components/DisclaimerText';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../constants/theme';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0e1a2f', '#0a0e17', '#0a0e17']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glow} />

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#16a34a', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoMark}
          >
            <Ionicons name="football" size={40} color="#ffffff" />
          </LinearGradient>

          <Text style={styles.appName}>
            Smart<Text style={{ color: '#4ade80' }}>Bet</Text>
          </Text>
          <Text style={styles.appSub}>FOOTBALL PREDICTIONS</Text>
          <Text style={styles.tagline}>
            Data-driven tips, reviewed by experts{'\n'}before they reach you.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'WIN RATE', value: '78%' },
            { label: 'DAILY TIPS', value: '50+' },
            { label: 'MEMBERS', value: '12K' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.featureList}>
          {[
            { icon: 'football-outline' as const, text: 'Free daily football predictions' },
            { icon: 'diamond-outline' as const, text: 'VIP high-odds premium tips' },
            { icon: 'analytics-outline' as const, text: 'Expert match analysis' },
          ].map((feat) => (
            <View key={feat.text} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feat.icon} size={14} color="#4ade80" />
              </View>
              <Text style={styles.featureText}>{feat.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          label="Get Started — It's Free"
          onPress={() => router.replace('/(tabs)')}
          size="lg"
        />
        <View style={styles.disclaimerWrap}>
          <DisclaimerText compact />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e17' },
  glow: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderRadius: 9999,
    backgroundColor: 'rgba(34,197,94,0.10)',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: height * 0.12,
    gap: Spacing.xxxl,
  },
  logoSection: { alignItems: 'center', gap: Spacing.sm },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    letterSpacing: -1.5,
  },
  appSub: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#8d9ab0',
    letterSpacing: 5,
  },
  tagline: {
    fontSize: FontSize.md,
    color: '#8d9ab0',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#101827',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: '#1c2740',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: '#4ade80',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: '#8d9ab0',
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
  },
  featureList: { gap: Spacing.md },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: FontSize.sm,
    color: '#aab6cb',
    fontWeight: FontWeight.medium,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  disclaimerWrap: { alignItems: 'center' },
});
