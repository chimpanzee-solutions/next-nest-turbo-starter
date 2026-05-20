import type { ApiClientConfig } from '@repo/openapi/api-client';

import { env } from '@/env';

type ClientApiClientConfigOptions = {
  getAccessToken: NonNullable<ApiClientConfig['getAccessToken']>;
  setAccessToken: NonNullable<ApiClientConfig['setAccessToken']>;
  onSessionExpired: () => void;
  onForbidden: () => void;
};

function getBaseApiClientConfig(): Pick<ApiClientConfig, 'baseUrl'> {
  return {
    baseUrl: env.NEXT_PUBLIC_API_URL,
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
    refreshPath: '/api/auth/admin/refresh',
    getAccessToken,
    setAccessToken,
    onSessionExpired,
    onForbidden,
  };
}
