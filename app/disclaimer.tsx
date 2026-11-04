import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

const sections = [
  {
    icon: 'information-circle' as const,
    color: Colors.primary,
    title: 'Purpose',
    text: 'SmartBet Predictions is designed solely for informational and entertainment purposes. The predictions and tips provided within the app are based on statistical analysis and publicly available data.',
  },
  {
    icon: 'warning' as const,
    color: Colors.gold,
    title: 'Not a Betting Platform',
    text: 'This application is NOT a betting platform, bookmaker, or gambling service. We do not accept bets, process wagers, or handle any real-money gambling transactions. No prediction should be construed as financial advice or a guaranteed outcome.',
  },
  {
    icon: 'heart' as const,
    color: Colors.danger,
    title: 'Responsible Use',
    text: 'SmartBet does not encourage gambling. If you choose to place bets based on any information from this app, you do so entirely at your own risk. Never bet more than you can afford to lose. Gambling can be addictive — please gamble responsibly.',
  },
  {
    icon: 'shield-checkmark' as const,
    color: Colors.primary,
    title: 'Accuracy Disclaimer',
    text: 'All predictions are statistical suggestions and carry no guarantee of accuracy. Past performance and success rates do not guarantee future results. Sports outcomes are inherently unpredictable.',
  },
  {
    icon: 'people' as const,
    color: '#38BDF8',
    title: 'Age Restriction',
    text: 'This application is intended for users who are 18 years of age or older. By using this app, you confirm that you meet the minimum age requirement in your jurisdiction.',
  },
  {
    icon: 'call' as const,
    color: Colors.primary,
    title: 'Problem Gambling Help',
    text: 'If you or someone you know has a gambling problem, please seek help. Contact your national gambling support helpline or visit www.gamblersanonymous.org for resources and support.',
  },
];

export default function DisclaimerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader title="Disclaimer" subtitle="Important information" showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
      >
        <View style={styles.topWarning}>
          <View style={styles.warningIconWrap}>
            <Ionicons name="warning" size={32} color={Colors.gold} />
          </View>
          <Text style={styles.warningTitle}>Please Read Carefully</Text>
          <Text style={styles.warningText}>
            "This application is for informational and entertainment purposes only. It is not a betting app
            and does not encourage gambling. Use predictions responsibly."
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((section, i) => (
            <View key={i} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: `${section.color}20` }]}>
                  <Ionicons name={section.icon} size={18} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionText}>{section.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="I Understand"
            onPress={() => router.back()}
            size="lg"
          />
          <Text style={styles.footerNote}>
            Last updated: June 2026 · SmartBet Predictions v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  topWarning: {
    margin: Spacing.lg,
    backgroundColor: `${Colors.gold}12`,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
  },
  warningIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  warningTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.gold,
    textAlign: 'center',
  },
  warningText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    textAlign: 'center',
  },
});
