import { useEffect, useState } from 'react';

import { apiClient } from '@/services/apiClient';
import type { HealthResponse } from '@/types/api';

type HealthState = {
  data: HealthResponse | null;
  status: 'checking' | 'healthy' | 'unavailable';
};

export function useHealthCheck() {
  const [state, setState] = useState<HealthState>({
    data: null,
    status: 'checking',
  });

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get<HealthResponse>('/health')
      .then((response) => {
        if (isMounted) {
          setState({ data: response.data, status: 'healthy' });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({ data: null, status: 'unavailable' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

