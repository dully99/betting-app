import { Category } from '../types';

export const freeCategories: Category[] = [
  { id: 'fc1', name: 'Best Tips of the Day', icon: 'star', count: 4, color: '#FACC15' },
  { id: 'fc2', name: 'Safe Picks', icon: 'shield-checkmark', count: 6, color: '#22C55E' },
  { id: 'fc3', name: 'Over / Under Tips', icon: 'trending-up', count: 8, color: '#38BDF8' },
  { id: 'fc4', name: 'Single Games', icon: 'football', count: 10, color: '#A78BFA' },
  { id: 'fc5', name: 'Football Combines', icon: 'layers', count: 5, color: '#FB923C' },
  { id: 'fc6', name: 'Basketball Tips', icon: 'basketball', count: 4, color: '#F97316' },
  { id: 'fc7', name: 'Tennis Tips', icon: 'tennisball', count: 3, color: '#34D399' },
];

export const vipCategories: Category[] = [
  { id: 'vc1', name: 'Elite VIP', icon: 'diamond', count: 2, isVip: true, color: '#FACC15' },
  { id: 'vc2', name: 'Fixed VIP', icon: 'lock-closed', count: 3, isVip: true, color: '#EF4444' },
  { id: 'vc3', name: 'Single VIP', icon: 'star', count: 4, isVip: true, color: '#A78BFA' },
  { id: 'vc4', name: 'Correct Score VIP', icon: 'checkmark-circle', count: 2, isVip: true, color: '#38BDF8' },
  { id: 'vc5', name: 'HT/FT VIP', icon: 'time', count: 3, isVip: true, color: '#FB923C' },
  { id: 'vc6', name: 'Special VIP', icon: 'flash', count: 2, isVip: true, color: '#34D399' },
  { id: 'vc7', name: 'Big Odds VIP', icon: 'trending-up', count: 3, isVip: true, color: '#F97316' },
];
