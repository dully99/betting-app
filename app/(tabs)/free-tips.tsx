import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import TipCard from '../../components/TipCard';
import CategoryCard from '../../components/CategoryCard';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { predictionService, Prediction, Category } from '../../services/predictionService';
import { mapPrediction } from '../../services/mappers';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

export default function FreeTipsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: rawTips, loading, refreshing, error, refetch, refresh } =
    useApi<Prediction[]>(() => predictionService.getFreePredictions());
  const { data: categoriesData } =
    useApi<Category[]>(() => predictionService.getCategories());

  const freeTips = (rawTips ?? []).map(mapPrediction);
  const freeCategories = (categoriesData ?? []).filter((c) => c.type === 'FREE');
  const allCategoryNames = ['All', ...freeCategories.map((c) => c.name)];
  const filteredTips =
    activeCategory === 'All'
      ? freeTips
      : freeTips.filter((t) => t.category === activeCategory);

  if (loading) return <LoadingScreen message="Loading free tips..." />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="Free Tips"
        subtitle={`${filteredTips.length} tips available today`}
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
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {allCategoryNames.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  activeCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    activeCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categoriesGrid}>
          {freeCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={{ id: String(cat.id), name: cat.name, icon: 'football', count: 0 }}
              onPress={() => setActiveCategory(cat.name)}
            />
          ))}
        </View>

        <View style={styles.tipsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'All' ? 'All Tips' : activeCategory}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredTips.length}</Text>
            </View>
          </View>

          {filteredTips.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="football-outline" size={48} color={Colors.textDim} />
              <Text style={styles.emptyTitle}>No tips in this category</Text>
              <Text style={styles.emptySub}>Check back later for new predictions</Text>
            </View>
          ) : (
            filteredTips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onPress={() => router.push(`/prediction/${tip.id}`)}
              />
            ))
          )}
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
  categoriesSection: {
    marginTop: Spacing.md,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  categoryChipTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  tipsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  emptySub: {
    fontSize: FontSize.sm,
    color: Colors.textDim,
  },
  white: {
    color: Colors.white,
  },
});
