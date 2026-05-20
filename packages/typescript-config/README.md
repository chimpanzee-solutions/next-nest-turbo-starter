# `@repo/typescript-config`

Shared **TypeScript** `extends` bases for the monorepo.

| File                 | Typical consumer                                        |
| -------------------- | ------------------------------------------------------- |
| `base.json`          | Libraries                                               |
| `nextjs.json`        | Next.js apps (`apps/admin`, `apps/app`, `apps/website`) |
| `nestjs.json`        | Nest API (`apps/api`)                                   |
| `react-library.json` | React packages (e.g. `@repo/ui`)                        |

Each app or package sets `"extends": "@repo/typescript-config/<file>.json"` in its **`tsconfig.json`**.

## Related

- [Root README](../../README.md)
