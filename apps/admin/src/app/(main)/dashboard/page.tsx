'use client';

import { PageHeader } from '@repo/ui';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Starter admin dashboard placeholder." />

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Build your admin-facing tools from this screen.
        </div>
      </div>
    </>
  );
}
