import { SubscriptionPlan, PaymentMethod } from '../types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 5.99,
    currency: 'USD',
    period: '/ week',
    description: 'Perfect for trying out VIP tips',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 14.99,
    currency: 'USD',
    period: '/ month',
    description: 'Best value for serious tipsters',
    badge: 'POPULAR',
    isPopular: true,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 89.99,
    currency: 'USD',
    period: '/ year',
    description: 'Save 50% — Best long-term deal',
    badge: 'SAVE 50%',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'phone-portrait', color: '#00A651' },
  { id: 'airtel', name: 'Airtel Money', icon: 'phone-portrait', color: '#EF3340' },
  { id: 'tigo', name: 'Tigo Pesa', icon: 'phone-portrait', color: '#0080C8' },
  { id: 'card', name: 'Credit / Debit Card', icon: 'card', color: '#6366F1' },
];

export const vipBenefits = [
  'Unlock all VIP predictions daily',
  'Access high odds tips (5.0+)',
  'Correct score predictions',
  'HT/FT specialist tips',
  'Daily premium updates',
  'Big odds accumulators',
  'Priority support',
];
