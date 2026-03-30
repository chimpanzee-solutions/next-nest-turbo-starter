'use client';

import { useHealthGetHealth } from '@repo/openapi';

export default function Home() {
  const { data, error, isSuccess } = useHealthGetHealth();
  console.log('[website] API health:', data, error, isSuccess);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-8">
      <button
        type="button"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Website
      </button>
    </main>
  );
}
