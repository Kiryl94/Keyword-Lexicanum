# Active Game System Selection (Local Profile) Implementation Plan

## Overview

Complete roadmap slice S-01: persist the player's local browser profile (`activeSystemId` and `recentLookups`), polish the System picker for mobile web, surface the active system in AppNav, and add a compact in-flow system switcher on Lookup and Phases. Closes FR-001 and FR-006 without login or cross-device sync.

## Current State Analysis

The system-selection scaffold exists but is session-only and thin on mobile/a11y:

- **`src/store/session.ts`** — Zustand in-memory store; `activeSystemId` defaults to `'dnd5e-srd'`; `recentLookups` capped at 10; no `persist` middleware; no `localStorage`.
- **`src/app/page.tsx`** — Three clickable cards with selected-state border styling; plain `<button>` elements without radiogroup semantics; `p-4` tap targets.
- **`src/components/AppNav.tsx`** — Static title + tab links; no active-system indicator.
- **`src/app/lookup/page.tsx`** — Shows `activeSystem.label` as heading only; `resultSystemId` guard already hides stale results on system change; recent lookups rendered but ephemeral.
- **`src/app/phases/page.tsx`** — Consumes active system; no switcher.
- **Tests** — `src/lib/lookup.test.ts` exists; no session/store tests.

### Key Discoveries:

- `src/store/session.ts:38` — default `'dnd5e-srd'` means Lookup works without visiting System tab in a fresh session; persisted profile must preserve same default for first-time users.
- `src/app/lookup/page.tsx:22-23` — stale lookup results already hidden when `resultSystemId !== activeSystem.id`; system switcher does not need extra result-clearing logic beyond existing pattern.
- Zustand 5.x (`package.json`) includes `persist` and `createJSONStorage` in `zustand/middleware` — no new dependency required.
- Roadmap S-01 risk note: verify responsive layout on phone before marking done (`context/foundation/roadmap.md`).

## Desired End State

After this plan:

1. `activeSystemId` and `recentLookups` survive page refresh via `localStorage`.
2. Invalid or unknown persisted `activeSystemId` silently resets to `'dnd5e-srd'`.
3. System page uses accessible radiogroup semantics and mobile-friendly tap targets.
4. AppNav displays truncated active system label on all routes.
5. Lookup and Phases include a compact `SystemSwitcher` for in-flow system changes (US-01).
6. `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.
7. Manual phone-width smoke confirms picker, switcher, and nav indicator at the table.

## What We're NOT Doing

- Login, accounts, or server-side profile storage
- Per-system partitioning of recent lookups
- Guided keyword suggestions (S-05)
- Recent-lookups UI redesign beyond persistence (S-06)
- IndexedDB, service worker, offline corpus (S-07)
- Bottom navigation, safe-area-inset layout overhaul, viewport export changes
- Toast/banner for stale-ID recovery (silent fallback chosen)
- E2E or React component tests
- Removing the System tab (remains primary onboarding surface)

## Implementation Approach

Two phases: (1) persistence layer, validation, unit tests, and System page polish — foundational and testable in isolation; (2) shared switcher component, AppNav indicator, Lookup/Phases integration, and manual mobile verification gate. Phase 2 depends on Phase 1's persisted store but UI work is independently verifiable.

## Critical Implementation Details

Zustand `persist` rehydrates asynchronously on the client. Default state in the store factory must match the intended first-visit experience (`dnd5e-srd`, empty recents). Components that gate on `getActiveSystem()` should continue to work because the default is always valid; avoid reading `localStorage` outside the store. Validate persisted `activeSystemId` in a `onRehydrateStorage` callback or immediately after `persist` merge — do not wait for user interaction.

## Phase 1: Local Profile Persistence & System Page Polish

### Overview

Add Zustand persistence for the local browser profile, validate stale system IDs on rehydrate, cover store logic with vitest, and upgrade the System page for mobile touch and accessibility.

### Changes Required:

#### 1. Persisted session store

**File**: `src/store/session.ts`

**Intent**: Persist `activeSystemId` and `recentLookups` to `localStorage` so FR-006 local profile survives refresh; reset unknown IDs to the default system.

**Contract**:

- Import `persist` and `createJSONStorage` from `zustand/middleware`.
- Wrap store with `persist(..., { name: 'keyword-lexicanum-profile', storage: createJSONStorage(() => localStorage), partialize: (state) => ({ activeSystemId: state.activeSystemId, recentLookups: state.recentLookups }) })`.
- Export a helper `isValidGameSystemId(id: unknown): id is GameSystemId` (or inline check against `GAME_SYSTEMS.map(s => s.id)`) used during rehydration.
- On rehydrate: if `activeSystemId` is missing or not a valid `GameSystemId`, set to `'dnd5e-srd'`.
- `recentLookups`: coerce to `string[]` if corrupted; cap length at 10 after rehydrate.
- Preserve existing action signatures: `setActiveSystem`, `addRecentLookup`, `getActiveSystem`.

#### 2. Session store unit tests

**File**: `src/store/session.test.ts` (new)

**Intent**: Lock persistence partialization and stale-ID validation logic without browser UI.

**Contract**:

- Test `isValidGameSystemId` (or equivalent) accepts all three PRD systems and rejects unknown strings.
- Test rehydration fallback: invalid/missing `activeSystemId` → `'dnd5e-srd'`.
- Test `addRecentLookup` dedupes and caps at 10 (existing behavior, now guarded by tests).
- If testing full persist round-trip requires mocking `localStorage`, use vitest `vi.stubGlobal` or an in-memory storage shim; keep tests deterministic.

#### 3. System page mobile & accessibility

**File**: `src/app/page.tsx`

**Intent**: Meet roadmap mobile verification for the primary picker; make selection semantics explicit for assistive tech.

**Contract**:

- Wrap system list in container with `role="radiogroup"` and `aria-label="Active game system"`.
- Each system button: `role="radio"`, `aria-checked={selected}`, `min-h-[48px]` or equivalent (`py-3`+ padding) for touch targets.
- Selected state retains existing accent border styling (`border-[#e94560]`).
- Page heading/copy unchanged in substance; optional short hint that choice is remembered locally.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Production build passes: `npm run build`

#### Manual Verification:

- Select WH40k on System page, refresh browser — WH40k remains selected
- Perform a successful lookup, refresh — recent lookup list restores
- DevTools → Application → Local Storage shows `keyword-lexicanum-profile` key with expected JSON
- System page buttons are comfortable to tap at ~375px viewport width

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: In-Flow Switching & Visibility

### Overview

Ship a reusable compact system switcher, show active system in AppNav, wire Lookup and Phases for in-flow system changes, and complete phone-width smoke verification.

### Changes Required:

#### 1. SystemSwitcher component

**File**: `src/components/SystemSwitcher.tsx` (new)

**Intent**: Provide a compact, thumb-friendly control to change active system without navigating to `/`.

**Contract**:

- Client component; reads `activeSystemId` / `setActiveSystem` from `useSessionStore`.
- Renders themed native `<select>` (preferred for mobile a11y) listing all `GAME_SYSTEMS` by `label`, value = `id`.
- Props: optional `className`, optional `id` for label association.
- Associated `<label>` or `aria-label="Active game system"` on the select.
- Styling consistent with lookup input: dark background, accent focus ring, full width on narrow screens, `py-3` minimum touch height.
- `onChange` calls `setActiveSystem` with typed `GameSystemId`.

#### 2. AppNav active system indicator

**File**: `src/components/AppNav.tsx`

**Intent**: Show which system is active on every tab without opening Lookup.

**Contract**:

- Convert to client store subscriber (already `'use client'`).
- Read `getActiveSystem()` from `useSessionStore`.
- Display truncated system label adjacent to app title, e.g. `Keyword Lexicanum · D&D 5e` with `truncate` / `max-w-*` so nav tabs remain usable on narrow screens.
- Graceful fallback if `getActiveSystem()` undefined (should not occur post-Phase 1 validation): omit suffix or show generic "System".

#### 3. Lookup page integration

**File**: `src/app/lookup/page.tsx`

**Intent**: Enable in-flow system switch per US-01; replace static system heading with switcher.

**Contract**:

- Import and render `SystemSwitcher` near page top (above search input).
- Remove or replace standalone `<h1>{activeSystem.label}</h1>` — switcher carries system context; optional visually hidden heading for page structure if needed for a11y.
- Existing `visibleResult` / `resultSystemId` logic unchanged.
- Recent lookups continue to work with persisted store from Phase 1.

#### 4. Phases page integration

**File**: `src/app/phases/page.tsx`

**Intent**: Allow phase browsing under a different system without visiting System tab.

**Contract**:

- Render `SystemSwitcher` at top of main content (consistent placement with Lookup).
- When system changes, clear stale `keywords` result state (phase results from prior system should not linger).

#### 5. System page switcher alignment (optional consistency)

**File**: `src/app/page.tsx`

**Intent**: Keep card picker as primary System-tab UX; no requirement to add `<select>` duplicate unless implementer finds it aids testing. Card picker remains authoritative onboarding surface.

**Contract**: No mandatory change beyond Phase 1 polish unless switcher duplication is explicitly avoided — card list stays as-is.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Production build passes: `npm run build`

#### Manual Verification:

- From Lookup, change system via switcher and search a system-specific term — correct corpus result without visiting System tab
- From Phases, switch system and browse — keyword list reflects new system's corpus
- AppNav shows updated system label immediately after switch on all tabs
- Switch system on Lookup after a result — previous system's result card hidden (existing guard)
- Phone-width smoke (~375px): AppNav readable, switcher usable, System cards tappable, no horizontal overflow

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking S-01 done.

---

## Testing Strategy

### Unit Tests:

- `isValidGameSystemId` / rehydration fallback for unknown persisted IDs
- `addRecentLookup` dedupe and cap-at-10 behavior
- Optional: mock localStorage round-trip for partialized persist payload

### Integration Tests:

- None in this slice (deferred)

### Manual Testing Steps:

1. Fresh browser profile → defaults to D&D 5e; lookup works
2. Select Starcraft on System page → refresh → still Starcraft; AppNav updates after Phase 2
3. Lookup "engagement" under Starcraft → refresh → recent list includes term
4. Manually edit localStorage JSON to `{ "activeSystemId": "bogus" }` → refresh → falls back to D&D 5e
5. On Lookup, switch WH40k → search "close quarters" → hit with Engagement phase
6. On Phases, switch system mid-session → prior keyword list clears
7. Resize to 375px width — verify tap targets and nav truncation

## Performance Considerations

Negligible — single localStorage read on init, small JSON payload (<1 KB). No render-path localStorage access outside Zustand rehydration.

## Migration Notes

First deploy with persist: existing users (no key) get default `dnd5e-srd` and empty recents — same as today. No migration script. If a future deploy removes a system id from `GAME_SYSTEMS`, rehydrate fallback resets affected users to default silently.

## References

- PRD FR-001, FR-006: `context/foundation/prd.md`
- Roadmap S-01: `context/foundation/roadmap.md`
- Prior lookup patterns: `context/archive/2026-06-24-keyword-lookup-citation/plan.md`
- Store: `src/store/session.ts`
- Lookup stale-result guard: `src/app/lookup/page.tsx:22-23`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Local Profile Persistence & System Page Polish

#### Automated

- [x] 1.1 Unit tests pass: `npm run test` — 4ce8d2d
- [x] 1.2 Type checking passes: `npm run typecheck` — 4ce8d2d
- [x] 1.3 Linting passes: `npm run lint` — 4ce8d2d
- [x] 1.4 Production build passes: `npm run build` — 4ce8d2d

#### Manual

- [x] 1.5 Select WH40k on System page, refresh browser — WH40k remains selected — 4ce8d2d
- [x] 1.6 Perform a successful lookup, refresh — recent lookup list restores — 4ce8d2d
- [x] 1.7 DevTools localStorage shows `keyword-lexicanum-profile` with expected JSON — 4ce8d2d
- [x] 1.8 System page buttons are comfortable to tap at ~375px viewport width — 4ce8d2d

### Phase 2: In-Flow Switching & Visibility

#### Automated

- [x] 2.1 Unit tests pass: `npm run test` — 4ce8d2d
- [x] 2.2 Type checking passes: `npm run typecheck` — 4ce8d2d
- [x] 2.3 Linting passes: `npm run lint` — 4ce8d2d
- [x] 2.4 Production build passes: `npm run build` — 4ce8d2d

#### Manual

- [x] 2.5 From Lookup, change system via switcher and search — correct result without visiting System tab — 4ce8d2d
- [x] 2.6 From Phases, switch system and browse — keyword list reflects new system — 4ce8d2d
- [x] 2.7 AppNav shows updated system label immediately after switch — 4ce8d2d
- [x] 2.8 Switch system on Lookup after a result — previous system's result card hidden — 4ce8d2d
- [x] 2.9 Phone-width smoke (~375px): nav, switcher, and System cards usable without overflow — 4ce8d2d
