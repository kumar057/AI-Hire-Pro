import { createContext } from 'react';

import type { LoginPayload, ProfileUpdatePayload, RegisterPayload } from '@/services/authService';
import type { AuthResponse, UserProfile, UserRole } from '@/types/api';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload, expectedRole?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthResponse | null>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<UserProfile>;
  user: UserProfile | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

