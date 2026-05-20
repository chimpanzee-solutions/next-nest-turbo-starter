'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authForgotPassword } from '@repo/openapi';
import { Alert, AlertDescription, AlertTitle, Button, FormInputField } from '@repo/ui';

import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@/lib/auth/schemas/forgot-password.schema';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    clearErrors('root');
    try {
      await authForgotPassword({ email: values.email });
      setSubmitted(true);
    } catch {
      setError('root', {
        type: 'server',
        message: 'Something went wrong. Try again in a moment.',
      });
    }
  }

  if (submitted) {
    return (
      <Alert className="border-primary/15 bg-primary/5">
        <AlertTitle>Check your email</AlertTitle>
        <AlertDescription>
          If an account matches this address, password reset instructions will follow.
        </AlertDescription>
      </Alert>
    );
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

      {errors.root ? (
        <Alert
          variant="destructive"
          aria-live="polite"
          className="border-destructive/20 bg-destructive/10"
        >
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}
