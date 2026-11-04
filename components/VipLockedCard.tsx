import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

interface VipLockedCardProps {
  category: Category;
  onPress: () => void;
}

export default function VipLockedCard({ category, onPress }: VipLockedCardProps) {
  const color = category.color || Colors.gold;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
          <Ionicons name={category.icon as any} size={20} color={color} />
        </View>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={11} color={Colors.gold} />
          <Text style={styles.lockText}>VIP</Text>
        </View>
      </View>

      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.count}>{category.count} exclusive tips</Text>

      <View style={styles.divider} />

      <View style={styles.unlockRow}>
        <Ionicons name="star" size={12} color={Colors.gold} />
        <Text style={styles.unlockText}>Subscribe to unlock</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: `${Colors.gold}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: `${Colors.gold}50`,
  },
  lockText: {
    fontSize: FontSize.xs,
    color: Colors.gold,
    fontWeight: FontWeight.bold,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  count: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unlockText: {
    fontSize: FontSize.sm,
    color: Colors.gold,
    fontWeight: FontWeight.semibold,
  },
});
