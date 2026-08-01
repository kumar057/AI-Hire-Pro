import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

import { APP_ENV, APP_NAME } from '@/constants/app';
import { apiBaseUrl } from '@/utils/env';

type AppConfig = {
  apiBaseUrl: string;
  appEnv: string;
  appName: string;
};

const AppConfigContext = createContext<AppConfig | null>(null);

export function AppConfigProvider({ children }: PropsWithChildren) {
  const value = useMemo(
    () => ({
      apiBaseUrl,
      appEnv: APP_ENV,
      appName: APP_NAME,
    }),
    [],
  );

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);

  if (!context) {
    throw new Error('useAppConfig must be used inside AppConfigProvider');
  }

  return context;
}

