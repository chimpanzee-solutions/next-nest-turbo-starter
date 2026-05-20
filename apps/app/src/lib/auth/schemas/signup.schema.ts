import { z } from 'zod';

export const signupFormSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(1, 'Organization name is required')
    .max(200, 'Organization name must be 200 characters or fewer'),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or fewer'),
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
  acceptTerms: z
    .boolean()
    .refine((value) => value === true, 'You must accept the terms and privacy policy'),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
