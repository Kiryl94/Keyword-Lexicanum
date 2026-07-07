# Result Card Content Bounds — Implementation Plan

## Overview

Add RTL component tests and Vitest jsdom wiring for Risk #4. Update test-plan §6.3 cookbook.

## Desired End State

- `src/components/LookupResultCard.test.tsx` — 5 passing tests.
- `vitest.setup.ts` with jest-dom matchers and DOM cleanup.
- DevDependencies: `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react@4`.
- Phase 3 rollout status → `complete`.

## Phase 1: Test infrastructure

- Add devDependencies and `vitest.config.ts` jsdom glob for `*.test.tsx`.
- Add `vitest-env.d.ts` for TypeScript matcher types.

## Phase 2: LookupResultCard tests

- Collapsed citation by default; expand on click.
- Hit and miss states free of debug strings.
- Internal `corpusVersion` not shown in rendered output.

## Progress

- [x] 1.1 RTL + jsdom Vitest setup
- [x] 1.2 vitest-env.d.ts for typecheck
- [x] 2.1 LookupResultCard.test.tsx (5 tests)
- [x] 2.2 test-plan §6.3 cookbook updated
