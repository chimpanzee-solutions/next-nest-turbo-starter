# Admin

**Next.js 16** admin UI (App Router under **`src/app`**, React 19, Tailwind CSS 4, shadcn-style components via **`@repo/ui`**).

**Dev port:** **3001** (see **`package.json`** → **`dev`**).

## Running from the monorepo

From the **repository root**:

```sh
pnpm install
cp apps/admin/.env.example apps/admin/.env
# set NEXT_PUBLIC_API_URL (e.g. http://localhost:3000)
pnpm --filter admin dev
```

**`predev`** runs root **`pnpm run codegen`** (Orval) before Next. Ensure **`apps/api/swagger-spec.json`** exists; refresh it by running the API in dev when the contract changes, then run **`pnpm run codegen`** again if needed (see [API README](../api/README.md)).

## Running only this app

Requires a **root `pnpm install`** so workspace packages resolve.

From **`apps/admin`**:

```sh
cp .env.example .env
pnpm dev
```

Or from root: **`pnpm --filter admin dev`**.

## Environment

| Variable              | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Public URL of the **API** (must be a valid URL). Example: **`http://localhost:3000`** |

Validated in **`src/env.ts`** (Zod). Next.js inlines **`NEXT_PUBLIC_*`** at build time.

## Stack notes

- Imports **`@repo/openapi`**, **`@repo/ui`**, **`@repo/utils`**
- **`next.config.ts`**: **`transpilePackages`** includes **`@repo/openapi`**, **`@repo/ui`**, **`@repo/utils`**
- **`components.json`**: shadcn **`tailwind.css`** → **`src/app/globals.css`**; component aliases → **`@repo/ui`**
- **`tsconfig.json`**: **`@/*`** → **`./src/*`**; explicit **`paths`** for **`@repo/utils`** and **`@repo/ui/components`** so **`pnpm exec shadcn add …`** can resolve aliases (avoid **`resolvedPaths`** errors)
- **ESLint:** shared **`@repo/eslint-config`** Next config sets **`settings.next.rootDir`** to **`src`** (see **`packages/eslint-config`** README)
- Global styles: **`src/app/globals.css`** — **`@source`** into **`packages/ui`** for Tailwind

## Scripts

| Script                              | Purpose                    |
| ----------------------------------- | -------------------------- |
| **`pnpm dev`**                      | Next dev server (**3001**) |
| **`pnpm build`** / **`pnpm start`** | Production build / start   |
| **`pnpm tsc`**                      | Typecheck                  |
| **`pnpm lint`**                     | ESLint                     |

## Related

- [Root README](../../README.md)
- [API README](../api/README.md)
- [App](../app/README.md) · [Website](../website/README.md)
