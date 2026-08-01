import { createContext } from 'react';

export type AppConfig = {
  apiBaseUrl: string;
  appEnv: string;
  appName: string;
};

export const AppConfigContext = createContext<AppConfig | null>(null);

