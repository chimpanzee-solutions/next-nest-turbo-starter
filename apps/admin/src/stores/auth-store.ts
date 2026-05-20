import { create } from 'zustand';
import type { AuthMeResponseDto } from '@repo/openapi';

export type AuthState = {
  accessToken: string | null;
  setAccessToken: (_token: string | null) => void;
  me: AuthMeResponseDto | null;
  setMe: (_me: AuthMeResponseDto | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  me: null,
  setMe: (me) => set({ me }),
  reset: () => set({ accessToken: null, me: null }),
}));
