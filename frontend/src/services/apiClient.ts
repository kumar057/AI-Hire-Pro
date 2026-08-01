import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  storeAuthResponse,
} from '@/services/tokenStorage';
import type { AuthResponse } from '@/types/api';
import { apiBaseUrl } from '@/utils/env';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<AuthResponse> | null = null;

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes('/auth/')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= axios
        .post<AuthResponse>(
          '/auth/refresh',
          { refresh_token: refreshToken },
          {
            baseURL: apiBaseUrl,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => response.data);

      const auth = await refreshPromise;
      storeAuthResponse(auth);
      originalRequest.headers.Authorization = `Bearer ${auth.access_token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);
