import { create } from 'zustand';
import type { AuthMeResponseDto } from '@repo/openapi';

export type ActiveOrganization = AuthMeResponseDto['organizations'][number];

export type AuthState = {
  accessToken: string | null;
  setAccessToken: (_token: string | null) => void;
  me: AuthMeResponseDto | null;
  setMe: (_me: AuthMeResponseDto | null) => void;
  activeOrganization: ActiveOrganization | null;
  setActiveOrganization: (_organization: ActiveOrganization | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  me: null,
  setMe: (me) =>
    set((state) => {
      if (!me) {
        return { me: null, activeOrganization: null };
      }

      const activeOrganization = state.activeOrganization
        ? (me.organizations.find(
            (organization) => organization.id === state.activeOrganization?.id,
          ) ?? null)
        : null;

      return { me, activeOrganization };
    }),
  activeOrganization: null,
  setActiveOrganization: (activeOrganization) => set({ activeOrganization }),
  reset: () => set({ accessToken: null, me: null, activeOrganization: null }),
}));
