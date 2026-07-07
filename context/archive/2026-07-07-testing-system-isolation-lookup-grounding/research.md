---
date: 2026-07-07T10:15:00+02:00
researcher: Cursor Agent
git_commit: unknown
branch: main
repository: keyword-lexicanum
topic: "Rollout Phase 1 — system isolation & lookup grounding (Risks #1, #3)"
tags: [research, testing, session, lookup, test-plan]
status: complete
last_updated: 2026-07-07
last_updated_by: Cursor Agent
---

# Research: System isolation & lookup grounding tests

**Date**: 2026-07-07  
**Researcher**: Cursor Agent  
**Repository**: keyword-lexicanum  
**Test plan**: `context/foundation/test-plan.md` Phase 1 — Risks #1, #3

## Research Question

Where can cross-system corpus/recents bleed occur after a game-system switch, and what lookup behaviors must tests prove to guard against ungrounded or cross-corpus answers?

## Summary

**Risk #1 (partially mitigated, gaps remain):** Session store already partitions recents and lookup cache by `GameSystemId` (`src/store/session.ts`). `LookupPanel` hides stale results when `resultSystemId !== activeSystem.id` (`src/components/LookupPanel.tsx:32-33`). `KeyedLookupPanel` remounts the lookup UI on system change via `key={activeSystemId}` (`src/app/page.tsx:8-10`). Existing `session.test.ts` covers per-system recents/cache isolation and clear-one-system. **Missing:** no test that simulates a switch *sequence* (record in system A → switch to B → recents/cache/lookup reflect B only); no test that a WH40k-only term misses under D&D (cross-corpus negative).

**Risk #3 (good base, targeted gaps):** `lookup.test.ts` covers hits per system, unknown-term miss, empty query, system-scoped suggestions/phases, and explanation bounds for some WH40k/StarCraft entries. **Missing:** explicit cross-corpus negative cases (e.g. `close quarters` + `dnd5e-srd` → miss; `engagement` + `dnd5e-srd` → miss while StarCraft hits); `corpusVersion` present on all system hits; stale cache ignored when `corpusVersion` mismatches (`getCachedLookup` at `session.ts:205-207` — behavior untested).

**Cheapest layer:** Extend existing Vitest unit tests in `src/lib/lookup.test.ts` and `src/store/session.test.ts`. No React Testing Library or e2e needed for Phase 1 — store + lookup pure functions carry the risk.

**Response-guidance corrections:** Test plan's "switch sequence" is valid — UI remount helps but store/lookup contracts are what tests should lock. Do not add component tests for Phase 1.

## Detailed Findings

### Session store — per-system recents and cache

- `recentLookupsBySystem` and `recentLookupCacheBySystem` are keyed by `GameSystemId` (`session.ts:38-39`, `167-198`).
- `setActiveSystem` only updates `activeSystemId` — it does not move or merge recents (`session.ts:167`).
- `getRecentLookups(systemId)` reads the bucket for the passed id, not implicitly the active system (`session.ts:200`).
- `getCachedLookup` returns `undefined` when `corpusVersion` on the cached hit does not match `getCorpusVersion(systemId)` (`session.ts:201-208`) — **no test covers stale-cache invalidation**.
- `sanitizePersistedProfile` migrates legacy flat `recentLookups` into the active system bucket (`session.ts:74-77`) — tested.
- Existing test `scopes recents and cache per system` (`session.test.ts:91-107`) proves isolation when both systems have data but does not call `setActiveSystem` between operations.

### Lookup layer — corpus routing

- `lookupKeyword(query, systemId)` routes to the correct corpus via `findCorpusEntry` (`lookup.ts:43-51`, `70-85`).
- Miss returns `{ found: false, query }` without fabricating content (`lookup.ts:80-82`).
- Hits attach `corpusVersion` via `toLookupHit` (`lookup.ts:57-67`).
- `getKeywordSuggestions` / `getKeywordsForPhase` already have system-scoping tests (`lookup.test.ts:139-142`, `176-178`).
- **Gap:** no `lookupKeyword` test that a term valid in WH40k returns `found: false` when queried under `dnd5e-srd` (e.g. `close quarters`).

### UI layer — stale result guard (not Phase 1 test target)

- `visibleResult` nulls the card when `resultSystemId !== activeSystem?.id` (`LookupPanel.tsx:32-33`).
- `KeyedLookupPanel` forces remount on system change (`page.tsx:8-10`), resetting local `query`/`result` state.
- These are defense-in-depth; Phase 1 should test store/lookup contracts. Component tests belong to Phase 3 (result presentation).

## Recommended tests (for `/10x-plan`)

| # | Test | File | Proves |
|---|------|------|--------|
| T1 | `lookupKeyword('close quarters', 'dnd5e-srd')` → miss | `lookup.test.ts` | Risk #3 — no cross-corpus hit |
| T2 | `lookupKeyword('engagement', 'dnd5e-srd')` → miss; same query on `starcraft-mini` → hit | `lookup.test.ts` | Risk #3 — system-specific grounding |
| T3 | All three systems: known hit includes truthy `corpusVersion` matching `getCorpusVersion(systemId)` | `lookup.test.ts` | Risk #3 — version stamped for cache invalidation |
| T4 | Record hit in WH40k → `setActiveSystem('dnd5e-srd')` → `getRecentLookups('dnd5e-srd')` empty, WH40k recents unchanged | `session.test.ts` | Risk #1 — switch does not show other system's recents as active |
| T5 | Record hit in D&D → switch to WH40k → record WH40k hit → switch back → each system's recents only its own keywords | `session.test.ts` | Risk #1 — switch sequence |
| T6 | Cache hit with wrong `corpusVersion` → `getCachedLookup` returns undefined | `session.test.ts` | Risk #1/#3 — stale cache not served |

**Oracles:** Use independent corpus facts (term exists in one system's sample JSON only), PRD guardrail ("not found in corpus"), and `getCorpusVersion()` — not copied explanation strings from implementation.

**Anti-patterns to avoid:** Testing only `setActiveSystem` updates id; asserting UI labels; snapshotting full corpus JSON.

## Code References

- `src/store/session.ts:167` — `setActiveSystem` (id only)
- `src/store/session.ts:200-208` — per-system recents + corpusVersion cache gate
- `src/store/session.ts:168-198` — `recordSuccessfulLookup` buckets by systemId
- `src/lib/lookup.ts:70-85` — `lookupKeyword` hit/miss
- `src/lib/lookup.ts:107-121` — `getKeywordSuggestions` scoped by systemId
- `src/components/LookupPanel.tsx:32-33` — stale result guard
- `src/app/page.tsx:8-10` — remount on system change
- `src/store/session.test.ts:91-107` — existing per-system isolation
- `src/lib/lookup.test.ts:109-117` — existing miss cases

## Architecture Insights

- **Two-layer isolation:** persisted session (Zustand) partitions by system; lookup UI adds ephemeral guards (`resultSystemId`, remount key).
- **Cache invalidation:** `corpusVersion` on hits ties recent-cache to corpus rebuilds — important for Risk #2 in Phase 2 but should be tested now for `getCachedLookup`.
- **Test style:** Co-located `*.test.ts` beside source; Vitest node environment; no RTL in repo yet.

## Historical Context

- `context/archive/2026-06-24-recent-lookups/` — per-system recents shipped in S-06; migration from flat list.
- `context/archive/2026-06-24-keyword-lookup-citation/` — north-star lookup + citation UX.
- `context/foundation/test-plan.md` — Phase 1 risk response guidance drove this research.

## Open Questions

- Should `setActiveSystem` clear the search field explicitly at the store level, or is remount sufficient? **Current answer:** remount is sufficient for MVP; tests should not require store to clear UI state.
- Component-level switch test deferred to Phase 3 unless table testing reveals a remount gap on `/lookup` route (separate page exists at `src/app/lookup/page.tsx` — verify it also uses `KeyedLookupPanel` pattern if tests expand later).

## Related Research

(none — first research artifact in this rollout)
