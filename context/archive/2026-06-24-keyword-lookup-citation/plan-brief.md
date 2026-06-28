# Keyword Lookup with Citation — Plan Brief

> Full plan: `context/changes/keyword-lookup-citation/plan.md`

## What & Why

Players at the table need to resolve unfamiliar keywords without flipping through a rulebook. S-02 delivers the north-star lookup flow: search a term on the active game system, get a short grounded explanation with a low-clutter citation, or a clear not-found state — no fabricated rules.

## Starting Point

A working scaffold exists: `src/lib/lookup.ts` holds a tiny in-memory sample corpus (2–3 terms per system) with exact normalized matching; `src/app/lookup/page.tsx` renders results in a single card with always-visible citation footer and amber dev `offlineNote` on every hit. No tests, no distinct not-found UI, no guided suggestions (S-05).

## Desired End State

On the Lookup tab, after selecting a system, a player submits a keyword and within seconds sees either (a) a success card with explanation, optional phase line, and a collapsed-by-default Source citation, or (b) a visually distinct not-found card with actionable guidance. Lookup logic is unit-tested; dev/sample banners are gone from the UI. Representative sample terms (~8–12 per system) make demo and manual testing meaningful.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Scope | Core lookup only | Focus north star; defer recent-lookups (S-06) and guided suggestions (S-05) | Plan |
| Corpus | Representative sample (~8–12/system) | Enough hits/misses to demo UX without S-07 licensing work | Plan |
| Real corpus | Out of scope (S-07) | Roadmap: sample proves UX before ingestion | Roadmap |
| Match | Exact normalized | Predictable at the table; no false positives | Plan |
| Not-found | Distinct card | Clear separation from success; meets US-01 AC | Plan |
| Citation | Collapsed by default | FR-004 low-clutter; expand on tap for future excerpt | Plan |
| Dev banners | Strip from UI | Amber offlineNote clutters table-speed flow | Plan |
| Testing | Unit tests for lookup.ts | Fast automated guard on match/not-found contract | Plan |
| Search UX | Submit on Enter/button | Avoid accidental lookups while typing | Plan |

## Scope

**In scope:**
- Expand `SAMPLE_CORPUS` with curated terms per system
- Formalize lookup result contract (found vs not-found)
- Collapsible citation UI component
- Distinct not-found card
- Vitest unit tests for lookup logic
- Submit-only search polish for mobile

**Out of scope:**
- Guided keyword suggestions (S-05)
- Recent-lookups polish (S-06)
- Real D&D SRD / WH40k corpus ingestion (S-07)
- Phase browse wiring (S-04)
- FR-007 phase display polish beyond existing optional line
- IndexedDB, FTS, service worker, API routes
- Performance instrumentation (<3s p95 metrics)

## Architecture / Approach

Client-only flow unchanged: Zustand session provides `activeSystemId` → Lookup page calls `lookupKeyword(query, systemId)` → in-memory corpus returns a discriminated result → new `LookupResultCard` renders success or not-found branches. Citation collapse is local component state. Tests target pure lookup functions only.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Contract, corpus & result UI | Typed found/not-found, expanded sample data, vitest, LookupResultCard with collapsible Source | Larger single phase; corpus curation time |
| 2. Search polish & verification | Loading/input tweaks, end-to-end manual checklist | Scope creep into S-05/S-06 if not disciplined |

**Prerequisites:** S-01 system picker functional (already scaffolded; default system set in store).

**Estimated effort:** ~2 sessions across 2 phases (~6–8 hours at 10h/week pace).

## Open Risks & Assumptions

- Sample citation strings remain label-style (no excerpt field) until S-07; collapse UI is forward-compatible.
- Phase strings in corpus are illustrative, not production taxonomy (OQ-1); display unchanged from today.
- WH40k/Starcraft sample text is placeholder — licensing cleared only at S-07.

## Success Criteria (Summary)

- Player can look up a known sample term and see explanation + collapsed citation on active system.
- Unknown term shows distinct not-found card — no fabricated citation or explanation.
- `npm run test` and `npm run typecheck` pass; manual phone-browser smoke test completes under ~3s perceived latency.
