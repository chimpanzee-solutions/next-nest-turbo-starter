# App

**Next.js 16** main web app (App Router under **`src/app`**, React 19, Tailwind CSS 4, shared UI via **`@repo/ui`**).

**Dev port:** **3002** (see **`package.json`** → **`dev`**).

## Running from the monorepo

From the **repository root**:

```sh
pnpm install
cp apps/app/.env.example apps/app/.env
# set NEXT_PUBLIC_API_URL (e.g. http://localhost:3000)
pnpm --filter app dev
```

**`predev`** runs root **`pnpm run codegen`** (Orval) before Next. Ensure **`apps/api/swagger-spec.json`** is up to date when you need a fresh **`@repo/openapi`** client (see [API README](../api/README.md)).

## Running only this app

Requires a **root `pnpm install`** so workspace packages resolve.

From **`apps/app`**:

```sh
cp .env.example .env
pnpm dev
```

Or from root: **`pnpm --filter app dev`**.

## Environment

| Variable              | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Public URL of the **API** (must be a valid URL). Example: **`http://localhost:3000`** |

Validated in **`src/env.ts`** (Zod).

## Stack notes

- Same workspace pattern as **admin**: **`@repo/openapi`**, **`@repo/ui`**, **`@repo/utils`**, **`transpilePackages`**, **`components.json`**, **`src/app/globals.css`** with **`@source`** for **`packages/ui`**
- **`tsconfig.json`** **`paths`** for **`@repo/*`** match **`components.json`** so the shadcn CLI resolves correctly
- **ESLint:** **`settings.next.rootDir`** is **`src`** in shared config (avoids the plugin scanning **`apps/app/app`**)

## Scripts

| Script                              | Purpose                    |
| ----------------------------------- | -------------------------- |
| **`pnpm dev`**                      | Next dev server (**3002**) |
| **`pnpm build`** / **`pnpm start`** | Production build / start   |
| **`pnpm tsc`**                      | Typecheck                  |
| **`pnpm lint`**                     | ESLint                     |

## Related

- [Root README](../../README.md)
- [API README](../api/README.md)
- [Admin](../admin/README.md) · [Website](../website/README.md)
