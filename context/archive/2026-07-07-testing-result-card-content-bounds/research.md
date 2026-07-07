---
date: 2026-07-07T11:30:00+02:00
researcher: Cursor Agent
branch: main
repository: keyword-lexicanum
topic: "Rollout Phase 3 — result card content bounds (Risk #4)"
tags: [research, testing, component, test-plan]
status: complete
last_updated: 2026-07-07
---

# Research: Result card content bounds

**Test plan**: `context/foundation/test-plan.md` Phase 3 — Risk #4

## Research Question

What props and UI states in the lookup result card could leak excessive text or debug-like values on a phone browser?

## Summary

`LookupResultCard` (`src/components/LookupResultCard.tsx`) renders keyword, phase banner, explanation, and a collapsible citation block. Citation is hidden until the user expands "Source & page link" (`citationExpanded` state, default `false`). Not-found branch uses `role="status"` with explicit copy — no fabricated rules.

`CitationBlock` renders a link + PDF hint only when expanded; no raw `corpusVersion` or internal fields in props surface in the default view.

**Cheapest layer:** React Testing Library component tests with jsdom. Vitest previously used Node-only environment — add `vitest.setup.ts`, `@testing-library/react`, `environmentMatchGlobs` for `*.test.tsx`.

## Recommended tests

| # | Assertion | Proves |
|---|-----------|--------|
| T1 | Citation link absent when collapsed | Minimal default view |
| T2 | Expand button reveals link | User-controlled detail |
| T3 | No `undefined`/`null` in DOM for hit and miss | No debug leakage |
| T4 | `corpusVersion` not rendered in card body | Internal metadata hidden |

## Code References

- `src/components/LookupResultCard.tsx`
- `src/components/CitationBlock.tsx`
- `src/components/LookupResultCard.test.tsx`
