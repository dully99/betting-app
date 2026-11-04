import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { LoadingScreen, ErrorScreen } from '../../components/LoadingScreen';
import { useApi } from '../../hooks/useApi';
import { predictionService, Prediction } from '../../services/predictionService';
import { mapPrediction } from '../../services/mappers';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/theme';

function ConfidenceArc({ value }: { value: number }) {
  const color = value >= 80 ? Colors.primary : value >= 65 ? Colors.gold : Colors.danger;
  return (
    <View style={styles.confidenceArc}>
      <View style={styles.arcOuter}>
        <View style={styles.arcInner}>
          <Text style={[styles.arcValue, { color }]}>{value}%</Text>
          <Text style={styles.arcLabel}>Confidence</Text>
        </View>
      </View>
      <View style={[styles.arcFill, { borderTopColor: color, borderRightColor: color }]} />
    </View>
  );
}

export default function PredictionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: raw, loading, refreshing, error, refetch, refresh } =
    useApi<Prediction>(() => predictionService.getPredictionDetails(id!));
  const tip = raw ? mapPrediction(raw) : null;

  if (loading) return <LoadingScreen message="Loading prediction..." />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  if (!tip) {
    return (
      <View style={styles.container}>
        <AppHeader title="Prediction" showBack onBack={() => router.back()} />
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textDim} />
          <Text style={styles.notFoundText}>Prediction not found</Text>
        </View>
      </View>
    );
  }

  const statusConfig = {
    pending: { color: Colors.textMuted, bg: Colors.card, label: 'Pending', icon: 'time-outline' as const },
    won: { color: Colors.primary, bg: Colors.cardGreen, label: 'Won ✓', icon: 'checkmark-circle' as const },
    lost: { color: Colors.danger, bg: Colors.cardRed, label: 'Lost ✗', icon: 'close-circle' as const },
  };
  const sc = statusConfig[tip.status];

  return (
    <View style={styles.container}>
      <AppHeader title="Prediction Details" showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
      >
        <View style={styles.leagueRow}>
          <View style={styles.leagueBadge}>
            <Ionicons name="football" size={13} color={Colors.textMuted} />
            <Text style={styles.leagueText}>{tip.league} · {tip.country}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Ionicons name={sc.icon} size={13} color={sc.color} />
            <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </View>

        <View style={styles.matchCard}>
          <View style={styles.teamBlock}>
            <View style={styles.teamCircle}>
              <Ionicons name="shield" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.teamName}>{tip.homeTeam}</Text>
          </View>
          <View style={styles.vsBlock}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.timeChip}>
              <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.timeText}>{tip.date} · {tip.time}</Text>
            </View>
          </View>
          <View style={styles.teamBlock}>
            <View style={[styles.teamCircle, { backgroundColor: `${Colors.danger}20` }]}>
              <Ionicons name="shield" size={28} color={Colors.danger} />
            </View>
            <Text style={styles.teamName}>{tip.awayTeam}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.infoCellLabel}>Prediction</Text>
            <View style={styles.predictionChip}>
              <Ionicons name="flash" size={13} color={Colors.primary} />
              <Text style={styles.predictionChipText}>{tip.prediction}</Text>
            </View>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoCellLabel}>Odds</Text>
            <Text style={styles.oddsValue}>{tip.odds.toFixed(2)}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoCellLabel}>Category</Text>
            <Text style={styles.categoryValue}>{tip.category}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoCellLabel}>Status</Text>
            <Text style={[styles.statusValue, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </View>

        <View style={styles.confidenceCard}>
          <View style={styles.confidenceHeader}>
            <Ionicons name="analytics" size={16} color={Colors.primary} />
            <Text style={styles.confidenceTitle}>Confidence Level</Text>
          </View>
          <View style={styles.confidenceBarContainer}>
            <View style={styles.confidenceTrack}>
              <View
                style={[
                  styles.confidenceFill,
                  {
                    width: `${tip.confidence}%` as any,
                    backgroundColor:
                      tip.confidence >= 80 ? Colors.primary : tip.confidence >= 65 ? Colors.gold : Colors.danger,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.confidencePercent,
                {
                  color:
                    tip.confidence >= 80 ? Colors.primary : tip.confidence >= 65 ? Colors.gold : Colors.danger,
                },
              ]}
            >
              {tip.confidence}%
            </Text>
          </View>
          <View style={styles.confidenceLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendText}>Low (under 65%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.gold }]} />
              <Text style={styles.legendText}>Medium (65–79%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>High (80%+)</Text>
            </View>
          </View>
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Ionicons name="document-text" size={16} color={Colors.gold} />
            <Text style={styles.analysisTitle}>Expert Analysis</Text>
          </View>
          <Text style={styles.analysisText}>{tip.analysis}</Text>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textDim} />
          <Text style={styles.disclaimerText}>
            This prediction is for informational purposes only. Always gamble responsibly.
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  notFoundText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  leagueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leagueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  leagueText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  matchCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  teamCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  vsBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  vsText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.textDim,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  timeText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  infoCell: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flex: 1,
    minWidth: '45%',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCellLabel: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    fontWeight: FontWeight.medium,
  },
  predictionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  predictionChipText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  oddsValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.gold,
  },
  categoryValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  statusValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  confidenceCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confidenceTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  confidenceBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confidenceTrack: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  confidencePercent: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    minWidth: 45,
    textAlign: 'right',
  },
  confidenceLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
  },
  analysisCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  analysisTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  analysisText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textDim,
    lineHeight: 17,
  },
  confidenceArc: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcInner: {
    alignItems: 'center',
  },
  arcValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  arcLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  arcFill: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: 'transparent',
  },
});
