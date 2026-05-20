'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { authLogin } from '@repo/openapi';
import { Alert, AlertDescription, Button, FormCheckboxField, FormInputField } from '@repo/ui';

import { loginFormSchema, type LoginFormValues } from '@/lib/auth/schemas/login.schema';
import { useAuthStore } from '@/stores/auth-store';

export function LoginForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
    mode: 'onBlur',
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    clearErrors('root');
    try {
      const response = await authLogin({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe ?? false,
      });

      if (response.status !== 200) {
        throw new Error('Login failed');
      }

      useAuthStore.getState().setAccessToken(response.data.accessToken);
      router.replace('/dashboard');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Invalid email or password.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <FormInputField
        control={control}
        name="email"
        label="Email"
        required
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        disabled={isSubmitting}
        icon={<Mail size={14} />}
      />

      <FormInputField
        control={control}
        name="password"
        label="Password"
        labelAction={
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Forgot password?
          </Link>
        }
        required
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        disabled={isSubmitting}
        icon={<Lock size={14} />}
      />

      <FormCheckboxField
        control={control}
        name="rememberMe"
        label="Keep me signed in"
        disabled={isSubmitting}
      />

      {errors.root ? (
        <Alert
          variant="destructive"
          aria-live="polite"
          className="border-destructive/20 bg-destructive/10"
        >
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
        {!isSubmitting && <ArrowRight size={14} />}
      </Button>
    </form>
  );
}
