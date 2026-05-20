'use server';

import { cookies } from 'next/headers';

import {
  ACTIVE_ORGANIZATION_COOKIE_MAX_AGE,
  ACTIVE_ORGANIZATION_COOKIE_NAME,
} from '@/lib/auth/constants/active-organization.constants';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function setActiveOrganizationCookie(activeOrganizationId: string): Promise<void> {
  if (!activeOrganizationId) {
    throw new Error('A valid active organization id is required.');
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORGANIZATION_COOKIE_NAME, activeOrganizationId, {
    ...COOKIE_OPTIONS,
    maxAge: ACTIVE_ORGANIZATION_COOKIE_MAX_AGE,
  });
}

export async function clearActiveOrganizationCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORGANIZATION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}
