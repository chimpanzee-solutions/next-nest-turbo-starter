import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@repo/ui';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Forgot password?</h1>
          <CardDescription>We&apos;ll email you a link to reset it.</CardDescription>
        </CardHeader>

        <CardContent>
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
          >
            <ArrowLeft size={12} />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
