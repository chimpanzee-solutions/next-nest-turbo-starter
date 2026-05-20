import { authAdminLogout } from '@repo/openapi';

import { useAuthStore } from '@/stores/auth-store';

export async function logoutSession(): Promise<void> {
  try {
    await authAdminLogout();
  } finally {
    useAuthStore.getState().reset();
  }
}
