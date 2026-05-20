'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authSignup } from '@repo/openapi';
import { ApiHttpError } from '@repo/openapi/api-client';
import { Alert, AlertDescription, Button, FormCheckboxField, FormInputField } from '@repo/ui';

import { signupFormSchema, type SignupFormValues } from '@/lib/auth/schemas/signup.schema';
import { useAuthStore } from '@/stores/auth-store';

export function SignupForm({ planCode }: { readonly planCode?: string }) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignupFormValues>({
    defaultValues: {
      organizationName: '',
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
    mode: 'onBlur',
    resolver: zodResolver(signupFormSchema),
  });

  async function onSubmit(values: SignupFormValues) {
    clearErrors('root');

    try {
      const response = await authSignup({
        organizationName: values.organizationName,
        name: values.name,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
        ...(planCode ? { planCode } : {}),
      });

      if (response.status !== 201) {
        throw new Error('Signup failed');
      }

      useAuthStore.getState().setAccessToken(response.data.accessToken);
      router.replace('/dashboard');
    } catch (error) {
      setError('root', {
        type: 'server',
        message:
          error instanceof ApiHttpError && error.status === 409
            ? 'An account with this email already exists.'
            : 'We could not create your account. Try again.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <FormInputField
        control={control}
        name="organizationName"
        label="Organization name"
        required
        autoComplete="organization"
        placeholder="Enter your organization name"
        disabled={isSubmitting}
        icon={<Building2 size={14} />}
      />

      <FormInputField
        control={control}
        name="name"
        label="Your name"
        required
        autoComplete="name"
        placeholder="Enter your full name"
        disabled={isSubmitting}
        icon={<User size={14} />}
      />

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
        required
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        disabled={isSubmitting}
        icon={<Lock size={14} />}
      />

      <FormCheckboxField
        control={control}
        name="acceptTerms"
        label="I agree to the terms and privacy policy."
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

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
