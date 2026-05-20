import { authLogout } from '@repo/openapi';

import { clearActiveOrganizationCookie } from '@/lib/auth/actions/active-organization.actions';
import { useAuthStore } from '@/stores/auth-store';

export async function logoutSession(): Promise<void> {
  try {
    await authLogout();
  } finally {
    await clearActiveOrganizationCookie().catch(() => undefined);
    useAuthStore.getState().reset();
  }
}
