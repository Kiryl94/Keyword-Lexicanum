---
project: keyword-lexicanum
assessed_at: 2026-06-24T23:40:00Z
agent_readiness: ready
context_type: brownfield
stack_components:
  language: TypeScript
  framework: Next.js 16 (App Router)
  build_tool: Next.js (Turbopack dev / webpack production)
  test_runner: Vitest 3
  package_manager: npm
  ci_provider: GitHub Actions
  deployment_target: Vercel
gates_passed: 11
gates_failed: 0
---

## Stack Components

**Language — TypeScript 5** with `strict: true` in `tsconfig.json`. Source lives under `src/**/*.ts` and `src/**/*.tsx`; corpus build scripts use Node ESM (`.mjs`) without TypeScript. Path alias `@/*` → `src/*` is configured; WH40k/StarCraft corpus paths resolve to sample JSON via tsconfig and `next.config.ts` aliases.

**Framework — Next.js 16.2.9** with React 19 and the App Router (`src/app/`). Client-only lookup UI; no API routes. State via Zustand in `src/store/session.ts`. Tailwind CSS v4 for styling.

**Build tool — Next.js** bundles the app (`npm run build`). Corpus pipelines are separate Node scripts in `scripts/` invoked via npm scripts (`corpus:build-*`).

**Test runner — Vitest 3** configured in `vitest.config.ts` with Node environment and the same `@/` aliases as production. 49 tests across `src/` and `scripts/`.

**Package manager — npm** with `package-lock.json` present.

**CI/CD — GitHub Actions** (`.github/workflows/ci.yml`): `npm ci`, typecheck, test on push/PR to `main`.

**Deployment — Vercel** (live at https://keyword-lexicanum.vercel.app). No `vercel.json`; Next.js preset auto-detected.

## Quality Gate Assessment

| Component   | Typed | Convention | Training Data | Documented | Verdict |
|-------------|-------|------------|---------------|------------|---------|
| Language    | ✓     | —          | —             | —          | pass    |
| Framework   | —     | ✓          | ✓             | ✓          | pass    |
| Build tool  | —     | ✓          | ✓             | ✓          | pass    |
| Test runner | —     | ~          | ✓             | ✓          | pass    |

Legend: ✓ = pass, ✗ = fail, ~ = partial, — = not applicable

### Gate Details

**Typed — pass.** `tsconfig.json` sets `"strict": true`, `"noEmit": true`, and includes only `src/**/*.ts(x)`. Evidence: strict compiler options; `npm run typecheck` runs `tsc --noEmit`.

**Convention-based — pass (framework & build).** Next.js App Router defines file-based routing (`src/app/page.tsx`, `lookup/page.tsx`, `phases/page.tsx`), layout conventions, and config in `next.config.ts`. Project layout follows starter conventions: `src/components/` for UI, `src/lib/` for logic, `src/data/` for static corpora.

**Convention-based — partial pass (test runner).** Vitest does not prescribe folder layout, but this repo co-locates tests as `*.test.ts` / `*.test.mjs` beside source and centralizes config in `vitest.config.ts`. No compensation required beyond existing patterns.

**Popular in training data — pass.** TypeScript, Next.js, React, and Vitest are mainstream in the JS/TS ecosystem with extensive training-data coverage.

**Well-documented — pass.** Next.js ships versioned docs at nextjs.org; Vitest at vitest.dev; React at react.dev. Project-specific corpus and distribution rules are documented in `context/foundation/distribution-policy.md` and `README.md`.

## Gaps & Compensation

No quality-gate failures detected. Optional hardening (not blockers):

- **Corpus build scripts (`.mjs`)** are untyped Node — if agents edit manifests frequently, add brief comments at the top of `scripts/*-manifest.mjs` listing required fields (keyword, label anchor, phase).
- **Distribution policy** is project-specific — already documented; ensure agents read `context/foundation/distribution-policy.md` before corpus or deploy changes (covered in `AGENTS.md`).

### Recommended Instruction File Additions

No mandatory additions. The following are optional reinforcements already reflected in root `AGENTS.md`:

```markdown
## Corpus & distribution

Before changing `src/data/*` or deploy-facing bundles, read @context/foundation/distribution-policy.md.
Public deploy uses sample corpora only; full GW/Archon JSON stays in gitignored `src/data/local/`.
```

## Summary

**Verdict: ready.** The stack passes all four agent-friendly criteria for TypeScript, Next.js, and Vitest without compensation. Type safety is enforced locally and in CI; conventions are predictable; tooling is well represented in training data and official docs.

**Strengths:** strict TypeScript, App Router layout, working Vitest suite (49 tests), CI typecheck + test, clear corpus/distribution policy.

**Next step:** run `/10x-health-check` to audit dependency health, CI coverage gaps, and configuration completeness.
