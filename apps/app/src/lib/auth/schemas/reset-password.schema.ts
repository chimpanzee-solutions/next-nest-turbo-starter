import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.confirmPassword === values.password, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
