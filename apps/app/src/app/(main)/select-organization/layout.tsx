import { getServerActiveOrganization, requireServerAuth } from '@/lib/auth/guards/auth.guards';
import { redirect } from 'next/navigation';

export default async function SelectOrganizationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const auth = await requireServerAuth();
  const activeOrganization = await getServerActiveOrganization(auth);

  if (activeOrganization) {
    redirect('/dashboard');
  }

  return children;
}
