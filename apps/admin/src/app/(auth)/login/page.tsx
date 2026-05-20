import { Card, CardContent, CardDescription, CardHeader } from '@repo/ui';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <CardDescription>Use your administrator credentials to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
