# @repo/config -- Package Guide

Shared build and tool configuration consumed by other packages in the monorepo.

## Hard Constraints

- MUST NOT contain runtime code. This package only exports configuration files.
- MUST NOT depend on any `@repo/*` package.
- MUST NOT have runtime dependencies.

## Contents

- `tsconfig/` -- Shared TypeScript configuration bases (`base.json`, `react.json`, etc.)

## Usage

Other packages reference these configs via `extends`:

```json
{
  "extends": "@repo/config/tsconfig/base.json"
}
```

## What Does NOT Belong Here

- Runtime utilities, helpers, or shared code -- those belong in `@repo/types` or a dedicated package.
- Package-specific configuration that only one consumer uses.
