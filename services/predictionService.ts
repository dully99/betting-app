import { api } from './api';

export interface Prediction {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  matchTime: string;
  prediction: string;
  odds: number;
  confidence: number;
  category: string;
  categoryType: 'FREE' | 'VIP';
  isVip: boolean;
  status: 'PENDING' | 'WON' | 'LOST';
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'FREE' | 'VIP';
}

export const predictionService = {
  getFreePredictions: (): Promise<Prediction[]> =>
    api.get<Prediction[]>('/predictions/free').then((r) => r.data),

  getVipPredictions: (): Promise<Prediction[]> =>
    api.get<Prediction[]>('/predictions/vip').then((r) => r.data),

  getPredictionDetails: (id: number | string): Promise<Prediction> =>
    api.get<Prediction>(`/predictions/${id}`).then((r) => r.data),

  getResults: (): Promise<Prediction[]> =>
    api.get<Prediction[]>('/predictions/results').then((r) => r.data),

  getCategories: (): Promise<Category[]> =>
    api.get<Category[]>('/categories').then((r) => r.data),
};
