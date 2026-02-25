`@repo/flappy-gouda-game` is the orchestration layer. It composes engine + hooks + ui into the public `<FlappyGoudaGame />` component.

This package MUST NOT contain business logic (scoring, physics, collision detection). That belongs in `@repo/engine`.

Error boundaries live here. The game component MUST be wrapped in a `GameErrorBoundary` that catches rendering errors and shows an `ErrorFallback` from `@repo/ui`.

This is the only package that wires callbacks between layers:
- Engine events flow through hooks into React state.
- React state flows as props into UI components.
- UI callback props trigger engine methods via hook-provided functions.

Allowed `@repo/*` imports: `@repo/engine`, `@repo/hooks`, `@repo/ui`, `@repo/types`.
