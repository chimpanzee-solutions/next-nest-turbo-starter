import { AuthHydrator } from '@/components/auth/auth-hydrator';
import { AdminDashboardShell } from '@/components/layout/admin-dashboard-shell';
import { requireServerAuth } from '@/lib/auth/guards/auth.guards';

export default async function MainAppLayout({ children }: { readonly children: React.ReactNode }) {
  const auth = await requireServerAuth();

  return (
    <AuthHydrator initialAuth={auth}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </AuthHydrator>
  );
}
