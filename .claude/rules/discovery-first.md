Before modifying ANY file in this codebase:

1. Read the current source file to understand existing patterns and conventions.
2. Check `@repo/types` for relevant type definitions -- do not duplicate or shadow them.
3. Run existing tests for the package (`pnpm test --filter=@repo/{package}`) to confirm they pass.
4. Identify existing patterns (naming, exports, error handling) and follow them consistently.

Never write blind. Discovery-first prevents:
- Duplicating types that already exist.
- Breaking existing patterns with inconsistent code.
- Introducing regressions by not running tests first.
- Violating dependency rules by not checking the architecture.
