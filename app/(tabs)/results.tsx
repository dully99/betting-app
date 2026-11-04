import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import ResultCard from '../../components/ResultCard';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { predictionService, Prediction } from '../../services/predictionService';
import { Result } from '../../types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

type Filter = 'All' | 'Won' | 'Lost';

function mapToResult(dto: Prediction): Result {
  return {
    id: String(dto.id),
    date: new Date(dto.matchTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    homeTeam: dto.homeTeam,
    awayTeam: dto.awayTeam,
    league: dto.league,
    prediction: dto.prediction,
    odds: dto.odds,
    actualResult: '—',
    status: dto.status.toLowerCase() as Result['status'],
  };
}

export default function ResultsScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const { data: rawResults, loading, refreshing, error, refetch, refresh } =
    useApi<Prediction[]>(() => predictionService.getResults());

  const pastResults = (rawResults ?? []).map(mapToResult);
  const filteredResults = filter === 'All'
    ? pastResults
    : pastResults.filter((r: Result) => r.status === filter.toLowerCase());

  const wonCount = pastResults.filter((r: Result) => r.status === 'won').length;
  const lostCount = pastResults.filter((r: Result) => r.status === 'lost').length;
  const winRate = pastResults.length > 0 ? Math.round((wonCount / pastResults.length) * 100) : 0;

  if (loading) return <LoadingScreen message="Loading results..." />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="Results"
        subtitle="Previous predictions record"
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
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Ionicons name="trending-up" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{winRate}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{wonCount}</Text>
            <Text style={styles.statLabel}>Won</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="close-circle" size={20} color={Colors.danger} />
            <Text style={styles.statValue}>{lostCount}</Text>
            <Text style={styles.statLabel}>Lost</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="list" size={20} color={Colors.textMuted} />
            <Text style={styles.statValue}>{pastResults.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Won', 'Lost'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
                f === 'Won' && filter === f && styles.filterChipWon,
                f === 'Lost' && filter === f && styles.filterChipLost,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resultsSection}>
          {filteredResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={48} color={Colors.textDim} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySub}>Try a different filter</Text>
            </View>
          ) : (
            filteredResults.map((result: Result) => (
              <ResultCard key={result.id} result={result} />
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCardGreen: {
    borderColor: `${Colors.primary}40`,
    backgroundColor: Colors.cardGreen,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipWon: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipLost: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  resultsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
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
