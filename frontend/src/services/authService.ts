import { apiClient } from '@/services/apiClient';
import type { ApiMessageResponse, AuthResponse, UserProfile, UserRole } from '@/types/api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<UserRole, 'admin'>;
  company?: {
    company_name: string;
    website?: string;
    industry?: string;
    company_size?: string;
    location?: string;
    description?: string;
  };
};

export type ProfileUpdatePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
};

export const authService = {
  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async logout(refreshToken: string) {
    const response = await apiClient.post<ApiMessageResponse>('/auth/logout', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async refresh(refreshToken: string) {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post<ApiMessageResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await apiClient.post<ApiMessageResponse>('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  async me() {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },

  async updateMe(payload: ProfileUpdatePayload) {
    const response = await apiClient.patch<UserProfile>('/users/me', payload);
    return response.data;
  },
};

