'use client';

import { configureApiClient } from '@repo/openapi/api-client';

import { env } from '@/env';
import { QueryProvider } from './query-provider';

configureApiClient({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
