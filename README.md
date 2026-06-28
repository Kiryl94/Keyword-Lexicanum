# Keyword Lexicanum

Web app for in-context tabletop rules keyword lookup (D&D, WH40k, Starcraft Miniature Game).

**Platform:** responsive web (phone browser at the table). Native mobile is a long-term option.

**Live preview:** https://keyword-lexicanum.vercel.app

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

- Open `/` — system picker loads.
- Open `/lookup`, search `advantage` — success card with collapsible Source citation.
- Switch to WH40k on System tab, search `close quarters` — phase + citation.

## Project structure

```
src/app/        # System picker, keyword lookup, phase browse
src/lib/        # lookup + sample corpus
src/store/      # Zustand session state (browser memory)
context/        # PRD, shape-notes, tech-stack
mobile-expo-archive/  # prior Expo scaffold (archived)
```

## Foundation docs

- `context/foundation/prd.md`
- `context/foundation/tech-stack.md`
- `context/foundation/shape-notes.md`

## Sample lookups

- WH40k: `close quarters`, `engagement`
- D&D: `advantage`
