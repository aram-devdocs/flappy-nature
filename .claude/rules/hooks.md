Files in `packages/hooks/` MUST NOT import from `@repo/ui` or `@repo/flappy-nature-game`.

Hooks MUST clean up subscriptions in useEffect return functions. Every useEffect that subscribes to an engine event MUST return a cleanup function that unsubscribes.

Hooks are bridges only -- they connect engine state to React's reactivity model. They MUST NOT contain business logic (no physics, collision, scoring). Business logic belongs in `@repo/engine`.

Allowed `@repo/*` imports: `@repo/engine` and `@repo/types` only.

Violations to check:
- `import ... from '@repo/ui'` in any file under `packages/hooks/`.
- `import ... from '@repo/flappy-nature-game'` in any file under `packages/hooks/`.
- useEffect without a cleanup return that subscribes to engine events.
- Physics calculations, scoring logic, or collision detection in hook files.
