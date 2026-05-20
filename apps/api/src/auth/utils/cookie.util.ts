import type { Response } from 'express';
import { env } from '@/env';
import { parseDurationMs } from '@/auth/utils/parse-duration-ms';

export function setRefreshTokenCookie(
  response: Response,
  rawToken: string,
  cookieName: string,
  maxAgeMs?: number,
): void {
  const maxAge = maxAgeMs ?? parseDurationMs(env.JWT_REFRESH_EXPIRES_IN);
  response.cookie(cookieName, rawToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export function clearRefreshTokenCookie(response: Response, cookieName: string): void {
  response.clearCookie(cookieName, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });
}
