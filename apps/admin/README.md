# Starter Admin

Minimal Next.js admin app for the starter template. It includes admin sign in and a simple dashboard shell.

## Run

From the monorepo root:

```sh
pnpm install
cp apps/admin/.env.example apps/admin/.env
pnpm --filter admin dev
```

## Environment

- `NEXT_PUBLIC_API_URL`: public API URL
- `NEXT_PUBLIC_ADMIN_REFRESH_COOKIE_NAME`: refresh cookie name used by admin auth helpers

Validation lives in [src/env.ts](./src/env.ts).
