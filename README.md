# next-nest-turbo-starter

A **production-style monorepo template** for full-stack TypeScript apps: one **NestJS** API and **three Next.js** frontends, wired with **Turborepo**, **pnpm**, **Prisma**, **OpenAPI → Orval**, and shared internal packages.

**Use it when you want** a sane default layout to fork or clone—admin UI, main app, marketing site, and API in one repo—without spending days on wiring tooling.

## What you get

| Area | Details |
| ---- | ------- |
| **Monorepo** | [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/) workspaces |
| **API** | NestJS, Prisma, PostgreSQL, Redis (Docker), Swagger at `/api/docs`, OpenAPI JSON for codegen |
| **Frontends** | Next.js (App Router), React 19 — **admin** (3001), **app** (3002), **website** (3003) |
| **Shared UI** | `@repo/ui` + `@repo/utils` (admin + app); website uses Tailwind + `@repo/openapi` only |
| **API client** | [Orval](https://orval.dev/) generates **TanStack React Query** hooks into `@repo/openapi` from the checked-in OpenAPI spec |
| **Quality** | Shared ESLint + TypeScript configs, Prettier, Husky + lint-staged on commit |

## Naming this repo

Good GitHub names (pick one style and stay consistent):

| Name | Why |
| ---- | --- |
| **`next-nest-turbo-starter`** | Short, searchable, stack is obvious (matches this template’s `package.json` **name**). |
| `turborepo-nextjs-nestjs-starter` | Very explicit; longer. |
| `fullstack-next-nest-template` | Product-agnostic; less mention of Turborepo. |

After you clone, rename the folder if you like (`mv next-nest-turbo-starter my-product`). Update **metadata** only where it still says “Starter” (Next.js `metadata` in `apps/*/src/app/layout.tsx`, Swagger title in `apps/api`, etc.) when you brand your app.

## Quick reference — dev URLs

| Service | Port (default) |
| ------- | ---------------- |
| API | [http://localhost:3000](http://localhost:3000) |
| Swagger UI | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |
| Admin | [http://localhost:3001](http://localhost:3001) |
| App | [http://localhost:3002](http://localhost:3002) |
| Website | [http://localhost:3003](http://localhost:3003) |
| Postgres (host) | `localhost:7777` → container `5432` |
| Redis | `localhost:6379` |

## Clone

```sh
git clone https://github.com/<your-username-or-org>/next-nest-turbo-starter.git
cd next-nest-turbo-starter
```

Replace the URL with your fork’s remote after you publish the repo.

## Prerequisites

| Tool | Notes |
| ---- | ----- |
| **Node.js** | **≥ 24.14.1** (see root **`package.json`** → **`engines`**) |
| **pnpm** | **9.x** — `corepack enable` then `corepack prepare pnpm@9.0.0 --activate` |
| **Docker** | For Postgres + Redis (`docker compose`) |

## Repository layout

| Path | Role |
| ---- | ---- |
| [`apps/api`](./apps/api/README.md) | NestJS, Prisma, OpenAPI **`/api-json`**, Swagger **`/api/docs`** |
| [`apps/admin`](./apps/admin/README.md) | Admin UI (Next.js **3001**, **`@repo/ui`** + **`@repo/openapi`**) |
| [`apps/app`](./apps/app/README.md) | Main product app (Next.js **3002**, **`@repo/ui`** + **`@repo/openapi`**) |
| [`apps/website`](./apps/website/README.md) | Marketing site (Next.js **3003**, **`@repo/openapi`** only — no **`@repo/ui`**) |
| [`packages/openapi`](./packages/openapi/README.md) | Orval output → **`@repo/openapi`** |
| `packages/ui` / `packages/utils` | Shared UI (admin + app), **`cn()`** helpers |
| `packages/eslint-config` / `packages/typescript-config` | Shared ESLint + TypeScript bases |

## First-time setup

1. **Infra** — Postgres + Redis (API expects both):

   ```sh
   docker compose up -d
   ```

   Postgres: **`localhost:7777`** maps to **`5432`** in the container. Redis: **`6379`**. See [`docker-compose.yml`](./docker-compose.yml).

2. **Env** — from the repo root:

   ```sh
   cp apps/api/.env.example apps/api/.env
   cp apps/admin/.env.example apps/admin/.env
   cp apps/app/.env.example apps/app/.env
   cp apps/website/.env.example apps/website/.env
   ```

   Details: [App documentation](#app-documentation).

3. **Install**

   ```sh
   pnpm install
   ```

   Root **`prepare`** runs **Husky** (git hooks). On commit, **`lint-staged`** runs **`pnpm run format`**, **`pnpm run lint`**, and **`pnpm run tsc`** (see **`package.json`** → **`lint-staged`**). Extra path arguments from **lint-staged** are ignored by the **`sh -c`** wrapper.

4. **Database (API)** — from repo root:

   ```sh
   pnpm --filter api run db:migrate
   ```

   **`db:generate`** runs as part of API **`build`** / **`predev`**. See [API README](./apps/api/README.md).

5. **OpenAPI spec for Orval** — [`apps/api/swagger-spec.json`](./apps/api/swagger-spec.json) is checked in and is refreshed automatically when you run the API in development (**`NODE_ENV !== 'production'`** writes the file; see [API README](./apps/api/README.md)). Then:

   ```sh
   pnpm run codegen
   ```

   Run **`codegen`** after the spec file changes so **`@repo/openapi`** matches the API.

6. **Develop**

   ```sh
   pnpm dev
   ```

   One app: **`pnpm --filter api dev`**, **`pnpm --filter admin dev`**, **`pnpm --filter app dev`**, **`pnpm --filter website dev`**.

## Root scripts

| Script | Purpose |
| ------ | ------- |
| **`pnpm dev`** | **`turbo run dev`** — all workspaces that define `dev` |
| **`pnpm build`** | Production builds |
| **`pnpm lint`** | ESLint across workspaces |
| **`pnpm tsc`** | Typecheck across workspaces |
| **`pnpm format`** | Prettier (repo-wide; globs in root **`package.json`**) |
| **`pnpm run codegen`** | **`turbo run codegen`** — Orval in **`@repo/openapi`** |

## API client (Orval)

Config: **`packages/openapi/orval.config.ts`**. Input: **`apps/api/swagger-spec.json`**. **`pnpm run codegen`** refreshes **`@repo/openapi`**. Next apps (and the API **`predev`**) run **`codegen` before** the dev server; the API also **writes `swagger-spec.json` on boot** in dev — see [API README](./apps/api/README.md) for the recommended refresh workflow.

## Shared config

- **Next.js layout:** **`admin`**, **`app`**, and **`website`** use the App Router under **`src/app/`** (and env validation in **`src/env.ts`** where present). Do **not** keep a top-level **`app/`** folder alongside **`src/app/`** — Next will use the empty root **`app/`** and **`/`** will 404. Static assets such as **`favicon.ico`** live under **`src/app/`**. The alias **`@/*`** → **`./src/*`** in each app’s **`tsconfig.json`**. If **`pnpm tsc`** complains about **`.next/types`** after you move files, delete that app’s **`.next`** folder (or run **`pnpm dev`** once) so Next regenerates types.
- **TypeScript:** Next apps → **`@repo/typescript-config/nextjs.json`**; API → **`nestjs.json`**; libraries → **`react-library.json`** where used.
- **ESLint:** **`@repo/eslint-config`** (Next, Nest, internal React).
- **Prettier:** Root **`prettier.config.mjs`** and **`.prettierignore`**.
- **shadcn (admin + app):** Run **`pnpm exec shadcn add …`** from **`apps/admin`** or **`apps/app`**. Those **`components.json`** files use **`@repo/ui`** / **`@repo/utils`**; **`tsconfig.json`** must include matching **`paths`** so the CLI can resolve aliases (see each app README). Prefer **`src/lib`** / **`src/components`** via **`@/*`** → **`./src/*`**; empty top-level **`components/`** / **`lib/`** next to **`src/`** are unnecessary.

## App documentation

| App | README |
| --- | ------ |
| **API** (Nest, Prisma, env, DB scripts, OpenAPI) | [**apps/api/README.md**](./apps/api/README.md) |
| **Admin** (Next **3001**, **`@repo/ui`**) | [**apps/admin/README.md**](./apps/admin/README.md) |
| **App** (Next **3002**, **`@repo/ui`**) | [**apps/app/README.md**](./apps/app/README.md) |
| **Website** (Next **3003**, OpenAPI only, no shared UI) | [**apps/website/README.md**](./apps/website/README.md) |

## License

Add a **`LICENSE`** file in your fork (e.g. MIT) if you publish this template publicly.
