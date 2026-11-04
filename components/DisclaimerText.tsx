import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

interface DisclaimerTextProps {
  compact?: boolean;
}

export default function DisclaimerText({ compact = false }: DisclaimerTextProps) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <Ionicons name="information-circle-outline" size={13} color={Colors.textDim} />
        <Text style={styles.compactText}>For informational purposes only. Gamble responsibly.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <Ionicons name="warning-outline" size={20} color={Colors.gold} />
        <Text style={styles.title}>Disclaimer</Text>
      </View>
      <Text style={styles.text}>
        This application is for informational and entertainment purposes only. It is not a betting app
        and does not encourage gambling. All predictions are statistical suggestions based on data
        analysis and should not be treated as guaranteed outcomes.
      </Text>
      <Text style={styles.subText}>
        Use predictions responsibly. Never bet more than you can afford to lose. If you have
        concerns about problem gambling, seek help from relevant support services.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${Colors.gold}12`,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
    gap: Spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
  },
  text: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  subText: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    lineHeight: 18,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactText: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
  },
});
