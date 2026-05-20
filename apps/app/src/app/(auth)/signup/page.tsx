import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@repo/ui';

import { SignupForm } from '@/components/auth/signup-form';

type ISignupPageProps = {
  searchParams: Promise<{
    plan?: string | string[];
  }>;
};

export default async function SignupPage({ searchParams }: ISignupPageProps) {
  const params = await searchParams;
  const plan = Array.isArray(params.plan) ? params.plan[0] : params.plan;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <CardDescription>Set up your organization owner account.</CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm {...(plan ? { planCode: plan } : {})} />
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-muted-foreground">Already have an account?</span>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
          >
            Sign in <ArrowRight size={12} />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
