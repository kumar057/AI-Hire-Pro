import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import { APP_ENV, APP_NAME } from '@/constants/app';
import { AppConfigContext } from '@/context/configContextValue';
import { apiBaseUrl } from '@/utils/env';

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
