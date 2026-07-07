# Repository Guidelines

Keyword Lexicanum is a Next.js 16 + TypeScript web app for tabletop keyword lookup with corpus-grounded citations. Read @context/foundation/distribution-policy.md before touching corpus data or public deploy content.

## Hard rules

- Never commit full WH40k or StarCraft corpus JSON from `src/data/local/` — gitignored, personal-use only per @context/foundation/distribution-policy.md.
- Public bundles must use sample corpora for **Demo** systems (`wh40k-core-corpus.sample.json`, `starcraft-core-corpus.sample.json`) unless publisher permission exists. **SRD** systems ship full open-licensed corpora.

## Project Structure & Module Organization

- `src/app/` — Next.js App Router pages (system picker, lookup, phases).
- `src/components/` — React UI (PascalCase `.tsx` files).
- `src/lib/` — lookup logic and corpus loaders (`lookup.ts`, `corpus/`).
- `src/store/` — Zustand session state (`session.ts`).
- `src/data/` — committed corpora and samples; local PDF builds land in `src/data/local/` (gitignored).
- `scripts/` — corpus build manifests and Node tests (`*.mjs`, `*-manifest.mjs`).
- `context/foundation/` — PRD, roadmap, distribution policy. See @README.md.

## Build, Test, and Development Commands

Run `npm run dev` for local dev (http://localhost:3000). Run `npm run typecheck` and `npm test` before pushing — CI runs both on PRs to `main` (@.github/workflows/ci.yml). Run `npm run build` to verify production builds. Corpus rebuilds: `npm run corpus:build-dnd`, `corpus:build-pf2e`, `corpus:build-yze`, `corpus:build-wh40k`, `corpus:build-starcraft`, then `corpus:build-samples` for public-safe Demo samples.

## Coding Style & Naming Conventions

TypeScript strict mode is on (@tsconfig.json). ESLint uses `eslint-config-next` (@eslint.config.mjs) — run `npm run lint` when changing TS/TSX. Components: PascalCase in `src/components/`. Lib modules: descriptive files in `src/lib/` (e.g. `lookup.ts`, `corpus/citation.ts`). Path alias `@/*` maps to `src/*`.

## Testing Guidelines

Vitest (@vitest.config.ts) — tests co-located as `*.test.ts` or `*.test.mjs` beside source (e.g. @src/lib/lookup.test.ts, @scripts/dnd-corpus-utils.test.mjs). Run the full suite with `npm test`. Add regression tests when changing lookup, session persistence, or corpus citation behavior.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits: `feat`, `fix`, `chore` with optional scope (`feat(corpus):`, `feat(ux):`). PRs to `main` must pass CI typecheck and test jobs. Do not push gitignored local corpora or `.env.local` secrets.
