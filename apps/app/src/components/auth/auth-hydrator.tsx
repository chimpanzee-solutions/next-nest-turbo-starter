'use client';

import { createContext, useContext, useLayoutEffect } from 'react';

import type { ServerAuthData } from '@/lib/auth/guards/auth.guards';
import type { ActiveOrganization } from '@/stores/auth-store';
import { useAuthStore } from '@/stores/auth-store';

type AuthHydrationValue = {
  readonly me: ServerAuthData['me'];
  readonly activeOrganization: ActiveOrganization | null;
};

const AuthHydrationContext = createContext<AuthHydrationValue | null>(null);

export function useAuthHydrationValue(): AuthHydrationValue | null {
  return useContext(AuthHydrationContext);
}

export function AuthHydrator({
  initialAuth,
  initialActiveOrganization,
  children,
}: {
  readonly initialAuth: ServerAuthData;
  readonly initialActiveOrganization: ActiveOrganization | null;
  readonly children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    useAuthStore.setState({
      accessToken: initialAuth.accessToken,
      me: initialAuth.me,
      activeOrganization: initialActiveOrganization,
    });
  }, [initialActiveOrganization, initialAuth.accessToken, initialAuth.me]);

  return (
    <AuthHydrationContext.Provider
      value={{
        me: initialAuth.me,
        activeOrganization: initialActiveOrganization,
      }}
    >
      {children}
    </AuthHydrationContext.Provider>
  );
}
