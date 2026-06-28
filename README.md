# Keyword Lexicanum

Web app for in-context tabletop rules keyword lookup (D&D, WH40k, Starcraft Miniature Game).

**Platform:** responsive web (phone browser at the table). Native mobile is a long-term option.

## Run locally

```powershell
cd C:\Users\olczy\keyword-lexicanum
npm install
npm run dev
```

Open http://localhost:3000

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
