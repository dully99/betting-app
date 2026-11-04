import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import VipLockedCard from '../../components/VipLockedCard';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { predictionService, Category } from '../../services/predictionService';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

export default function VipTipsScreen() {
  const router = useRouter();
  const { data: categoriesData, loading, refreshing, error, refetch, refresh } =
    useApi<Category[]>(() => predictionService.getCategories());
  const vipCategories = (categoriesData ?? []).filter((c) => c.type === 'VIP');

  if (loading) return <LoadingScreen message="Loading VIP categories..." />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="VIP Tips"
        subtitle="Premium predictions"
        rightElement={
          <View style={styles.vipBadge}>
            <Ionicons name="diamond" size={13} color={Colors.gold} />
            <Text style={styles.vipBadgeText}>PREMIUM</Text>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.primary} />
        }
      >
        <TouchableOpacity
          style={styles.upgradeCard}
          onPress={() => router.push('/(tabs)/subscribe')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#2A1F00', '#1E293B']}
            style={styles.upgradeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.upgradeContent}>
              <View style={styles.upgradeLockCircle}>
                <Ionicons name="lock-closed" size={24} color={Colors.gold} />
              </View>
              <View style={styles.upgradeTextBlock}>
                <Text style={styles.upgradeTitle}>Unlock All VIP Tips</Text>
                <Text style={styles.upgradeSub}>
                  Get access to correct scores, HT/FT, elite picks, and big odds predictions
                </Text>
              </View>
            </View>
            <View style={styles.upgradeFooter}>
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Subscribe Now</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.background} />
              </View>
              <Text style={styles.upgradePrice}>From $5.99/week</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="star" size={16} color={Colors.gold} />
              <Text style={styles.sectionTitle}>VIP Categories</Text>
            </View>
            <Text style={styles.tipCount}>{vipCategories.length} categories</Text>
          </View>

          {vipCategories.map((cat) => (
            <VipLockedCard
              key={cat.id}
              category={{ id: String(cat.id), name: cat.name, icon: 'lock-closed', count: 0, isVip: true }}
              onPress={() => router.push('/(tabs)/subscribe')}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Ionicons name="diamond" size={18} color={Colors.gold} />
              <Text style={styles.benefitsTitle}>VIP Benefits</Text>
            </View>
            {[
              { icon: 'checkmark-circle' as const, text: 'Daily correct score predictions' },
              { icon: 'checkmark-circle' as const, text: 'HT/FT specialist tips' },
              { icon: 'checkmark-circle' as const, text: 'Big odds accumulators (10.0+)' },
              { icon: 'checkmark-circle' as const, text: 'Elite banker bets' },
              { icon: 'checkmark-circle' as const, text: 'Fixed match analysis' },
              { icon: 'checkmark-circle' as const, text: 'Premium member support' },
            ].map((b, i) => (
              <View key={i} style={styles.benefitItem}>
                <Ionicons name={b.icon} size={16} color={Colors.primary} />
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
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
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.gold}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  vipBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.gold,
    fontWeight: FontWeight.bold,
  },
  upgradeCard: {
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  upgradeGradient: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  upgradeLockCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${Colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  upgradeTextBlock: {
    flex: 1,
    gap: 6,
  },
  upgradeTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.gold,
  },
  upgradeSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  upgradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  upgradeBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  upgradePrice: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  tipCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  benefitsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  benefitsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});
