# Starter Website

Simple public-facing Next.js app for the starter template.

## Run

From the monorepo root:

```sh
pnpm install
cp apps/website/.env.example apps/website/.env
pnpm --filter website dev
```

## Environment

- `NEXT_PUBLIC_API_URL`: public API URL

Validation lives in [src/env.ts](./src/env.ts).
