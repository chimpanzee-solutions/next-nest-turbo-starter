'use client';

import { createContext, useContext, useLayoutEffect } from 'react';

import type { ServerAuthData } from '@/lib/auth/guards/auth.guards';
import { useAuthStore } from '@/stores/auth-store';

type AuthHydrationValue = {
  readonly me: ServerAuthData['me'];
};

const AuthHydrationContext = createContext<AuthHydrationValue | null>(null);

export function useAuthHydrationValue(): AuthHydrationValue | null {
  return useContext(AuthHydrationContext);
}

export function AuthHydrator({
  initialAuth,
  children,
}: {
  readonly initialAuth: ServerAuthData;
  readonly children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    useAuthStore.setState({
      accessToken: initialAuth.accessToken,
      me: initialAuth.me,
    });
  }, [initialAuth.accessToken, initialAuth.me]);

  return (
    <AuthHydrationContext.Provider value={{ me: initialAuth.me }}>
      {children}
    </AuthHydrationContext.Provider>
  );
}
