import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Result } from '../types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

interface ResultCardProps {
  result: Result;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isWon = result.status === 'won';
  const statusColor = isWon ? Colors.primary : Colors.danger;
  const statusBg = isWon ? Colors.cardGreen : Colors.cardRed;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.date}>{result.date}</Text>
          <Text style={styles.league}>{result.league}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Ionicons
            name={isWon ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={statusColor}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {isWon ? 'WON' : 'LOST'}
          </Text>
        </View>
      </View>

      <View style={styles.matchRow}>
        <Text style={styles.team} numberOfLines={1}>{result.homeTeam}</Text>
        <View style={styles.resultChip}>
          <Text style={styles.resultText}>{result.actualResult}</Text>
        </View>
        <Text style={[styles.team, { textAlign: 'right' }]} numberOfLines={1}>{result.awayTeam}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Prediction</Text>
          <Text style={styles.footerValue}>{result.prediction}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Odds</Text>
          <Text style={[styles.footerValue, { color: Colors.gold }]}>{result.odds.toFixed(2)}</Text>
        </View>
        {result.profit !== undefined && (
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>P/L</Text>
            <Text style={[styles.footerValue, { color: statusColor }]}>
              {result.profit > 0 ? `+${result.profit}` : result.profit}
            </Text>
          </View>
        )}
      </View>
    </View>
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
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  league: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    marginLeft: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  team: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  resultChip: {
    backgroundColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  resultText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerItem: {
    alignItems: 'center',
    gap: 3,
  },
  footerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
  },
  footerValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
});
