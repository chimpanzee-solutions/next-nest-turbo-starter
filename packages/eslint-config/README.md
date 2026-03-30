# `@repo/eslint-config`

Shared **ESLint** flat configs for this monorepo: **Next.js** apps, **NestJS** API, and internal **React** libraries. Consumed as **`@repo/eslint-config`** from **`apps/*`** and **`packages/*`**.

Package export **`@repo/eslint-config/next-js`** maps to **`next.js`**: **`settings.next.rootDir`** is **`src`** so **`@next/eslint-plugin-next`** resolves **`src/app`** (avoids scanning **`apps/app/app`** when the workspace is named **`app`**).

See each workspace’s **`eslint.config.mjs`** for the import (**`next-js`**, **`nest`**, **`react-internal`**).
