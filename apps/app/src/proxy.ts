import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

const REFRESH_COOKIE = env.NEXT_PUBLIC_REFRESH_COOKIE_NAME;
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (pathname === '/') {
    return NextResponse.redirect(new URL(hasSession ? '/dashboard' : '/login', request.url));
  }

  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api(?:/|$)|_next/static|_next/image|.*\\..*).*)'],
};
