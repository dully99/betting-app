import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubscriptionPlan } from '../types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  selected: boolean;
  onPress: () => void;
}

export default function SubscriptionCard({ plan, selected, onPress }: SubscriptionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        plan.isPopular && styles.cardPopular,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {plan.badge && (
        <View style={[styles.badge, plan.isPopular ? styles.badgePopular : styles.badgeSave]}>
          <Text style={[styles.badgeText, plan.isPopular ? styles.badgeTextPopular : styles.badgeTextSave]}>
            {plan.badge}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{plan.name}</Text>
          <Text style={styles.description}>{plan.description}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.currency}>$</Text>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
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
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  cardPopular: {
    borderColor: Colors.gold,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderBottomLeftRadius: Radius.md,
    borderTopRightRadius: Radius.lg,
  },
  badgePopular: {
    backgroundColor: Colors.gold,
  },
  badgeSave: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  badgeTextPopular: {
    color: Colors.background,
  },
  badgeTextSave: {
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  description: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  currency: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  period: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
});
