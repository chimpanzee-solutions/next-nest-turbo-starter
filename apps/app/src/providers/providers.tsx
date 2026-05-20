'use client';

import { configureApiClient } from '@repo/openapi/api-client';

import { getClientApiClientConfig } from '@/lib/api/api-client-config';
import { clearActiveOrganizationCookie } from '@/lib/auth/actions/active-organization.actions';
import { useAuthStore } from '@/stores/auth-store';
import { QueryProvider } from './query-provider';

function replaceLocation(path: string): void {
  if (typeof window !== 'undefined') {
    window.location.replace(path);
  }
}

configureApiClient(
  getClientApiClientConfig({
    getAccessToken: () => useAuthStore.getState().accessToken,
    setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
    onSessionExpired: () => {
      void clearActiveOrganizationCookie().catch(() => undefined);
      useAuthStore.getState().reset();
      replaceLocation('/login');
    },
    onForbidden: () => {
      replaceLocation('/forbidden');
    },
  }),
);

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
