# `@repo/web-utils`

Shared frontend utility helpers for the web apps.

## Overview

This package holds small reusable helpers that do not belong to a specific app UI surface.

Current exports include:

- `cn` for class name composition
- date/time formatting helpers

Import from the package root:

```ts
import { cn, formatDate } from '@repo/web-utils';
```

## Scope

This package should stay focused on lightweight reusable helpers.

It should not contain:

- app-specific business logic
- page-level UI components
- server-only code

## Related

- [Root README](../../README.md)
