'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, Badge, Button, Card, CardContent } from '@repo/ui';
import { capitalize, getInitials } from '@repo/web-utils';
import { Building2, ChevronRight, LogOut } from 'lucide-react';

import { useAuthHydrationValue } from '@/components/auth/auth-hydrator';
import { logoutSession } from '@/lib/auth/actions/auth.actions';
import { setActiveOrganizationCookie } from '@/lib/auth/actions/active-organization.actions';
import type { ActiveOrganization } from '@/stores/auth-store';
import { useAuthStore } from '@/stores/auth-store';
import { AppBrandTitle } from '@/components/brand/app-brand-title';

export default function SelectOrganizationPage() {
  const router = useRouter();
  const hydrationValue = useAuthHydrationValue();
  const me = useAuthStore((state) => state.me) ?? hydrationValue?.me ?? null;
  const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);

  const organizations = me?.organizations.filter((organization) => organization.isActive) ?? [];

  if (!me) {
    return null;
  }

  async function handleLogout() {
    await logoutSession();
    router.replace('/login');
  }

  async function handleSelectOrganization(organization: ActiveOrganization) {
    await setActiveOrganizationCookie(organization.id);
    setActiveOrganization(organization);
    router.replace('/dashboard');
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center gap-5">
        <div className="flex items-center justify-between gap-3">
          <AppBrandTitle />

          <div className="inline-flex min-w-0 items-center gap-1 rounded-full border bg-background px-2.5 py-2 text-sm shadow-xs sm:max-w-none sm:gap-3 sm:px-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {getInitials(me.user.name ?? me.user.email)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 truncate sm:block sm:max-w-52">
              {me.user.name ?? me.user.email}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Sign out"
              className="h-7 rounded-full px-2.5"
              onClick={() => void handleLogout()}
            >
              <LogOut size={14} />
            </Button>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-semibold">Choose an organization</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-md">
            Pick the organization you want to enter. You can switch again later if your account has
            access to multiple organizations.
          </p>
        </div>

        <Card className="overflow-hidden py-0">
          <CardContent className="p-0">
            {organizations.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-14">
                <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Building2 size={20} />
                </span>
                <h2 className="text-lg font-medium text-foreground">No workspaces available</h2>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                  This account does not have access to any active organization right now. Ask your
                  administrator to invite you, or sign out and try another account.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/70">
                {organizations.map((organization) => {
                  return (
                    <button
                      key={organization.id}
                      type="button"
                      onClick={() => void handleSelectOrganization(organization)}
                      className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50 sm:gap-4 sm:px-6"
                    >
                      <Avatar className="size-10 rounded-xl after:rounded-xl sm:size-11">
                        <AvatarFallback className="rounded-xl bg-primary font-semibold text-primary-foreground">
                          {getInitials(organization.name)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="min-w-0 w-full flex flex-col gap-1">
                        <span className="truncate text-sm font-medium text-foreground sm:text-md">
                          {organization.name}
                        </span>

                        <Badge variant="outline">{capitalize(organization.type)}</Badge>
                      </span>

                      <ChevronRight
                        size={16}
                        className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>Need access to a different workspace? Ask your administrator to invite you.</p>
          <Button
            type="button"
            variant="link"
            size="xs"
            onClick={() => void handleLogout()}
            className="h-auto justify-center px-0 sm:justify-end"
          >
            Sign in with another account
          </Button>
        </div>
      </div>
    </div>
  );
}
