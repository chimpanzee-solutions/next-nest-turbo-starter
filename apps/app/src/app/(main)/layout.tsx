import { AuthHydrator } from '@/components/auth/auth-hydrator';
import { getServerActiveOrganization, requireServerAuth } from '@/lib/auth/guards/auth.guards';

export default async function MainAppLayout({ children }: { readonly children: React.ReactNode }) {
  const auth = await requireServerAuth();
  const activeOrganization = await getServerActiveOrganization(auth);

  return (
    <AuthHydrator initialAuth={auth} initialActiveOrganization={activeOrganization}>
      {children}
    </AuthHydrator>
  );
}
