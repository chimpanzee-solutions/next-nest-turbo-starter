import 'dotenv/config';
import { z } from 'zod';

const defaultCorsOrigins = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
] as const;

type TrustProxySetting = boolean | number | string | string[];

function parseTrustProxySetting(value: string, ctx: z.RefinementCtx): TrustProxySetting {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();

  if (normalized === 'false') {
    return false;
  }

  if (normalized === 'true') {
    return true;
  }

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  const entries = trimmed
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (entries.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'TRUST_PROXY must be false, true, a hop count, or a comma-separated proxy list',
    });
    return z.NEVER;
  }

  if (entries.length === 1) {
    const [entry] = entries;
    if (!entry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'TRUST_PROXY must resolve to a valid proxy entry',
      });
      return z.NEVER;
    }
    return entry;
  }

  return entries;
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  JWT_REFRESH_SESSION_EXPIRES_IN: z.string().default('8h'),
  PASSWORD_RESET_EXPIRES_IN: z.string().default('1h'),
  APP_PUBLIC_URL: z.string().url(),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default(defaultCorsOrigins.join(','))
    .transform((value, ctx) => {
      const origins = value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);

      if (origins.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CORS_ALLOWED_ORIGINS must contain at least one origin',
        });
        return z.NEVER;
      }

      for (const origin of origins) {
        try {
          new URL(origin);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid URL in CORS_ALLOWED_ORIGINS: ${origin}`,
          });
          return z.NEVER;
        }
      }

      return origins;
    }),
  REFRESH_COOKIE_NAME: z.string().default('app_refresh_token'),
  ADMIN_REFRESH_COOKIE_NAME: z.string().default('admin_refresh_token'),
  TRUST_PROXY: z
    .string()
    .default('false')
    .transform((value, ctx) => parseTrustProxySetting(value, ctx)),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
