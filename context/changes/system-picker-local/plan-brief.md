# Active Game System Selection (Local Profile) — Plan Brief

> Full plan: `context/changes/system-picker-local/plan.md`

## What & Why

Players must pick an active game system (D&D 5e SRD, Warhammer 40k 11th ed, Starcraft Miniature Game) and have that choice survive refresh without login. S-01 closes FR-001 and FR-006 by persisting a local browser profile and polishing the picker for phone use at the table, including in-flow system switching on Lookup and Phases.

## Starting Point

A basic System page (`src/app/page.tsx`) and in-memory Zustand store (`src/store/session.ts`) already exist: three systems, click-to-select, default `dnd5e-srd`. Lookup and Phases consume `getActiveSystem()` but selection is lost on refresh, there is no compact switcher in-flow, and AppNav does not show the active system.

## Desired End State

After refresh, the user's last system and recent lookups restore from localStorage. AppNav shows the active system at a glance. Lookup and Phases offer a compact switcher so players can change system without visiting the System tab. The System page has mobile-friendly tap targets and accessible selection semantics. Invalid persisted IDs silently fall back to `dnd5e-srd`.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Persistence scope | `activeSystemId` + `recentLookups` | Full local profile in one slice; recents survive refresh |
| In-flow switch | Compact switcher on Lookup/Phases | Satisfies US-01 without leaving lookup flow |
| System visibility | Active system label in AppNav | Always-visible context on every tab |
| Stale persisted ID | Fallback to `dnd5e-srd` | Avoid broken/empty states after deploys |
| Slice priority | Full flow (persist + switcher + nav + mobile) | Complete table-ready player journey for S-01 |

## Scope

**In scope:**

- Zustand `persist` middleware with `localStorage` for `activeSystemId` and `recentLookups`
- Stale-ID validation on rehydrate (fallback to default)
- Unit tests for store validation and persistence partialization
- System page mobile/a11y polish (`radiogroup`, `aria-selected`, tap targets)
- Reusable `SystemSwitcher` on Lookup and Phases
- AppNav active-system indicator

**Out of scope:**

- Login, accounts, cross-device sync
- Per-system recent-lookup partitioning
- Guided suggestions (S-05), recent-lookups UI polish beyond persistence (S-06)
- IndexedDB / offline corpus (S-07)
- Bottom nav, safe-area redesign, viewport meta overhaul
- E2E or component test suite

## Architecture / Approach

Extend `useSessionStore` with Zustand `persist` + `createJSONStorage(() => localStorage)`, persisting only profile fields. On rehydrate, validate `activeSystemId` against `GAME_SYSTEMS`; unknown values reset to `dnd5e-srd`. A shared `SystemSwitcher` component (themed native `<select>`) calls `setActiveSystem` and mounts on Lookup/Phases headers. `AppNav` subscribes to `getActiveSystem()` and shows a truncated label beside the app title.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Local profile persistence | localStorage profile, stale-ID fallback, session tests, System page a11y/mobile | SSR hydration flash if store read before rehydrate |
| 2. In-flow switching & visibility | SystemSwitcher, AppNav label, Lookup/Phases wiring, mobile smoke | Select styling vs dark theme on iOS Safari |

**Prerequisites:** S-02 lookup flow (done); Zustand 5.x already in dependencies  
**Estimated effort:** ~1–2 sessions across 2 phases

## Open Risks & Assumptions

- Recent lookups remain global (not scoped per system) — matches current behavior; per-system partitioning deferred
- Brief hydration mismatch possible on first paint; mitigated by default state matching persisted default
- iOS Safari native `<select>` may need `-webkit-appearance` overrides for dark theme consistency

## Success Criteria (Summary)

- Refresh restores last selected system and recent lookups
- Player switches system from Lookup/Phases without visiting System tab
- AppNav shows which system is active on all routes
- Phone-width manual smoke passes for System, Lookup, and Phases
