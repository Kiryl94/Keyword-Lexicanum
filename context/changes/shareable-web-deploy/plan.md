# Shareable Web Deploy Implementation Plan

## Overview

Deploy Keyword Lexicanum to Vercel via Git integration so testers get a shareable `*.vercel.app` preview URL for table-side testing. Document the import flow in README. No CI workflows, custom domain, or environment variables — deploy skeleton only per roadmap F-01.

## Current State Analysis

- **App:** Next.js 16.2.9 App Router; `npm run build` succeeds; routes `/`, `/lookup`, `/phases` prerender statically.
- **Runtime:** Client-only — Zustand session, in-memory lookup corpus; no API routes, middleware, or `process.env` usage.
- **Deploy:** `next.config.ts` is default empty config. No `vercel.json`, no `.github/workflows` at project root.
- **Git:** No `.git/` directory in workspace — GitHub push is a manual prerequisite.
- **Docs:** `README.md` covers local dev only. `tech-stack.md` declares `deployment_target: vercel` and `ci_provider: github-actions` but F-01 explicitly defers CI.

### Key Discoveries:

- `.gitignore` already ignores `.vercel` and `.env*` — Vercel-friendly.
- Roadmap F-01 risk note: "minimal scope — deploy skeleton only, no CI polish yet."
- S-02 (`keyword-lookup-citation`) is done — app is demoable for field test.

## Desired End State

1. GitHub repository contains the project and is linked to a Vercel project.
2. Vercel preview deployment succeeds with default Next.js settings (no env vars).
3. Recorded preview URL opens the app on a phone; lookup flow works.
4. `README.md` has a Deploy section: GitHub import steps + how to verify.

## What We're NOT Doing

- GitHub Actions workflows (lint/test/deploy CI)
- Custom domain or DNS configuration
- `AGENTS.md` or `context/foundation/infrastructure.md` updates
- Vercel environment variables or secrets
- Production-branch promotion / stable URL strategy
- `vercel.json` unless Vercel build fails without it
- Analytics, Sentry, or performance instrumentation
- Changes to application code unless required for deploy compatibility

## Implementation Approach

Three phases: (1) manual git + Vercel dashboard setup with first deploy, (2) pin Node version if needed and write README deploy docs, (3) phone-browser smoke test on live preview URL. Phases 1 and 3 are primarily manual gates.

## Phase 1: Repo & Vercel Prerequisites

### Overview

Establish GitHub remote and Vercel project; achieve first successful deployment. Agent documents steps; user executes dashboard and git operations.

### Changes Required:

#### 1. Local git repository (manual — user)

**File**: repository root

**Intent**: Create version control and push to GitHub so Vercel Git integration can import the project.

**Contract**: User runs locally (outside agent if git unavailable in agent shell):

```powershell
cd C:\Users\olczy\keyword-lexicanum
git init
git add .
git commit -m "feat: keyword lookup MVP (S-02)"
# Create empty repo on GitHub, then:
git remote add origin https://github.com/<user>/keyword-lexicanum.git
git branch -M main
git push -u origin main
```

Exclude secrets: no `.env` files committed (already gitignored).

#### 2. Vercel project import (manual — user)

**Intent**: Link GitHub repo to Vercel with Next.js framework defaults.

**Contract**: In Vercel dashboard:

- Import Git repository `keyword-lexicanum`
- Framework Preset: **Next.js** (auto-detected)
- Build Command: `npm run build` (default)
- Output Directory: default (leave automatic)
- Install Command: `npm install` (default)
- Root Directory: `.` (repository root)
- Environment Variables: **none**
- Deploy

Record the resulting preview URL (e.g. `https://keyword-lexicanum-*.vercel.app`) in `context/changes/shareable-web-deploy/change.md` under `## Notes`.

#### 3. Pre-flight local verification (agent)

**Intent**: Confirm local build still passes before blaming Vercel for failures.

**Contract**: Run `npm run build` locally; must succeed before marking Phase 1 automated checks done.

### Success Criteria:

#### Automated Verification:

- Local build passes: `npm run build`

#### Manual Verification:

- GitHub repository exists and contains latest code
- Vercel project linked to GitHub repo
- First Vercel deployment status is **Ready**
- Preview URL loads `/` in desktop browser (system picker visible)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Deploy Config & Documentation

### Overview

Harden deploy compatibility if needed and document the flow in README.

### Changes Required:

#### 1. Node version pin (conditional)

**File**: `package.json` and/or `.nvmrc` (new, only if Vercel build fails on Node version)

**Intent**: Align Vercel build Node version with local if deploy logs show version mismatch.

**Contract**: If Phase 1 Vercel deploy succeeded without changes, **skip this item**. If build failed on Node, add `"engines": { "node": ">=20" }` to `package.json` OR create `.nvmrc` with `20` and redeploy.

#### 2. README deploy section

**File**: `README.md`

**Intent**: Document how to deploy and verify for future sessions and collaborators.

**Contract**: Add `## Deploy` section covering:

- Prerequisites: GitHub repo + Vercel account
- Vercel import steps (framework Next.js, no env vars)
- How to trigger redeploy (push to `main`)
- How to find preview URL in Vercel dashboard
- Quick verify: open `/lookup`, search `advantage`

Do not add AGENTS.md or infrastructure.md changes.

#### 3. Change notes URL record

**File**: `context/changes/shareable-web-deploy/change.md`

**Intent**: Persist the live preview URL for roadmap/archive reference.

**Contract**: Under `## Notes`, add line: `Preview URL: https://...` (actual URL from Phase 1).

### Success Criteria:

#### Automated Verification:

- Local build passes: `npm run build`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`

#### Manual Verification:

- README Deploy section is accurate against actual Vercel project settings
- Preview URL recorded in `change.md` Notes

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Smoke Verification

### Overview

Confirm the live preview URL works for table-side use on a phone browser.

### Changes Required:

No code changes expected. Verification-only phase unless Phase 1/2 revealed deploy issues.

### Success Criteria:

#### Automated Verification:

- Local build passes: `npm run build` (regression guard)

#### Manual Verification:

- Open preview URL on phone browser (375px width or physical device)
- System tab: default or selected system loads
- Lookup tab: search `advantage` → success card with collapsed Source
- Switch to WH40k on System tab → Lookup: search `close quarters` → phase + citation
- Search unknown term → distinct not-found card
- No console errors blocking interaction (DevTools remote debug optional)
- Perceived load time acceptable at table (<3s first paint)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- Run `npm run test` as regression guard before Phase 2 doc commit — deploy slice does not add new tests.

### Integration Tests:

- None — live URL smoke test is manual.

### Manual Testing Steps:

1. Desktop: open preview URL → all three nav tabs load
2. Phone: repeat lookup flow from S-02 manual checklist
3. Share URL with tester (or self on cellular) — confirm no localhost references in README

## Performance Considerations

Vercel edge/CDN serves prerendered shells; client lookup remains in-memory — same instant response as local. First visit may have cold-start latency; acceptable for MVP preview.

## Migration Notes

Not applicable — no data migration. Zustand session is ephemeral per browser; preview URL behaves like localhost.

## References

- Roadmap F-01: `context/foundation/roadmap.md`
- Tech stack: `context/foundation/tech-stack.md`
- PRD NFR responsive web: `context/foundation/prd.md`
- Archived S-02 plan: `context/archive/2026-06-24-keyword-lookup-citation/plan.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Repo & Vercel Prerequisites

#### Automated

- [x] 1.1 Local build passes: `npm run build`

#### Manual

- [ ] 1.2 GitHub repository exists and contains latest code
- [ ] 1.3 Vercel project linked to GitHub repo
- [ ] 1.4 First Vercel deployment status is Ready
- [ ] 1.5 Preview URL loads `/` in desktop browser

### Phase 2: Deploy Config & Documentation

#### Automated

- [ ] 2.1 Local build passes: `npm run build`
- [ ] 2.2 Type checking passes: `npm run typecheck`
- [ ] 2.3 Linting passes: `npm run lint`

#### Manual

- [ ] 2.4 README Deploy section matches actual Vercel settings
- [ ] 2.5 Preview URL recorded in change.md Notes

### Phase 3: Smoke Verification

#### Automated

- [ ] 3.1 Local build passes: `npm run build`

#### Manual

- [ ] 3.2 Preview URL opens on phone browser; nav tabs load
- [ ] 3.3 Lookup `advantage` works on preview
- [ ] 3.4 WH40k `close quarters` works after system switch
- [ ] 3.5 Unknown term shows not-found card
- [ ] 3.6 Perceived load time acceptable at table
