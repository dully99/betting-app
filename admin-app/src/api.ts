import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url?.includes("/auth/login")) {
      localStorage.removeItem("token");
      if (!location.pathname.startsWith("/login")) location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export interface Prediction {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  matchTime: string;
  prediction: string;
  predictionType?: string;
  predictionValue?: string;
  odds: number;
  confidence: number;
  isVip: boolean;
  status: string;
  analysis?: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  isPopular: boolean;
  badge: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const login = (username: string, password: string) =>
  api.post<ApiResponse<{ token: string; username: string }>>("/auth/login", { username, password })
    .then((r) => r.data.data);

export const getStats = () =>
  api.get<ApiResponse<Record<string, number>>>("/admin/stats").then((r) => r.data.data);

export const getPredictions = (status?: string) =>
  api.get<ApiResponse<Prediction[]>>("/admin/predictions", { params: { status } }).then((r) => r.data.data);

export const getReviewQueue = () =>
  api.get<ApiResponse<Prediction[]>>("/admin/predictions/review").then((r) => r.data.data);

export const approvePrediction = (id: number) =>
  api.post(`/admin/predictions/${id}/approve`).then((r) => r.data.data);

export const rejectPrediction = (id: number) =>
  api.post(`/admin/predictions/${id}/reject`).then((r) => r.data.data);

export const deletePrediction = (id: number) =>
  api.delete(`/admin/predictions/${id}`);

export const regenerateAnalysis = (id: number) =>
  api.post<ApiResponse<Prediction>>(`/admin/predictions/${id}/regenerate-analysis`).then((r) => r.data.data);

export interface Fixture {
  id: number;
  providerFixtureId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  startingAt: string;
  state?: string;
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export const getFixtures = (days = 1) =>
  api.get<ApiResponse<Fixture[]>>("/admin/fixtures", { params: { days } }).then((r) => r.data.data);

export const getCategories = () =>
  api.get<ApiResponse<Category[]>>("/categories").then((r) => r.data.data);

export const createPrediction = (payload: {
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  matchTime: string;
  prediction: string;
  odds: number;
  confidence: number;
  categoryId: number;
  isVip: boolean;
  analysis?: string;
  providerFixtureId?: string;
}) => api.post<ApiResponse<Prediction>>("/admin/predictions", payload).then((r) => r.data.data);

export const getOdds = (homeTeam: string, awayTeam: string) =>
  api.get<ApiResponse<Record<string, Record<string, number>> | null>>("/admin/odds", {
    params: { homeTeam, awayTeam },
  }).then((r) => r.data.data);

export const getPlans = () =>
  api.get<ApiResponse<Plan[]>>("/subscription-plans").then((r) => r.data.data);

export const syncToday = () => api.post("/admin/sync/today").then((r) => r.data.data);
export const syncTomorrow = () => api.post("/admin/sync/tomorrow").then((r) => r.data.data);
export const syncResults = () => api.post("/admin/sync/results").then((r) => r.data.data);
