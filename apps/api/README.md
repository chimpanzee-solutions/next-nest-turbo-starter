# API

**NestJS 11** backend: REST + Swagger UI at **`/api/docs`**, OpenAPI JSON at **`/api-json`**, **Prisma 7** + PostgreSQL, **Redis** / **BullMQ** / **Socket.IO** (infrastructure for future features).

**HTTP port:** **3000** by default (`PORT` in **`.env`**).

## Running from the monorepo (recommended)

From the **repository root**:

```sh
pnpm install
docker compose up -d
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env
pnpm --filter api run db:migrate
pnpm --filter api dev
```

`predev` runs **`db:generate`** (Prisma client) then **root `codegen`** (Orval client for `@repo/openapi`).

## Running only this app (from `apps/api`)

Install and env are still expected from the monorepo (`pnpm install` at repo root). From **`apps/api`**:

```sh
pnpm install          # if not already done at root
cp .env.example .env
pnpm run db:migrate   # first time / after schema changes
pnpm run dev
```

Use **`pnpm --dir ../..`** to invoke root scripts when needed, e.g. `pnpm --dir ../.. run codegen`.

## Environment

Copy **`apps/api/.env.example`** → **`.env`**.

| Variable       | Purpose                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (default in `.env.example` matches `docker-compose`: host port **7777**) |
| `REDIS_URL`    | Redis (**6379** locally)                                                                              |
| `JWT_SECRET`   | Signing secret (change in production)                                                                 |
| `PORT`         | HTTP port (default **3000**)                                                                          |

Prisma reads **`DATABASE_URL`** via **`prisma.config.ts`** (and `dotenv`).

**`tsconfig.json`** includes **`src/**/\*`** and **`prisma.config.ts`** so **`tsc`\*\* and type-aware ESLint cover the Prisma config file.

## Prisma

Schema: **`prisma/schema.prisma`**. Client output: **`generated/prisma`** (see `generator` block). Config: **`prisma.config.ts`**.

| Script                       | Command                 | When to use                                                                             |
| ---------------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `pnpm run db:generate`       | `prisma generate`       | Regenerate the Prisma client after schema changes (also runs before `build` / `predev`) |
| `pnpm run db:migrate`        | `prisma migrate dev`    | Create/apply migrations in development                                                  |
| `pnpm run db:migrate:deploy` | `prisma migrate deploy` | Apply migrations in CI/production                                                       |
| `pnpm run db:push`           | `prisma db push`        | Push schema without a migration (prototyping only)                                      |
| `pnpm run db:studio`         | `prisma studio`         | Open Prisma Studio in the browser                                                       |
| `pnpm run db:reset`          | `prisma migrate reset`  | **Dev only** — drop data, re-apply migrations                                           |

From repo root, prefix with the filter:

```sh
pnpm --filter api run db:migrate
pnpm --filter api run db:studio
```

## Build & quality

| Script           | Purpose                         |
| ---------------- | ------------------------------- |
| `pnpm run build` | `prisma generate && nest build` |
| `pnpm run tsc`   | `tsc --noEmit`                  |
| `pnpm run lint`  | ESLint (`src/**/*.ts`)          |

## OpenAPI & frontends

- Swagger UI: **`http://localhost:{PORT}/api/docs`** (default port **3000**).
- OpenAPI JSON: **`GET /api-json`** — same document the UI uses.
- **Committed spec:** **`apps/api/swagger-spec.json`** is what **Orval** reads. In **non-production** (`NODE_ENV !== 'production'`), starting the API **overwrites** that file with the current Swagger document (see **`src/main.ts`**). In **production**, nothing is written to disk.
- After you change controllers/DTOs: run the API once (or restart **`pnpm --filter api dev`**) so **`swagger-spec.json`** updates, then from the repo root run **`pnpm run codegen`** (or rely on the next **`predev`** on a frontend / API, which runs codegen **before** the server — so you may need an **extra** **`pnpm run codegen`** or a **second** dev restart to refresh **`@repo/openapi`**). Commit **`swagger-spec.json`** when the contract should be shared.

## Related

- [Root README](../../README.md) — monorepo setup, Docker, shared commands
- Next frontends use **`src/app/`** — [Admin](../admin/README.md) · [App](../app/README.md) · [Website](../website/README.md)
