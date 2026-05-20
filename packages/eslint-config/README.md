# `@repo/eslint-config`

Shared **ESLint** flat configs for this monorepo.

| Package subpath                      | Use                                     |
| ------------------------------------ | --------------------------------------- |
| `@repo/eslint-config/next-js`        | Next.js apps (`src/app`, App Router)    |
| `@repo/eslint-config/nest`           | NestJS API                              |
| `@repo/eslint-config/react-internal` | Shared React packages (e.g. `@repo/ui`) |

Each workspace imports the preset in **`eslint.config.mjs`**. The Next preset sets **`settings.next.rootDir`** to **`src`** so the Next ESLint plugin resolves `src/app` correctly.

## Conventions

- TypeScript files use **`@typescript-eslint/no-unused-vars`**.
- Plain JS files use the core **`no-unused-vars`** rule.
- Names that intentionally start with **`_`** are ignored in both cases.

## Related

- [Root README](../../README.md)
