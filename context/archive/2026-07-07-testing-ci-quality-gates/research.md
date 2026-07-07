---
date: 2026-07-07T11:45:00+02:00
researcher: Cursor Agent
branch: main
repository: keyword-lexicanum
topic: "Rollout Phase 4 — CI quality gates"
tags: [research, testing, ci, test-plan]
status: complete
last_updated: 2026-07-07
---

# Research: CI quality gates

**Test plan**: `context/foundation/test-plan.md` Phase 4 — quality gates table

## Research Question

Which local quality gates named in test-plan §5 are missing from CI?

## Summary

`.github/workflows/ci.yml` ran `typecheck` and `test` only. `package.json` exposes `lint` (eslint) and `build` (next build) locally but CI did not invoke them — PRs could merge with ESLint errors or production build failures.

**Fix:** Add `Lint` and `Build` steps after typecheck, before/after test per gate dependency order: typecheck → lint → test → build.

No new test code required; configuration-only rollout phase.

## Code References

- `.github/workflows/ci.yml`
- `context/foundation/test-plan.md` §5 Quality Gates
