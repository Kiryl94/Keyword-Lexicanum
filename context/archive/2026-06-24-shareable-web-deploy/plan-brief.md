# Shareable Web Deploy — Plan Brief

> Full plan: `context/changes/shareable-web-deploy/plan.md`

## What & Why

Testers at the game store need a URL they can open on a phone browser — not localhost. F-01 delivers a Vercel preview deployment of the existing Next.js app so S-02 lookup can be field-tested without a dev machine.

## Starting Point

Next.js 16 App Router builds cleanly locally (`npm run build` passes; routes `/`, `/lookup`, `/phases` prerender). Client-only app with no API routes, env vars, or secrets. `tech-stack.md` targets Vercel but no deploy wiring exists: no `.github/workflows`, no `vercel.json`, no README deploy section, no git repo in workspace.

## Desired End State

A working `*.vercel.app` preview URL opens the app on a phone. Lookup flow works against the sample corpus. README documents how to import the GitHub repo in Vercel and verify the deployment.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Deploy path | Vercel Git integration | Auto previews on push; standard solo flow | Plan |
| CI | Skip in F-01 | Roadmap: deploy skeleton only; Vercel build is gate | Plan |
| URL type | Preview `*.vercel.app` | Enough for table testing; no custom domain | Plan |
| Docs | README deploy section only | Minimal scope; AGENTS.md deferred | Plan |
| Git setup | Manual prerequisite gate | No `.git` in workspace; user owns GitHub account | Plan |
| Env vars | None | Client-only app; no secrets | Codebase |
| vercel.json | Omit unless needed | Default Next.js detection sufficient | Plan |

## Scope

**In scope:**
- Manual git init + GitHub push (user-driven)
- Vercel dashboard import with Next.js defaults
- README deploy + verify instructions
- Record preview URL in change notes
- Phone-browser smoke test on preview URL

**Out of scope:**
- GitHub Actions CI/CD
- Custom domain / DNS
- `AGENTS.md` / `infrastructure.md` updates
- Environment variables or Vercel secrets
- Production branch promotion strategy
- Analytics, error tracking, performance monitoring

## Architecture / Approach

Standard Vercel + Next.js Git deploy: push to GitHub → Vercel runs `npm install` + `npm run build` → serves App Router hybrid output. No server-side lookup or API. Zustand session stays in browser memory on the preview URL same as localhost.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Repo & Vercel prerequisites | GitHub remote + Vercel project linked + first deploy | User must complete dashboard steps manually |
| 2. Deploy config & docs | README deploy section; Node version pin if Vercel build fails | Vercel Node version mismatch with local |
| 3. Smoke verification | Phone preview URL tested with lookup flow | Mobile network / Vercel cold start latency |

**Prerequisites:** S-02 lookup builds locally (done). GitHub + Vercel accounts.

**Estimated effort:** ~1 session (~2–3 hours) — mostly manual dashboard work.

## Open Risks & Assumptions

- User has or can create GitHub and Vercel accounts (free tier sufficient).
- No git repo exists locally today — Phase 1 is blocked until user pushes.
- Preview URLs are public; sample corpus only — acceptable for store testing.

## Success Criteria (Summary)

- Shareable `https://*.vercel.app` URL loads the app on a phone.
- Lookup for `advantage` (D&D) and `close quarters` (WH40k) works on preview.
- README documents import + verify steps for future deploys.
