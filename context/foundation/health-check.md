---
project: keyword-lexicanum
checked_at: 2026-06-24T23:40:00Z
health_status: healthy
context_type: brownfield
language_family: js
stack_assessment_available: true
checks_run:
  - lockfile
  - dependency_audit
  - outdated_deps
  - test_runner
  - ci_cd
  - configuration
audit_findings:
  critical: 0
  high: 0
  moderate: 2
  low: 0
test_runner_detected: true
ci_provider: GitHub Actions
recommended_fixes: 5
---

## Dependency Health

### Lockfile

Status: present (`package-lock.json`)
Package manager: npm

### Security Audit

Tool: `npm audit --json`
Summary: 0 CRITICAL, 0 HIGH, 2 MODERATE, 0 LOW
Direct vs transitive: 1 direct (`next`), 1 transitive (`postcss` via dependency chain)

MODERATE findings (2):

- **next** 16.2.9 — advisory range 9.3.4-canary.0–16.3.0-canary.5; PostCSS-related chain. Fix: upgrade Next when a patched stable release is available beyond the advisory range.
- **postcss** &lt;8.5.10 — PostCSS XSS via unescaped `</style>` in CSS stringify output (transitive). Fix: resolves when parent dependencies pull postcss ≥8.5.10.

### Outdated Dependencies

Packages with major version gaps: 4

- **typescript**: 5.3.3 → 6.0.3 (1 major behind latest; `package.json` allows `^5`)
- **eslint**: 9.39.4 → 10.6.0 (1 major behind)
- **vitest**: 3.2.6 → 4.1.9 (1 major behind)
- **@types/node**: 20.19.43 → 26.0.1 (6 majors behind latest; dev-only)

Minor/patch gaps only: `react`, `react-dom` (19.2.4 → 19.2.7).

## Test Suite

Test runner: Vitest 3.2.6
Tests found: 49 tests in 5 files
Test execution: passing

Configuration: `vitest.config.ts`
Framework: Vitest with Node environment; `@/` and corpus aliases mirror `tsconfig.json` / `next.config.ts`.

## CI/CD

Provider: GitHub Actions
Configuration: `.github/workflows/ci.yml`

| Stage      | Status | Notes                                      |
|------------|--------|--------------------------------------------|
| Lint       | ✗      | `npm run lint` not in workflow             |
| Test       | ✓      | `npm test` (Vitest)                        |
| Build      | ✗      | `npm run build` not in workflow            |
| Type check | ✓      | `npm run typecheck` (`tsc --noEmit`)       |
| Security   | ✗      | No audit / Dependabot step                 |

CI runs on push and pull_request to `main` with Node 22 and npm cache.

## Configuration

### High severity

None detected.

### Medium severity

- **Prettier / formatter** — ESLint is configured (`eslint.config.mjs`) but no Prettier or Biome. Agent-generated formatting may drift. Fix: add Prettier or document "ESLint only" as intentional in `AGENTS.md` (currently ESLint-only).

### Low severity

- **`.editorconfig`** — missing. Cross-editor indentation may vary. Fix: add `.editorconfig` with 2-space indent for TS/TSX/JSON.
- **CI lint step** — local `npm run lint` exists but CI does not run it. Fix: add lint step to `.github/workflows/ci.yml` when ready (Category B for course chain).

Present and healthy: `tsconfig.json` (`strict: true`), `eslint.config.mjs`, `.gitignore` (includes `src/data/local/`, `.env*.local`), `.env.local.example`, root `README.md`.

## Stack Assessment Cross-Reference

Stack assessment: `context/foundation/stack-assessment.md`
Agent readiness (from stack-assess): ready

| Quality Gate Gap | Health-Check Finding | Status |
|------------------|----------------------|--------|
| (none — all gates pass) | Typecheck enforced in CI | Reinforced |
| (none) | 49 passing Vitest tests | Reinforced |
| (none) | AGENTS.md updated with distribution hard rules | Mitigated |

No stack-assessment gaps require operational compensation. Health-check adds operational polish items (lint in CI, moderate audit advisories) independent of stack choice.

## Recommended Fixes

### Fix before agent work (Category A)

### 1. Review moderate npm audit advisories

**Impact**: Transitive PostCSS advisory affects the build toolchain; agents should not ignore security context when bumping Next.js.
**Severity**: medium
**Effort**: quick (< 5 min to assess; moderate if upgrade needed)
**Fix**:

```powershell
npm audit
npm outdated next
```

Upgrade Next.js when a stable release outside the advisory range is published; re-run `npm test` and `npm run build` after bump.

### 2. Pin TypeScript within semver range

**Impact**: Installed TypeScript 5.3.3 is below the `^5` range ceiling (5.9.3 wanted). Older compiler may miss newer lib checks agents assume.
**Severity**: low
**Effort**: quick
**Fix**:

```powershell
npm update typescript
npm run typecheck
```

### Addressed in upcoming lessons (Category B)

### CI lint and build stages

**Lesson**: Sprint Zero z Agentem: infrastruktura, walking skeleton i pierwszy deploy (M1L5)
**What you'll do there**: Extend GitHub Actions with lint and production build steps so PRs catch ESLint and Next.js build failures before merge.

### Security scanning in CI

**Lesson**: Sprint Zero z Agentem: infrastruktura, walking skeleton i pierwszy deploy (M1L5)
**What you'll do there**: Add Dependabot or `npm audit` in CI for ongoing dependency monitoring.

## Summary

Health status: **healthy**

The project has a pinned lockfile, zero critical/high vulnerabilities, a working Vitest suite (49/49 passing), strict TypeScript, and CI enforcing typecheck and tests. Two moderate audit advisories and missing lint/build CI stages are addressable without blocking agent work. Stack assessment rated the toolchain **ready** with no compensation gaps.

Next step: use the updated `AGENTS.md` for agent onboarding; optionally add lint to CI and bump Next.js when a patched stable release is available.
