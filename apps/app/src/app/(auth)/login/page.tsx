import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@repo/ui';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-muted-foreground">Need an account?</span>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
          >
            Create an account <ArrowRight size={12} />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
