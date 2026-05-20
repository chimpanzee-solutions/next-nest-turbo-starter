'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DashboardFrame,
  DashboardSidebarFooter,
  DashboardSidebarNav,
  type DashboardFrameSidebar,
  type DashboardNavSection,
} from '@repo/ui';
import { cn, getInitials } from '@repo/web-utils';
import { LayoutDashboard } from 'lucide-react';

import { useAuthHydrationValue } from '@/components/auth/auth-hydrator';
import { AdminBrandTitle } from '@/components/brand/admin-brand-title';
import { logoutSession } from '@/lib/auth/actions/auth.actions';
import { useAuthStore } from '@/stores/auth-store';

type AdminDashboardShellProps = {
  readonly children: React.ReactNode;
};

type ThemeMode = 'light' | 'dark';

const DASHBOARD_THEME_STORAGE_KEY = 'admin-dashboard-theme';

const NAVIGATION_SECTIONS: readonly DashboardNavSection[] = [
  {
    label: 'Main',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
] as const;

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const hydrationValue = useAuthHydrationValue();
  const me = useAuthStore((state) => state.me) ?? hydrationValue?.me ?? null;

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      return;
    }

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  if (!me) {
    return null;
  }

  async function handleLogout() {
    await logoutSession();
    router.replace('/login');
  }

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }

  const userDisplayName = me.user.name ?? me.user.email;
  const sidebar: DashboardFrameSidebar = {
    widthClassName: 'w-60 shrink-0',
    header: (
      <Link href="/dashboard" className="block space-y-3">
        <AdminBrandTitle />
      </Link>
    ),
    nav: (
      <DashboardSidebarNav
        sections={NAVIGATION_SECTIONS}
        pathname={pathname}
        renderLink={({ href, className, onClick, children }) => {
          const linkProps = {
            href,
            className,
            ...(onClick ? { onClick } : {}),
          };

          return <Link {...linkProps}>{children}</Link>;
        }}
      />
    ),
    footer: (
      <DashboardSidebarFooter
        title={userDisplayName}
        subtitle={me.user.email}
        avatarFallback={getInitials(userDisplayName)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={() => void handleLogout()}
      />
    ),
  };

  return (
    <div className={cn(theme === 'dark' && 'dark')}>
      <DashboardFrame sidebar={sidebar}>
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </DashboardFrame>
    </div>
  );
}
