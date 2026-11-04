import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import SubscriptionCard from '../../components/SubscriptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import DisclaimerText from '../../components/DisclaimerText';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { subscriptionsService, SubscriptionPlanDTO } from '../../services/subscriptions';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

const vipBenefits = [
  { icon: 'checkmark-circle', text: 'Correct Score VIP predictions' },
  { icon: 'checkmark-circle', text: 'HT/FT premium selections' },
  { icon: 'checkmark-circle', text: 'Big Odds daily picks' },
  { icon: 'checkmark-circle', text: 'Elite banker tips every day' },
  { icon: 'checkmark-circle', text: 'Priority customer support' },
  { icon: 'checkmark-circle', text: 'Analysis & match insights' },
];

export default function SubscribeScreen() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const { data: plansData, loading, refreshing, error, refetch, refresh } = useApi<SubscriptionPlanDTO[]>(() => subscriptionsService.getAllPlans());

  const subscriptionPlans = (plansData ?? []).map((p) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    currency: '$',
    period: p.durationDays === 7 ? 'week' : p.durationDays === 30 ? 'month' : 'year',
    description: p.description,
    isPopular: p.isPopular ?? false,
    badge: p.badge ?? undefined,
    planId: p.id,
  }));

  const activePlanId = selectedPlanId || (subscriptionPlans.find((p) => p.isPopular)?.id ?? subscriptionPlans[0]?.id ?? '');
  const selected = subscriptionPlans.find((p) => p.id === activePlanId)!

  if (loading) return <LoadingScreen message="Loading plans..." />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;;

  return (
    <View style={styles.container}>
      <AppHeader
        title="Subscribe"
        subtitle="Unlock premium VIP tips"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
      >
        <LinearGradient
          colors={[`${Colors.gold}20`, `${Colors.gold}05`, 'transparent']}
          style={styles.heroBanner}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="diamond" size={32} color={Colors.gold} />
          </View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSub}>
            Join thousands of winners with SmartBet VIP predictions
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VIP Benefits</Text>
          <View style={styles.benefitsList}>
            {vipBenefits.map((benefit, i) => (
              <View key={i} style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="checkmark" size={13} color={Colors.background} />
                </View>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {subscriptionPlans.map((plan: typeof subscriptionPlans[number]) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              selected={activePlanId === plan.id}
              onPress={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <PrimaryButton
            label={selected ? `Subscribe ${selected.name} — $${selected.price}/${selected.period}` : 'Choose a plan'}
            onPress={() => selected && router.push({ pathname: '/payment', params: { planId: String(selected.planId), planName: selected.name, price: String(selected.price) } })}
            variant="gold"
            size="lg"
          />
          <Text style={styles.cancelText}>Cancel anytime · No hidden fees</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.trustRow}>
            {[
              { icon: 'shield-checkmark' as const, label: 'Secure Payment' },
              { icon: 'refresh' as const, label: 'Easy Cancel' },
              { icon: 'lock-closed' as const, label: 'Instant Access' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Ionicons name={t.icon} size={18} color={Colors.primary} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <DisclaimerText />
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
  heroBanner: {
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.gold,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  benefitsList: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  benefitIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  cancelText: {
    fontSize: FontSize.sm,
    color: Colors.textDim,
    textAlign: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  trustLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});
