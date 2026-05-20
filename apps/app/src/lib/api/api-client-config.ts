import type { ApiClientConfig } from '@repo/openapi/api-client';

import { env } from '@/env';

type ClientApiClientConfigOptions = {
  getAccessToken: NonNullable<ApiClientConfig['getAccessToken']>;
  setAccessToken: NonNullable<ApiClientConfig['setAccessToken']>;
  onSessionExpired: () => void;
  onForbidden: () => void;
};

function getBaseApiClientConfig(): Pick<ApiClientConfig, 'baseUrl' | 'refreshPath'> {
  return {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    refreshPath: '/api/auth/refresh',
  };
}

export function getServerApiClientConfig(): ApiClientConfig {
  return {
    ...getBaseApiClientConfig(),
  };
}

export function getClientApiClientConfig({
  getAccessToken,
  setAccessToken,
  onSessionExpired,
  onForbidden,
}: ClientApiClientConfigOptions): ApiClientConfig {
  return {
    ...getBaseApiClientConfig(),
    getAccessToken,
    setAccessToken,
    onSessionExpired,
    onForbidden,
  };
}
