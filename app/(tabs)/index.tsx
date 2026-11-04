import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import TipCard from '../../components/TipCard';
import CategoryCard from '../../components/CategoryCard';
import DisclaimerText from '../../components/DisclaimerText';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { predictionService, Prediction, Category } from '../../services/predictionService';
import { mapPrediction } from '../../services/mappers';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const { data: freeTipsData, loading: loadingTips, refreshing: refreshingTips, error: errorTips, refetch: refetchTips, refresh: refreshTips } =
    useApi<Prediction[]>(() => predictionService.getFreePredictions());

  const { data: categoriesData, loading: loadingCats, refreshing: refreshingCats, refetch: refetchCats, refresh: refreshCats } =
    useApi<Category[]>(() => predictionService.getCategories());

  const isLoading = loadingTips || loadingCats;
  const isRefreshing = refreshingTips || refreshingCats;

  const mappedTips = (freeTipsData ?? []).map(mapPrediction);
  const todayBestTips = mappedTips.slice(0, 3);
  const wonCount = mappedTips.filter((t) => t.status === 'won').length;
  const totalResolved = mappedTips.filter((t) => t.status !== 'pending').length;
  const successRate = totalResolved > 0 ? Math.round((wonCount / totalResolved) * 100) : 78;

  const handleRefresh = () => { refreshTips(); refreshCats(); };

  return (
    <View style={styles.container}>
      <AppHeader
        title="SmartBet"
        subtitle="Predictions"
        rightElement={
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/disclaimer')}
          >
            <Ionicons name="information-circle-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        }
      />

      {isLoading && <LoadingScreen message="Loading predictions..." />}
      {!isLoading && errorTips && <ErrorScreen message={errorTips} onRetry={handleRefresh} />}
      {!isLoading && !errorTips && (
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <LinearGradient
          colors={[`${Colors.primary}25`, `${Colors.primary}05`, 'transparent']}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTextBlock}>
              <View style={styles.heroBadge}>
                <Ionicons name="flash" size={12} color={Colors.primary} />
                <Text style={styles.heroBadgeText}>Live Tips Available</Text>
              </View>
              <Text style={styles.heroTitle}>Today's Best{'\n'}Predictions</Text>
              <Text style={styles.heroSub}>
                {mappedTips.filter((t) => t.status === 'pending').length} active tips across all sports
              </Text>
            </View>
            <View style={styles.heroRateCard}>
              <Text style={styles.heroRateValue}>{successRate}%</Text>
              <Text style={styles.heroRateLabel}>Win Rate</Text>
              <View style={styles.heroRateTrack}>
                <View style={[styles.heroRateFill, { width: `${successRate}%` as any }]} />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="star" size={16} color={Colors.gold} />
              <Text style={styles.sectionTitle}>Best Tips Today</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/free-tips')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {todayBestTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onPress={() => router.push(`/prediction/${tip.id}`)}
              compact
            />
          ))}
          {todayBestTips.length === 0 && (
            <Text style={styles.emptyText}>No tips available right now</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="lock-closed" size={16} color={Colors.gold} />
              <Text style={styles.sectionTitle}>VIP Preview</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/vip-tips')}>
              <Text style={styles.seeAll}>Unlock</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.vipPreview}
            onPress={() => router.push('/(tabs)/subscribe')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[`${Colors.gold}20`, `${Colors.gold}08`]}
              style={styles.vipGradient}
            >
              <View style={styles.vipPreviewContent}>
                <View style={styles.vipIconWrap}>
                  <Ionicons name="diamond" size={28} color={Colors.gold} />
                </View>
                <View style={styles.vipTextBlock}>
                  <Text style={styles.vipPreviewTitle}>Premium VIP Tips</Text>
                  <Text style={styles.vipPreviewSub}>
                    Access correct scores, HT/FT, big odds & elite picks
                  </Text>
                  <View style={styles.vipUnlockRow}>
                    <Ionicons name="lock-closed" size={12} color={Colors.gold} />
                    <Text style={styles.vipUnlockText}>Subscribe to unlock all VIP tips</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.statsGrid}>
            {[
              { label: 'Tips Today', value: `${mappedTips.length}`, icon: 'football' as const, color: Colors.primary },
              { label: 'Win Rate', value: `${successRate}%`, icon: 'trending-up' as const, color: Colors.gold },
              { label: 'Free Tips', value: `${mappedTips.filter((t) => !t.isVip).length}`, icon: 'gift' as const, color: '#38BDF8' },
              { label: 'VIP Tips', value: '10+', icon: 'star' as const, color: Colors.gold },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
          </View>
          <View style={styles.categoriesGrid}>
            {(categoriesData ?? []).filter((c) => c.type === 'FREE').map((cat) => (
              <CategoryCard
                key={cat.id}
                category={{ id: String(cat.id), name: cat.name, icon: 'football', count: 0 }}
                onPress={() => router.push('/(tabs)/free-tips')}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <DisclaimerText compact />
        </View>
      </ScrollView>
      )}
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
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.primary}25`,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    flex: 1,
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    lineHeight: 28,
  },
  heroSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  heroRateCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 80,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroRateValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
  },
  heroRateLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  heroRateTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  heroRateFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
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
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  vipPreview: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${Colors.gold}35`,
  },
  vipGradient: {
    padding: Spacing.lg,
  },
  vipPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  vipIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipTextBlock: {
    flex: 1,
    gap: 5,
  },
  vipPreviewTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
  },
  vipPreviewSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  vipUnlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  vipUnlockText: {
    fontSize: FontSize.xs,
    color: Colors.gold,
    fontWeight: FontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
