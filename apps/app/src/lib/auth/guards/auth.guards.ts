import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authSession } from '@repo/openapi';

import { ACTIVE_ORGANIZATION_COOKIE_NAME } from '@/lib/auth/constants/active-organization.constants';
import { env } from '@/env';

const REFRESH_COOKIE = env.NEXT_PUBLIC_REFRESH_COOKIE_NAME;

export type ServerAuthData = {
  accessToken: string;
  me: Awaited<ReturnType<typeof authSession>>['data']['me'];
};

export type ServerActiveOrganization = ServerAuthData['me']['organizations'][number];

export const fetchServerAuth = cache(async (): Promise<ServerAuthData | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const sessionRes = await authSession({
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

export async function getServerActiveOrganization(
  auth: ServerAuthData,
): Promise<ServerActiveOrganization | null> {
  const cookieStore = await cookies();
  const activeOrganizationId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE_NAME)?.value;

  if (!activeOrganizationId) {
    return null;
  }

  return (
    auth.me.organizations.find((organization) => organization.id === activeOrganizationId) ?? null
  );
}

export async function requireServerActiveOrganization(
  auth: ServerAuthData,
): Promise<ServerActiveOrganization> {
  const activeOrganization = await getServerActiveOrganization(auth);

  if (!activeOrganization) {
    redirect('/select-organization');
  }

  return activeOrganization;
}
