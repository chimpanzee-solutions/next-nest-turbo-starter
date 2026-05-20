import { AuthShell } from '@/components/auth/auth-shell';
import { redirectIfAuthenticated } from '@/lib/auth/guards/auth.guards';

export default async function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  await redirectIfAuthenticated();
  return <AuthShell>{children}</AuthShell>;
}
