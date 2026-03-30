# `@repo/openapi`

Orval-generated **TanStack React Query** client for the NestJS API.

- **Input:** [`apps/api/swagger-spec.json`](../../apps/api/swagger-spec.json) (see [API README](../../apps/api/README.md) for how it is produced).
- **Config:** [`orval.config.ts`](./orval.config.ts), [`src/create-orval-config.ts`](./src/create-orval-config.ts).
- **Output:** [`src/generated.ts`](./src/generated.ts) (package **`exports`**); HTTP calls go through [`src/api-client.ts`](./src/api-client.ts) (`fetch` + **`NEXT_PUBLIC_API_URL`** from the consuming Next app).

From the repo root: **`pnpm run codegen`** (or **`pnpm --filter @repo/openapi run codegen`**).
