'use client';

import { useHealthGetHealth } from '@repo/openapi';
import { Button, Input } from '@repo/ui';

export default function Home() {
  const { data, error, isSuccess } = useHealthGetHealth();
  console.log('[app] API health:', data, error, isSuccess);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input type="text" placeholder="Email" autoComplete="email" />
        <Input type="password" placeholder="Password" autoComplete="current-password" />
      </div>
      <Button type="button">App</Button>
    </main>
  );
}
