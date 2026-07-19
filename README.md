# Keyword Lexicanum

Web app for in-context tabletop rules keyword lookup. **SRD** systems (D&D 5e, Pathfinder 2e, Year Zero Engine) ship full open-licensed corpora; **Demo** systems (WH40k, StarCraft) use public sample data only until publisher permission.

**Platform:** responsive web — phone and desktop browsers at the table.

**Live preview:** https://keyword-lexicanum.vercel.app

## Corpus builds

```powershell
npm run corpus:build-dnd          # D&D SRD — committed, public-safe (requires network)
npm run corpus:build-pf2e         # Pathfinder 2e ORC — committed, public-safe
npm run corpus:build-yze          # Year Zero Engine FTL — committed, public-safe
npm run corpus:build-wh40k        # GW Core Rules PDF → src/data/local/ (gitignored)
npm run corpus:build-starcraft    # Archon rulebook PDF → src/data/local/ (gitignored)
```

After building WH40k or StarCraft locally, copy env paths from script output into `.env.local` (see `.env.local.example`).

**Distribution:** see `context/foundation/distribution-policy.md` — SRD tier is public-safe; Demo tier uses samples only until GW/Archon permission.

## Run locally

```powershell
cd C:\Users\olczy\keyword-lexicanum
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Prerequisites: GitHub repo and a [Vercel](https://vercel.com) account (free tier is enough).

1. Push the project to GitHub (`main` branch).
2. In Vercel: **Add New → Project** → import `Kiryl94/keyword-lexicanum` (or your fork).
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build` · Install command: `npm install` · **No environment variables.**
5. Deploy. Vercel assigns a `*.vercel.app` URL (e.g. https://keyword-lexicanum.vercel.app).

**Redeploy:** push to `main`; Vercel rebuilds automatically.

## Optional sync (auth + favorites)

Core lookup works as a guest with no account. To enable magic-link sign-in and synced favorites:

1. Create a free [Supabase](https://supabase.com) project.
2. In the SQL editor, run [`supabase/migrations/001_favorites.sql`](supabase/migrations/001_favorites.sql).
3. Authentication → Providers → enable **Email** (magic link).
4. Authentication → URL configuration: set Site URL to `http://localhost:3000` (and add your Vercel URL to Redirect URLs, e.g. `https://keyword-lexicanum.vercel.app/auth/callback`).
5. Copy Project URL + anon public key into `.env.local` (see `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Restart `npm run dev`. Sign in from the nav, then star a lookup result to sync a favorite.

Without these env vars the app stays guest-only (CI and public deploys need no secrets).

**Verify after deploy:**

- Open `/` — system picker loads (SRD and Demo sections).
- Search D&D `advantage`, PF2e `hero point`, YZE `push` — success cards with collapsible citations.
- Switch to WH40k, search `close quarters` — phase + citation (Demo sample corpus).
- (If Supabase configured) Sign in → favorite a keyword → it appears under Favorites after refresh.

## Field table test

Run this checklist on your phone during a live session (or solo dry-run at the table). Use the [live preview](https://keyword-lexicanum.vercel.app) or local `npm run dev` on the same Wi‑Fi.

**Prerequisites:** modern mobile browser (Safari/Chrome), portrait orientation, stable connection.

| # | Step | Pass? | Notes |
|---|------|-------|-------|
| 1 | Open app — SRD and Demo sections visible in system picker | | |
| 2 | Select **D&D 5e** — search `advantage` — hit with citation, phase shown | | |
| 3 | Search `grapple` — hit (combat term) | | |
| 4 | Switch to **Pathfinder 2e** — search `reactive strike` (or alias `attack of opportunity`) — hit | | |
| 5 | Search `degree of success` — hit | | |
| 6 | Switch to **Year Zero Engine** — search `group roll` — hit | | |
| 7 | Search `push` — hit with stress/condition context | | |
| 8 | **System isolation:** switch back to D&D — search `push` — should **not** find YZE Push | | |
| 9 | **Recents:** each system shows its own recent lookups after switching | | |
| 10 | **Phase browse:** on PF2e, enter phase `encounter` — keyword list includes `Strike` | | |
| 11 | **Demo tier:** select WH40k — search `close quarters` — hit from sample corpus | | |
| 12 | **Citation expand:** tap citation on any hit — source link/section visible | | |
| 13 | **Suggestions:** type `adv` on D&D — suggestion list appears; pick one — auto-search works | | |

Record results in `context/changes/field-table-test/plan.md` Progress when done. File issues for any failure.

## Project structure

```
src/app/        # System picker, keyword lookup, phase browse, auth callback, favorites API
src/lib/        # lookup + corpus + supabase helpers
src/store/      # Zustand session state (browser memory)
supabase/       # SQL migrations for optional synced favorites
context/        # PRD, shape-notes, tech-stack
```

## Foundation docs

- `context/foundation/prd.md`
- `context/foundation/distribution-policy.md`
- `context/foundation/tech-stack.md`
- `context/foundation/shape-notes.md`

## Sample lookups

- D&D: `advantage`, `grapple`
- Pathfinder 2e: `strike`, `flat-footed`, `hero point`, `reactive strike`
- Year Zero Engine: `push`, `hp`, `group roll`
- WH40k (Demo): `close quarters`, `engagement`
