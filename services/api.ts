import axios, { AxiosError, AxiosInstance } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : null) ||
      (error.code === 'ERR_NETWORK' ? 'Cannot reach server. Is the backend running?' : null) ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export const api = {
  get: <T>(endpoint: string) =>
    client.get<ApiResponse<T>>(endpoint).then((r) => r.data),

  post: <T>(endpoint: string, body: unknown) =>
    client.post<ApiResponse<T>>(endpoint, body).then((r) => r.data),

  put: <T>(endpoint: string, body: unknown) =>
    client.put<ApiResponse<T>>(endpoint, body).then((r) => r.data),

  delete: <T>(endpoint: string) =>
    client.delete<ApiResponse<T>>(endpoint).then((r) => r.data),
};
