import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { paymentsService } from '../services/payments';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../constants/theme';

const paymentMethods = [
  { id: 'MPESA', name: 'M-Pesa', icon: 'phone-portrait-outline', color: '#00A651' },
  { id: 'AIRTEL_MONEY', name: 'Airtel Money', icon: 'wifi-outline', color: '#E40613' },
  { id: 'TIGO_PESA', name: 'Tigo Pesa', icon: 'radio-outline', color: '#0099D8' },
  { id: 'CARD', name: 'Card', icon: 'card-outline', color: '#6366F1' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { planId, planName, price } = useLocalSearchParams<{ planId: string; planName: string; price: string }>();

  const [selectedMethod, setSelectedMethod] = useState<string>('MPESA');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const isMobile = selectedMethod !== 'CARD';

  const handleConfirm = async () => {
    if (isMobile && phone.replace(/\D/g, '').length < 9) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }
    if (!isMobile && (cardNumber.length < 16 || cardExpiry.length < 4 || cardCvv.length < 3)) {
      Alert.alert('Invalid Card', 'Please fill in all card details.');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `+255${phone.replace(/\D/g, '')}`;
      const result = await paymentsService.initiatePayment({
        phoneNumber: isMobile ? fullPhone : phone,
        planId: Number(planId ?? 1),
        paymentMethod: selectedMethod,
      });
      setLoading(false);
      Alert.alert(
        'Payment Initiated!',
        `Ref: ${result.data.transactionReference}\n\n${isMobile ? 'A prompt will be sent to your phone to confirm payment.' : 'Card payment initiated.'}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Payment Failed', err.message || 'Could not process payment. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Payment" subtitle="Complete your subscription" showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        bounces={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="diamond" size={20} color={Colors.gold} />
            <View style={styles.summaryText}>
              <Text style={styles.summaryTitle}>SmartBet VIP — {planName ?? 'Monthly'}</Text>
              <Text style={styles.summarySub}>Cancel anytime · Instant access</Text>
            </View>
            <Text style={styles.summaryPrice}>${price ?? '14.99'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.methodsGrid}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardActive,
                  selectedMethod === method.id && { borderColor: method.color },
                ]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                  <Ionicons name={method.icon as any} size={20} color={method.color} />
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
                {selectedMethod === method.id && (
                  <View style={[styles.methodCheck, { backgroundColor: method.color }]}>
                    <Ionicons name="checkmark" size={10} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          {isMobile ? (
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputPrefix}>
                  <Text style={styles.inputPrefixText}>+255</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="7XX XXX XXX"
                  placeholderTextColor={Colors.textDim}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              <Text style={styles.inputHint}>
                You will receive a payment prompt on your phone to confirm the transaction.
              </Text>
            </View>
          ) : (
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.cardInputs}>
                <View style={styles.cardInputWrapper}>
                  <Ionicons name="card-outline" size={18} color={Colors.textDim} style={styles.cardIcon} />
                  <TextInput
                    style={styles.cardInput}
                    placeholder="Card Number"
                    placeholderTextColor={Colors.textDim}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="number-pad"
                    maxLength={16}
                  />
                </View>
                <View style={styles.cardRow}>
                  <View style={[styles.cardInputWrapper, styles.cardInputHalf]}>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="MM/YY"
                      placeholderTextColor={Colors.textDim}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>
                  <View style={[styles.cardInputWrapper, styles.cardInputHalf]}>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="CVV"
                      placeholderTextColor={Colors.textDim}
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      keyboardType="number-pad"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <PrimaryButton
            label="Confirm Payment — $14.99"
            onPress={handleConfirm}
            loading={loading}
            variant="gold"
            size="lg"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.securityRow}>
            <Ionicons name="lock-closed" size={14} color={Colors.textDim} />
            <Text style={styles.securityText}>
              Payments are encrypted and secured. SmartBet does not store your payment details.
            </Text>
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
  summaryCard: {
    margin: Spacing.lg,
    backgroundColor: `${Colors.gold}15`,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.gold}35`,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryText: {
    flex: 1,
    gap: 3,
  },
  summaryTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  summarySub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  summaryPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.gold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  methodCard: {
    width: '47.5%',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  methodCardActive: {
    backgroundColor: Colors.cardAlt,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  methodCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    gap: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  inputPrefix: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.border,
  },
  inputPrefixText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputHint: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    lineHeight: 17,
  },
  cardInputs: {
    gap: Spacing.sm,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  cardIcon: {
    marginRight: Spacing.sm,
  },
  cardInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cardInputHalf: {
    flex: 1,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  securityText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textDim,
    lineHeight: 17,
  },
});
