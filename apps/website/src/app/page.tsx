'use client';

import { useHealthGetHealth } from '@repo/openapi';

export default function Home() {
  const { data, isLoading, isError } = useHealthGetHealth({
    query: {
      refetchInterval: 60_000,
      retry: 1,
    },
  });

  const isHealthy = data?.data.ok === true;
  const statusLabel = isLoading
    ? 'Checking API status'
    : isError
      ? 'API degraded'
      : isHealthy
        ? 'API operational'
        : 'API unavailable';
  const statusTone = isLoading
    ? 'bg-amber-100 text-amber-800'
    : isError || !isHealthy
      ? 'bg-red-100 text-red-800'
      : 'bg-emerald-100 text-emerald-800';

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-950">
      <section className="w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6 inline-flex rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          Public site
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          Next Nest Turbo Starter
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          A reusable monorepo starter with a NestJS API, Next.js apps, auth flows, organization
          switching, and billing foundations already wired up.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          <span
            className={`inline-flex size-2.5 rounded-full ${isLoading ? 'animate-pulse bg-amber-500' : isError || !isHealthy ? 'bg-red-500' : 'bg-emerald-500'}`}
            aria-hidden="true"
          />
          <span>{statusLabel}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusTone}`}>
            {isLoading ? 'Pending' : isError || !isHealthy ? 'Issue' : 'Live'}
          </span>
        </div>
      </section>
    </main>
  );
}
