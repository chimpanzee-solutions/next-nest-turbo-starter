import { AdminBrandTitle } from '@/components/brand/admin-brand-title';

export function AuthShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <AdminBrandTitle />
        </div>
        {children}
      </div>
    </main>
  );
}
