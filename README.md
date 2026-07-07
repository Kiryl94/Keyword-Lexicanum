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

**Verify after deploy:**

- Open `/` — system picker loads (SRD and Demo sections).
- Search D&D `advantage`, PF2e `hero point`, YZE `push` — success cards with collapsible citations.
- Switch to WH40k, search `close quarters` — phase + citation (Demo sample corpus).

## Project structure

```
src/app/        # System picker, keyword lookup, phase browse
src/lib/        # lookup + sample corpus
src/store/      # Zustand session state (browser memory)
context/        # PRD, shape-notes, tech-stack
```

## Foundation docs

- `context/foundation/prd.md`
- `context/foundation/distribution-policy.md`
- `context/foundation/tech-stack.md`
- `context/foundation/shape-notes.md`

## Sample lookups

- D&D: `advantage`, `grapple`
- Pathfinder 2e: `strike`, `flat-footed`, `hero point`
- Year Zero Engine: `push`, `hp`
- WH40k (Demo): `close quarters`, `engagement`
