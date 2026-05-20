'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authResetPassword } from '@repo/openapi';
import { Alert, AlertAction, AlertDescription, AlertTitle, Button, FormInputField } from '@repo/ui';

import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@/lib/auth/schemas/reset-password.schema';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
    resolver: zodResolver(resetPasswordFormSchema),
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    clearErrors('root');

    try {
      await authResetPassword({ token, password: values.password });
      router.replace('/login?reset=success');
    } catch {
      setError('root', {
        type: 'server',
        message: 'This reset link is invalid or has expired. Request a new one.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <FormInputField
        control={control}
        name="password"
        label="New password"
        required
        type="password"
        autoComplete="new-password"
        placeholder="Create a new password"
        disabled={isSubmitting}
        icon={<Lock size={14} />}
      />

      <FormInputField
        control={control}
        name="confirmPassword"
        label="Confirm password"
        required
        type="password"
        autoComplete="new-password"
        placeholder="Confirm your password"
        disabled={isSubmitting}
        icon={<Lock size={14} />}
      />

      {errors.root ? (
        <Alert
          variant="destructive"
          aria-live="polite"
          className="border-destructive/20 bg-destructive/10"
        >
          <AlertTitle>Reset link expired</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
          <AlertAction>
            <Button asChild size="xs" variant="outline">
              <Link href="/forgot-password">Request new link</Link>
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Updating…' : 'Reset password'}
      </Button>
    </form>
  );
}
