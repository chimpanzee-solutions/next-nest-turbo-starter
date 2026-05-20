import { z } from 'zod';

export const env = z
  .object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_REFRESH_COOKIE_NAME: z.string().default('app_refresh_token'),
  })
  .parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_REFRESH_COOKIE_NAME: process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME,
  });
