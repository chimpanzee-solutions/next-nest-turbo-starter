# Starter App

Authenticated Next.js app for the starter template. It includes sign in, sign up, forgot password, reset password, organization selection, and a minimal dashboard shell.

## Run

From the monorepo root:

```sh
pnpm install
cp apps/app/.env.example apps/app/.env
pnpm --filter app dev
```

## Environment

- `NEXT_PUBLIC_API_URL`: public API URL
- `NEXT_PUBLIC_REFRESH_COOKIE_NAME`: refresh cookie name used by auth helpers

Validation lives in [src/env.ts](./src/env.ts).

## Notes

- Password reset links depend on `APP_PUBLIC_URL` in `apps/api`
- Generated API types come from `@repo/openapi`
- The dashboard and organization selection screens are intentionally minimal starter placeholders
