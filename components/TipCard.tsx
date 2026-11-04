import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Prediction } from '../types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

interface TipCardProps {
  tip: Prediction;
  onPress: () => void;
  compact?: boolean;
}

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? Colors.primary : value >= 65 ? Colors.gold : Colors.danger;
  return (
    <View style={styles.confidenceContainer}>
      <View style={styles.confidenceTrack}>
        <View style={[styles.confidenceFill, { width: `${value}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.confidenceText, { color }]}>{value}%</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: Prediction['status'] }) {
  const config = {
    pending: { bg: Colors.card, text: Colors.textMuted, label: 'Pending', icon: 'time-outline' as const },
    won: { bg: Colors.cardGreen, text: Colors.primary, label: 'Won', icon: 'checkmark-circle' as const },
    lost: { bg: Colors.cardRed, text: Colors.danger, label: 'Lost', icon: 'close-circle' as const },
  };
  const c = config[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon} size={12} color={c.text} />
      <Text style={[styles.badgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

export default function TipCard({ tip, onPress, compact = false }: TipCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.leagueRow}>
          <Ionicons name="football" size={13} color={Colors.textMuted} />
          <Text style={styles.league}>{tip.league} · {tip.country}</Text>
        </View>
        <StatusBadge status={tip.status} />
      </View>

      <View style={styles.matchRow}>
        <View style={styles.crest}>
          <Text style={styles.crestText}>{initials(tip.homeTeam)}</Text>
        </View>
        <Text style={styles.team} numberOfLines={1}>{tip.homeTeam}</Text>
        <Text style={styles.vs}>vs</Text>
        <Text style={[styles.team, styles.teamRight]} numberOfLines={1}>{tip.awayTeam}</Text>
        <View style={styles.crest}>
          <Text style={styles.crestText}>{initials(tip.awayTeam)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.infoText}>{tip.date} · {tip.time}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="analytics-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.infoText}>Odds: <Text style={styles.oddsText}>{tip.odds.toFixed(2)}</Text></Text>
        </View>
      </View>

      <View style={styles.predictionRow}>
        <View style={styles.predictionChip}>
          <Ionicons name="flash" size={13} color={Colors.primary} />
          <Text style={styles.predictionText}>{tip.prediction}</Text>
        </View>
      </View>

      {!compact && (
        <ConfidenceBar value={tip.confidence} />
      )}

      <View style={styles.footer}>
        <Text style={styles.category}>{tip.category}</Text>
        <View style={styles.detailsBtn}>
          <Text style={styles.detailsBtnText}>View Analysis</Text>
          <Ionicons name="chevron-forward" size={13} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  league: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  crest: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.cardAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: {
    fontSize: 11,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMuted,
  },
  team: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'left',
  },
  teamRight: {
    textAlign: 'right',
  },
  vs: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textDim,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  oddsText: {
    color: Colors.gold,
    fontWeight: FontWeight.bold,
  },
  predictionRow: {
    marginBottom: Spacing.md,
  },
  predictionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.primary}18`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${Colors.primary}35`,
  },
  predictionText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  confidenceTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  confidenceText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    minWidth: 32,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailsBtnText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
