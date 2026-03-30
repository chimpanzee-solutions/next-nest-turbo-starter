# Website

**Next.js 16** public / marketing site (App Router under **`src/app`**, React 19, **Tailwind CSS 4**). Uses **`@repo/openapi`** and **TanStack Query** only — **not** **`@repo/ui`**.

**Dev port:** **3003**

## Monorepo (from root)

```sh
pnpm install
cp apps/website/.env.example apps/website/.env
pnpm --filter website dev
```

**`predev`** runs root **`pnpm run codegen`** (Orval). Keep **`apps/api/swagger-spec.json`** in sync when the API contract changes.

## This app only

From **`apps/website`** (after a root **`pnpm install`**):

```sh
cp .env.example .env
pnpm dev
```

## Environment

| Variable              | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | API base URL (e.g. **`http://localhost:3000`** — must be a valid URL) |

Validated in **`src/env.ts`** (Zod).

## Stack notes

- **`transpilePackages`**: **`@repo/openapi`** only
- **`tsconfig.json`**: **`baseUrl`** + **`@/*`** → **`./src/*`**
- Global styles: **`src/app/globals.css`** — Tailwind only (no shared UI package)

## Scripts

| Script                              | Purpose                    |
| ----------------------------------- | -------------------------- |
| **`pnpm dev`**                      | Next dev server (**3003**) |
| **`pnpm build`** / **`pnpm start`** | Production build / start   |
| **`pnpm tsc`**                      | Typecheck                  |
| **`pnpm lint`**                     | ESLint                     |

## Related

- [Root README](../../README.md)
- [API README](../api/README.md)
