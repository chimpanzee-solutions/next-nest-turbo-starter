'use client';

import {
  DashboardFrame,
  DashboardSidebarFooter,
  DashboardSidebarNav,
  type DashboardFrameSidebar,
  type DashboardNavSection,
} from '@repo/ui';
import { cn, getInitials } from '@repo/web-utils';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthHydrationValue } from '@/components/auth/auth-hydrator';
import { AppBrandTitle } from '@/components/brand/app-brand-title';
import { logoutSession } from '@/lib/auth/actions/auth.actions';
import type { ActiveOrganization } from '@/stores/auth-store';
import { useAuthStore } from '@/stores/auth-store';

type DashboardShellProps = {
  readonly children: React.ReactNode;
};

export type ThemeMode = 'light' | 'dark';

const DASHBOARD_THEME_STORAGE_KEY = 'app-dashboard-theme';

const NAVIGATION_SECTIONS: readonly DashboardNavSection[] = [
  {
    label: 'Main',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
] as const;

export function OrganizationIdentity({
  name,
  type: _type,
}: {
  readonly name: string;
  readonly type: ActiveOrganization['type'];
}) {
  return (
    <div className="space-y-3">
      <AppBrandTitle title={name} />
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const hydrationValue = useAuthHydrationValue();
  const me = useAuthStore((state) => state.me) ?? hydrationValue?.me ?? null;
  const activeOrganization =
    useAuthStore((state) => state.activeOrganization) ?? hydrationValue?.activeOrganization ?? null;

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      return;
    }

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  if (!me || !activeOrganization) {
    return null;
  }

  const organizationRole =
    me.roles.find((role) => role.organizationId === activeOrganization.id)?.name ??
    (activeOrganization.isOwner ? 'Owner' : 'Member');

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
      <Link href="/dashboard" className="block min-w-0">
        <OrganizationIdentity name={activeOrganization.name} type={activeOrganization.type} />
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
        subtitle={organizationRole}
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
