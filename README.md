# Next Nest Turbo Starter

Monorepo starter built with Turborepo and pnpm. It includes a NestJS API, three Next.js apps, shared UI packages, authentication flows, organization switching, and billing foundations.

## Apps

- `apps/api`: NestJS API with Prisma, Swagger, and auth/billing modules
- `apps/admin`: minimal admin app
- `apps/app`: authenticated end-user app
- `apps/website`: simple public site

## Quick start

```sh
docker compose up -d
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/app/.env.example apps/app/.env
cp apps/website/.env.example apps/website/.env
pnpm install
pnpm --filter api run db:push
pnpm --filter api run db:seed
pnpm dev
```

## Useful commands

- `pnpm dev`: run all workspace dev scripts
- `pnpm build`: build all workspaces
- `pnpm lint`: lint all workspaces
- `pnpm tsc`: typecheck all workspaces
- `pnpm run codegen`: regenerate `@repo/openapi` from `apps/api/swagger-spec.json`

## Starter scope

- Auth tables: users, refresh tokens, password reset tokens, roles, permissions, user roles
- Organization tables: organizations and organization memberships
- Billing tables: plans, subscriptions, invoices, invoice items, transactions, subscription plan history

Everything specific to the previous product domain has been removed so this repo can be reused as a general SaaS starter.
