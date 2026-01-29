# Development Rules

## Testing Rule
Every new feature/change must include tests and verification steps.

### Required for each step
- Add at least one relevant test (unit/integration/e2e as appropriate)
- Run the test locally or document the command to verify

## Current verification commands
- Unit tests: `pnpm -C apps/api test`
- E2E seed test: `pnpm -C apps/api test:e2e`

## Pre-push Automation
A pre-push hook runs the local CI checks before any push:
- `pnpm ci:local`
