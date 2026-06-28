# Recent Session Lookups — Plan Brief

> Full plan: `context/changes/recent-lookups/plan.md`

## What & Why

FR-005 lets players revisit terms they looked up during a session without re-querying. A basic recent list exists but is global across systems and always re-runs lookup on tap. S-06 scopes recents per active game system and restores cached hit cards instantly.

## Starting Point

`useSessionStore` persists a flat `recentLookups: string[]` shared across all systems. `LookupPanel` renders tappable links that call `onSearch` every time. Successful hits call `addRecentLookup(trimmed)`.

## Desired End State

Each system keeps its own recent keyword list (max 10) in localStorage. Tapping a recent term for a cached hit shows the result card immediately. Fresh lookups still update recents and cache. Legacy flat `recentLookups` migrates into the active system bucket on load.

## Key Decisions

| Decision | Choice | Why |
| -------- | ------ | --- |
| Scope | Per `GameSystemId` | Avoids WH40k terms showing under D&D |
| Revisit | Cache `LookupHit` per system | Satisfies FR-005 without re-query |
| Persistence | localStorage via Zustand | Matches S-01 profile; survives refresh at the table |
| Miss cache | Do not cache | Recents only record successful hits (unchanged) |

## Phases

1. Session store — per-system recents + cache + migration + tests
2. UI — `RecentLookupList` component; instant revisit in `LookupPanel`
