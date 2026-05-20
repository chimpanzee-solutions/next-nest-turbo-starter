import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
