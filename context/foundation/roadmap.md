---
project: Keyword Lexicanum
version: 1
status: draft
created: 2026-06-24
updated: 2026-06-24
prd_version: 1
main_goal: speed
top_blocker: external
---

# Roadmap: Keyword Lexicanum

> Derived from `context/foundation/prd.md` (v1) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.

## Vision recap

New tabletop players hit a steep terminology barrier in dense rulebooks. Keyword Lexicanum is a responsive web app for in-context keyword lookup tied to a specific game system — not generic search. The product wedge — the one trait that, if removed, makes this a generic glossary — is corpus-grounded answers with phase relevance and citations, fast enough to use mid-game in a phone browser.

## North star

**S-02: user can look up a keyword and receive a grounded explanation with citation** — the smallest end-to-end flow that proves the primary Success Criterion ("complete the core lookup flow during a live session" per US-01).

> **North star** here means the first slice whose successful delivery would prove the core product hypothesis — placed as early as prerequisites allow because everything else only matters if lookup works.

## At a glance

| ID | Change ID | Outcome (user can …) | Prerequisites | PRD refs | Status |
|---|---|---|---|---|---|
| F-01 | shareable-web-deploy | (foundation) preview URL deployed for table-side testing | — | NFR responsive web | done |
| S-01 | system-picker-local | select the active game system with a local browser profile | — | FR-001, FR-006 | ready |
| S-02 | keyword-lookup-citation | look up a keyword and receive a grounded explanation with citation | S-01 | US-01, FR-002, FR-003, FR-004 | done |
| S-03 | phase-on-keyword | see which game phase a keyword applies to on lookup results | S-02 | FR-007 | proposed |
| S-04 | browse-by-phase | browse keywords relevant to an entered phase name | S-02 | FR-008 | proposed |
| S-05 | guided-suggestions | pick from guided keyword suggestions while searching | S-02 | FR-002 | proposed |
| S-06 | recent-lookups | view recent keyword lookups from the current session | S-02 | FR-005 | proposed |
| S-07 | dnd-srd-corpus | look up keywords against the real D&D SRD corpus (not sample data) | S-02, licensing clearance | FR-003, FR-004 | blocked |

## Streams

Navigation aid — groups items that share a prerequisites chain. Canonical ordering still lives in the dependency graph below.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Core lookup wedge | `S-01` → `S-02` → `S-03` / `S-05` | Speed-first must-have path; north star at `S-02`. |
| B | Deploy for field test | `F-01` | Parallel with Stream A once `S-02` is demoable — share URL at the game store. |
| C | Phase browse | `S-04` | Joins Stream A at `S-02`; blocked on phase taxonomy until Open Question 1 resolves. |
| D | Real corpus | `S-07` | Joins Stream A at `S-02`; blocked on licensing Open Questions 2–3. |
| E | Session polish | `S-06` | Joins Stream A at `S-02`; nice-to-have, cut if schedule slips. |

## Baseline

What's already in place as of `2026-06-24` (auto-researched + confirmed after web pivot).

- **Frontend:** present — Next.js 16 App Router, Tailwind, tabbed UI at `src/app/` (system, lookup, phases), `src/components/AppNav.tsx`.
- **Backend / API:** absent — client-only app; no API routes or server lookup layer yet.
- **Data:** partial — in-memory sample corpus in `src/lib/lookup.ts`; no IndexedDB, FTS, or ingested rules files.
- **Auth:** absent per tech-stack.md (`has_auth: false`) — Zustand session in `src/store/session.ts`, no login.
- **Deploy / infra:** partial — `next.config.ts` present; no `.github/workflows`; Vercel target declared in tech-stack.md only.
- **Observability:** absent — no error tracking or perf instrumentation.

Prior Expo scaffold archived at `mobile-expo-archive/`; not part of active baseline.

## Foundations

### F-01: Shareable web deploy

- **Outcome:** (foundation) production preview URL on Vercel so testers can open the app on a phone browser at the table.
- **Change ID:** shareable-web-deploy
- **PRD refs:** NFR responsive web at the table
- **Unlocks:** S-02 field validation at the local game store without localhost.
- **Prerequisites:** —
- **Parallel with:** S-01, S-02 (once build passes)
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced early for speed-to-launch feedback loop; minimal scope — deploy skeleton only, no CI polish yet.
- **Status:** done

## Slices

### S-01: Active game system selection

- **Outcome:** user can select which game system is active and use a local browser profile with no login.
- **Change ID:** system-picker-local
- **PRD refs:** FR-001, FR-006
- **Prerequisites:** —
- **Parallel with:** F-01
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Scaffolded in `src/app/page.tsx`; verify responsive layout on phone before marking done.
- **Status:** ready

### S-02: Keyword lookup with citation

- **Outcome:** user can look up a keyword or rule term and receive an in-context explanation grounded in the active system's corpus with a clear citation.
- **Change ID:** keyword-lookup-citation
- **PRD refs:** US-01, FR-002, FR-003, FR-004
- **Prerequisites:** S-01
- **Parallel with:** F-01
- **Blockers:** —
- **Unknowns:**
  - Is sample corpus sufficient to mark this slice done, or does "done" require S-07's real corpus? — Owner: product. Block: no (sample proves UX; real corpus is S-07).
- **Risk:** North star — uses sample data today; validates UX before licensing-heavy ingestion.
- **Status:** done

### S-03: Phase relevance on lookup

- **Outcome:** user can see which game phase a keyword applies to (or that it does not apply outside that phase).
- **Change ID:** phase-on-keyword
- **PRD refs:** FR-007
- **Prerequisites:** S-02
- **Parallel with:** S-05
- **Blockers:** —
- **Unknowns:**
  - Exact phase taxonomy per system (Engagement, etc.) — Owner: product/build. Block: yes for production-quality corpus wiring.
- **Risk:** Sample responses already include phase strings; full accuracy waits on taxonomy + real corpus.
- **Status:** proposed

### S-04: Browse keywords by phase

- **Outcome:** user can enter a phase name and browse keywords relevant to that phase.
- **Change ID:** browse-by-phase
- **PRD refs:** FR-008
- **Prerequisites:** S-02
- **Parallel with:** S-03
- **Blockers:** —
- **Unknowns:**
  - Exact phase taxonomy per system — Owner: product/build. Block: yes for complete keyword lists per phase.
- **Risk:** `src/app/phases/page.tsx` exists with sample `getKeywordsForPhase`; production-quality browse blocked on same taxonomy unknown as S-03.
- **Status:** proposed

### S-05: Guided keyword suggestions

- **Outcome:** user can pick from guided keyword suggestions while searching, not only free typing.
- **Change ID:** guided-suggestions
- **PRD refs:** FR-002
- **Prerequisites:** S-02
- **Parallel with:** S-03
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Improves novice UX per PRD Socrates note; defer if speed path needs to ship S-02 + F-01 first.
- **Status:** proposed

### S-06: Recent session lookups

- **Outcome:** user can view recent keyword lookups from the current session without re-querying.
- **Change ID:** recent-lookups
- **PRD refs:** FR-005
- **Prerequisites:** S-02
- **Parallel with:** S-05
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Nice-to-have per PRD — cut first if the 5-week window tightens; partial UI exists in lookup page.
- **Status:** proposed

### S-07: Real D&D SRD corpus

- **Outcome:** user can look up keywords against the canonical license-free D&D corpus (not hardcoded samples).
- **Change ID:** dnd-srd-corpus
- **PRD refs:** FR-003, FR-004
- **Prerequisites:** S-02, WH40k/Starcraft licensing cleared for later systems
- **Parallel with:** —
- **Blockers:** license-free use of rules text not yet confirmed (PRD Open Questions 2–3).
- **Unknowns:**
  - D&D 5e SRD vs basic manual boundary — Owner: product. Block: yes.
  - WH40k 11th / Starcraft Miniature license-free core rules — Owner: product/legal. Block: yes for those systems.
- **Risk:** External blocker is #1 per roadmap interview; this slice is where it lands. WH40k/Starcraft corpora follow same pattern after D&D proves ingestion.
- **Status:** blocked

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | shareable-web-deploy | Deploy Keyword Lexicanum preview to Vercel | yes | Unblocks table-side testing |
| S-01 | system-picker-local | Polish system picker for mobile web | yes | Scaffold exists |
| S-02 | keyword-lookup-citation | Ship keyword lookup with citation UX | yes | North star — sample corpus OK for v1 demo |
| S-03 | phase-on-keyword | Show phase relevance on keyword results | no | Resolve phase taxonomy OQ first |
| S-04 | browse-by-phase | Browse keywords by phase name | no | Blocked on taxonomy OQ |
| S-05 | guided-suggestions | Add guided keyword suggestions | yes | After S-02 plan if time allows |
| S-06 | recent-lookups | Persist and show recent session lookups | yes | Nice-to-have |
| S-07 | dnd-srd-corpus | Ingest D&D SRD corpus for real lookups | no | Blocked on licensing OQs |

## Open Roadmap Questions

1. **Exact game-phase taxonomy per system** (Engagement, etc.) — Owner: product/build. Block: S-03, S-04.
2. **Licensing verification for WH40k 11th and Starcraft Miniature free core rules** — Owner: product/legal. Block: S-07 (non-D&D systems).
3. **D&D 5e SRD vs basic manual boundary** — Owner: product. Block: S-07.
4. **US-02 for phase-based keyword browse** — Owner: product. Block: roadmap-wide acceptance criteria only.

## Parked

- **Native mobile app** — Why parked: PRD §Non-Goals; web-first per pivot; Expo code in `mobile-expo-archive/`.
- **GM/DM campaign tooling** — Why parked: PRD §Non-Goals.
- **Full rules adjudication** — Why parked: PRD §Non-Goals.
- **Real-time multi-player table sync** — Why parked: PRD §Non-Goals.
- **D&D extension manuals** — Why parked: PRD §Non-Goals.
- **Voice-first input** — Why parked: PRD §Non-Goals.
- **User accounts / cloud sync** — Why parked: PRD §Non-Goals.
- **Offline corpus / service worker** — Why parked: speed path; NFR defers IndexedDB to post-MVP unless table testing demands it.

## Done

- **S-02: user can look up a keyword or rule term and receive an in-context explanation grounded in the active system's corpus with a clear citation.** — Archived 2026-06-24 → `context/archive/2026-06-24-keyword-lookup-citation/`. Lesson: —.
- **F-01: (foundation) production preview URL on Vercel so testers can open the app on a phone browser at the table.** — Archived 2026-06-24 → `context/archive/2026-06-24-shareable-web-deploy/`. Preview: https://keyword-lexicanum.vercel.app. Lesson: —.
