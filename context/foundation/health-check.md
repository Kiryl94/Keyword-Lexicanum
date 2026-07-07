---
project: keyword-lexicanum
checked_at: 2026-07-07T10:00:00Z
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
recommended_fixes: 2
---

## Dependency Health

### Lockfile

Status: present (`package-lock.json`)
Package manager: npm

### Security Audit

Tool: `npm audit --json`
Summary: 0 CRITICAL, 0 HIGH, 2 MODERATE, 0 LOW (last assessed 2026-07-07)
Direct vs transitive: 1 direct (`next`), 1 transitive (`postcss` via dependency chain)

MODERATE findings (2):

- **next** 16.2.9 — advisory range 9.3.4-canary.0–16.3.0-canary.5; PostCSS-related chain. Fix: upgrade Next when a patched stable release is available beyond the advisory range.
- **postcss** &lt;8.5.10 — PostCSS XSS via unescaped `</style>` in CSS stringify output (transitive). Fix: resolves when parent dependencies pull postcss ≥8.5.10.

Dependabot: `.github/dependabot.yml` — weekly npm updates (added 2026-07-07).

### Outdated Dependencies

Packages with major version gaps: 4

- **typescript**: 5.x → 6.x (dev-only; stay on 5 until Next/Vitest ecosystem confirms TS 6)
- **eslint**: 9.x → 10.x
- **vitest**: 3.x → 4.x
- **@types/node**: 20.x → 26.x (dev-only)

Minor/patch gaps only: `react`, `react-dom` (19.2.4 → 19.2.7).

## Test Suite

Test runner: Vitest 3.2.6
Tests found: 71 tests in 8 files
Test execution: passing

Configuration: `vitest.config.ts`, `vitest.setup.ts`
Framework: Vitest with Node + jsdom (`src/**/*.test.tsx`); React Testing Library for component tests.

## CI/CD

Provider: GitHub Actions
Configuration: `.github/workflows/ci.yml`

| Stage      | Status | Notes                                      |
|------------|--------|--------------------------------------------|
| Lint       | ✓      | `npm run lint`                             |
| Test       | ✓      | `npm test` (Vitest, 71 tests)              |
| Build      | ✓      | `npm run build` (Next.js production)       |
| Type check | ✓      | `npm run typecheck` (`tsc --noEmit`)       |
| Security   | partial | Dependabot weekly; no `npm audit` CI step |

CI runs on push and pull_request to `main` with Node 22 and npm cache.

## Configuration

### High severity

None detected.

### Medium severity

- **Prettier / formatter** — ESLint only; no Prettier/Biome. Documented as intentional in `AGENTS.md`.

### Low severity

None blocking. `.editorconfig` added 2026-07-07 for cross-editor indentation.

Present and healthy: `tsconfig.json` (`strict: true`), `eslint.config.mjs`, `.gitignore` (includes `src/data/local/`, `.env*.local`), `.env.local.example`, root `README.md`, `vitest-env.d.ts`.

## Stack Assessment Cross-Reference

Stack assessment: `context/foundation/stack-assessment.md`
Agent readiness (from stack-assess): ready

| Quality Gate Gap | Health-Check Finding | Status |
|------------------|----------------------|--------|
| (none — all gates pass) | Typecheck + lint + test + build in CI | Reinforced |
| (none) | 71 passing Vitest tests incl. component layer | Reinforced |
| (none) | AGENTS.md + distribution-policy hard rules | Mitigated |

## Recommended Fixes

### Fix before agent work (Category A)

### 1. Review moderate npm audit advisories

**Impact**: Transitive PostCSS advisory affects the build toolchain.
**Severity**: medium
**Effort**: quick to assess; moderate if upgrade needed
**Fix**:

```powershell
npm audit
npm outdated next
```

Upgrade Next.js when a stable release outside the advisory range is published; re-run `npm test` and `npm run build` after bump.

### Addressed in upcoming lessons (Category B)

### npm audit in CI

**What you'll do there**: Optional non-blocking `npm audit --audit-level=high` step once moderate advisories are cleared or accepted.

## Summary

Health status: **healthy**

The project has a pinned lockfile, zero critical/high vulnerabilities, 129 passing tests (unit + integration + component), strict TypeScript, and CI enforcing typecheck, lint, test, and production build. MVP roadmap and test-plan rollouts are complete. Remaining work is product-led (SRD corpus expansion, M3L2 tests) rather than infrastructure blockers.

Next step: SRD corpus expansion (S-16) and M3L2 test authoring. WH40k and StarCraft stay Demo (sample corpora); publisher outreach (S-15) dropped for now.
