import type { Request } from 'express';

export function rawRefreshCookie(request: Request, cookieName: string): string | undefined {
  return request.cookies[cookieName] as string | undefined;
}
