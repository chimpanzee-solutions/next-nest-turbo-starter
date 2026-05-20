import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdminSession } from '@repo/openapi';

import { env } from '@/env';

const REFRESH_COOKIE = env.NEXT_PUBLIC_ADMIN_REFRESH_COOKIE_NAME;

export type ServerAuthData = {
  accessToken: string;
  me: Awaited<ReturnType<typeof authAdminSession>>['data']['me'];
};

export const fetchServerAuth = cache(async (): Promise<ServerAuthData | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  console.log('fetchServerAuth - refreshToken:', refreshToken);
  if (!refreshToken) return null;

  try {
    const sessionRes = await authAdminSession({
      headers: { Cookie: `${REFRESH_COOKIE}=${refreshToken}` },
      cache: 'no-store',
    });
    const { accessToken, me } = sessionRes.data;
    return { accessToken, me };
  } catch {
    return null;
  }
});

export async function requireServerAuth(): Promise<ServerAuthData> {
  const auth = await fetchServerAuth();
  if (!auth) {
    redirect('/login');
  }
  return auth;
}

export async function redirectIfAuthenticated(): Promise<void> {
  const auth = await fetchServerAuth();
  if (auth) {
    redirect('/dashboard');
  }
}
