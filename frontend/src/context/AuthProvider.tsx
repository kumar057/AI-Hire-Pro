import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '@/context/authContextValue';
import {
  authService,
  type LoginPayload,
  type ProfileUpdatePayload,
  type RegisterPayload,
} from '@/services/authService';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  storeAuthResponse,
  storeUser,
} from '@/services/tokenStorage';
import type { AuthResponse, UserProfile, UserRole } from '@/types/api';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const login = useCallback(async (payload: LoginPayload, expectedRole?: UserRole) => {
    const auth = await authService.login(payload);

    if (expectedRole && auth.user.role !== expectedRole) {
      clearAuthStorage();
      throw new Error(`Use the ${auth.user.role} login portal for this account.`);
    }

    storeAuthResponse(auth);
    setUser(auth.user);
    return auth.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const auth = await authService.register(payload);
    storeAuthResponse(auth);
    setUser(auth.user);
    return auth.user;
  }, []);

  const refreshSession = useCallback(async (): Promise<AuthResponse | null> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const auth = await authService.refresh(refreshToken);
      storeAuthResponse(auth);
      setUser(auth.user);
      return auth;
    } catch {
      clearAuthStorage();
      setUser(null);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    const updatedUser = await authService.updateMe(payload);
    storeUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const storedUser = getStoredUser();
      const accessToken = getAccessToken();

      if (!storedUser || !accessToken) {
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const profile = await authService.me();
        storeUser(profile);
        if (isMounted) {
          setUser(profile);
        }
      } catch {
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void initializeSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
      refreshSession,
      register,
      updateProfile,
      user,
    }),
    [isInitializing, login, logout, refreshSession, register, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
