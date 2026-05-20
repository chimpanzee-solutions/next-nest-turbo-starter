import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@repo/ui';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const hasToken = !!token?.length;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Set a new password</h1>
          <CardDescription>Choose a strong password for your account.</CardDescription>
        </CardHeader>

        <CardContent>
          {hasToken ? (
            <ResetPasswordForm token={token} />
          ) : (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
              <AlertTitle>Invalid link</AlertTitle>
              <AlertDescription>
                This password reset link is missing or invalid. Request a new one to continue.
              </AlertDescription>
              <AlertAction>
                <Button asChild size="xs" variant="outline">
                  <Link href="/forgot-password">Request new link</Link>
                </Button>
              </AlertAction>
            </Alert>
          )}
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
