TDD is mandatory for all feature work. Follow the RED -> GREEN -> REFACTOR -> VERIFY pipeline.

Coverage requirements:
- Minimum 80% across lines, branches, functions, statements.
- Target 100% for all packages.

Rules:
- No `test.skip()` or `test.todo()` without a documented reason in a comment.
- Use mock factories for test data (see `makeBird()`, `makeConfig()`, `makePipe()` patterns in engine tests).
- Follow AAA pattern: Arrange, Act, Assert. Each test section should be visually separated.
- Engine tests MUST NOT depend on DOM APIs. Mock canvas context when needed.
- UI tests use @testing-library/react with `render()` and `screen` queries.
- Hook tests use `renderHook()` from @testing-library/react.
- Integration tests in `@repo/flappy-nature-game` mock the canvas context.
