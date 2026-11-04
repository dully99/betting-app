import { api } from './api';

export interface PredictionDTO {
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
  categoryType: string;
  isVip: boolean;
  status: 'PENDING' | 'WON' | 'LOST';
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

export const predictionsService = {
  getFreePredictions: () =>
    api.get<PredictionDTO[]>('/predictions/free').then((r) => r.data),

  getVipPredictions: () =>
    api.get<PredictionDTO[]>('/predictions/vip').then((r) => r.data),

  getResults: () =>
    api.get<PredictionDTO[]>('/predictions/results').then((r) => r.data),

  getPredictionById: (id: number | string) =>
    api.get<PredictionDTO>(`/predictions/${id}`).then((r) => r.data),
};
