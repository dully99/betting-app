import { Prediction as AppPrediction } from '../types';
import { Prediction as ApiPrediction } from './predictionService';

export function mapPrediction(dto: ApiPrediction): AppPrediction {
  const d = new Date(dto.matchTime);
  const date = isToday(d)
    ? 'Today'
    : isTomorrow(d)
    ? 'Tomorrow'
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return {
    id: String(dto.id),
    homeTeam: dto.homeTeam,
    awayTeam: dto.awayTeam,
    league: dto.league,
    country: dto.country,
    time,
    date,
    prediction: dto.prediction,
    odds: dto.odds,
    confidence: dto.confidence,
    analysis: dto.analysis,
    status: dto.status.toLowerCase() as AppPrediction['status'],
    category: dto.category,
    isVip: dto.isVip,
  };
}

export function mapPredictions(dtos: ApiPrediction[]): AppPrediction[] {
  return dtos.map(mapPrediction);
}

function isToday(d: Date): boolean {
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isTomorrow(d: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
}
