import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
