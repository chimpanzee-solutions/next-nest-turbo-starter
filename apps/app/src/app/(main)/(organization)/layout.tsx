import { requireServerActiveOrganization, requireServerAuth } from '@/lib/auth/guards/auth.guards';

export default async function OrganizationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const auth = await requireServerAuth();
  await requireServerActiveOrganization(auth);

  return children;
}
