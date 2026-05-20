import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

const REFRESH_COOKIE = env.NEXT_PUBLIC_ADMIN_REFRESH_COOKIE_NAME;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);

  if (pathname === '/') {
    return NextResponse.redirect(new URL(hasSession ? '/dashboard' : '/login', request.url));
  }

  if (!hasSession && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api(?:/|$)|_next/static|_next/image|.*\\..*).*)'],
};
