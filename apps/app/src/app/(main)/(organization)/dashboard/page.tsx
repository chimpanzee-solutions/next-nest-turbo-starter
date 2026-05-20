'use client';

import { useRouter } from 'next/navigation';
import { Button, PageHeader } from '@repo/ui';

import { logoutSession } from '@/lib/auth/actions/auth.actions';
import { clearActiveOrganizationCookie } from '@/lib/auth/actions/active-organization.actions';
import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const router = useRouter();
  const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);

  async function handleLogout() {
    await logoutSession();
    router.replace('/login');
  }

  async function handleSwitchOrganization() {
    await clearActiveOrganizationCookie();
    setActiveOrganization(null);
    router.replace('/select-organization');
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Starter dashboard placeholder for organization-facing features."
        actions={
          <>
            <Button type="button" variant="outline" onClick={() => void handleSwitchOrganization()}>
              Switch workspace
            </Button>
            <Button type="button" onClick={() => void handleLogout()}>
              Log out
            </Button>
          </>
        }
      />

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Build your authenticated application from this screen.
        </div>
      </div>
    </>
  );
}
