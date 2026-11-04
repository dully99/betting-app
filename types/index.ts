export type PredictionStatus = 'pending' | 'won' | 'lost';

export interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  time: string;
  date: string;
  prediction: string;
  odds: number;
  confidence: number;
  analysis: string;
  status: PredictionStatus;
  category: string;
  isVip?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  isVip?: boolean;
  color?: string;
}

export interface Result {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  prediction: string;
  odds: number;
  actualResult: string;
  status: PredictionStatus;
  profit?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
}
