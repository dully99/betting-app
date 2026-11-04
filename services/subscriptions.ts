import { api } from './api';

export interface SubscriptionPlanDTO {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  isPopular: boolean;
  badge: string | null;
}

export const subscriptionsService = {
  getAllPlans: () => api.get<SubscriptionPlanDTO[]>('/subscription-plans').then((r) => r.data),
};
