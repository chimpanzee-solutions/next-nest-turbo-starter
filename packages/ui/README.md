# `@repo/ui`

Shared UI primitives for the web apps.

## Overview

- Built on shadcn-style component structure, Tailwind CSS, and small utility wrappers
- Exported as a package for `apps/app` and `apps/admin`
- Includes shared form helpers that integrate with React Hook Form while keeping validation in the consuming app

## Import convention

Consumers should import from the package root:

```ts
import { Button, Card, FormInputField } from '@repo/ui';
```

Avoid importing from internal component paths in app code unless a subpath is intentionally exposed for a specific reason.

## Scope

This package should contain:

- reusable visual primitives
- shared auth/form field wrappers
- shared utility exports used by UI components

It should not contain app-specific page composition or business logic.

## Related

- [Root README](../../README.md)
