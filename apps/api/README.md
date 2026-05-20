# Starter API

NestJS backend for the starter template. It ships with auth, organization membership, and billing primitives, plus Swagger and a committed OpenAPI spec.

## Run

From the monorepo root:

```sh
pnpm install
docker compose up -d
cp apps/api/.env.example apps/api/.env
pnpm --filter api run db:push
pnpm --filter api run db:seed
pnpm --filter api dev
```

## Environment

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: signing key for access and refresh tokens
- `JWT_ACCESS_EXPIRES_IN`: access token TTL
- `JWT_REFRESH_EXPIRES_IN`: refresh token TTL when remember-me is enabled
- `JWT_REFRESH_SESSION_EXPIRES_IN`: refresh token TTL for session-only logins
- `PASSWORD_RESET_EXPIRES_IN`: password reset TTL
- `APP_PUBLIC_URL`: public URL for `apps/app`
- `CORS_ALLOWED_ORIGINS`: allowed web origins
- `REFRESH_COOKIE_NAME`: app refresh cookie name
- `ADMIN_REFRESH_COOKIE_NAME`: admin refresh cookie name
- `TRUST_PROXY`: Express trust proxy setting
- `PORT`: API port

Validation lives in [src/env.ts](./src/env.ts).

## Database

- Schema: [prisma/schema.prisma](./prisma/schema.prisma)
- Initial migration: [prisma/migrations/20260424211723_init/migration.sql](./prisma/migrations/20260424211723_init/migration.sql)
- Seed entry: [prisma/seed.ts](./prisma/seed.ts)

Useful scripts:

- `pnpm --filter api run db:generate`
- `pnpm --filter api run db:push`
- `pnpm --filter api run db:seed`
- `pnpm --filter api run db:reset`

## Seed data

The seed creates:

- sample billing plans
- a platform admin account from [prisma/seed/initial-seed.ts](./prisma/seed/initial-seed.ts)
- one sample organization and owner account
- no default permissions

Change those defaults before using this starter in a real project.

## Auth endpoints

- `POST /api/auth/admin/login`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/admin/session`
- `POST /api/auth/session`
- `POST /api/auth/admin/refresh`
- `POST /api/auth/refresh`
- `POST /api/auth/admin/logout`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## OpenAPI

- Swagger UI: `/docs`
- JSON: `/api-json`
- Committed spec: [swagger-spec.json](./swagger-spec.json)

Run `pnpm run codegen` from the repo root after API contract changes.
