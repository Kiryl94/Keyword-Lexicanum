---
project: Keyword Lexicanum
version: 1
status: draft
created: 2026-06-24
updated: 2026-07-07
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
| S-01 | system-picker-local | select the active game system with a local browser profile | — | FR-001, FR-006 | done |
| S-02 | keyword-lookup-citation | look up a keyword and receive a grounded explanation with citation | S-01 | US-01, FR-002, FR-003, FR-004 | done |
| S-03 | phase-on-keyword | see which game phase a keyword applies to on lookup results | S-02 | FR-007 | done |
| S-04 | browse-by-phase | browse keywords relevant to an entered phase name | S-02 | FR-008 | done |
| S-05 | guided-suggestions | pick from guided keyword suggestions while searching | S-02 | FR-002 | done |
| S-06 | recent-lookups | view recent keyword lookups from the current session | S-02 | FR-005 | done |
| S-07 | dnd-srd-corpus | look up keywords against the real D&D SRD corpus (not sample data) | S-02 | FR-003, FR-004 | done |
| S-08 | wh40k-core-corpus | look up WH40k keywords against locally built GW core rules corpus | S-02, distribution policy | FR-003, FR-004 | done |
| S-09 | starcraft-core-corpus | look up StarCraft TMG keywords against locally built Archon corpus | S-02, distribution policy | FR-003, FR-004 | done |
| S-10 | pf2e-srd-corpus | look up Pathfinder 2e Remaster keywords against ORC SRD manifest | S-02 | FR-003, FR-004 | done |
| S-11 | yze-srd-corpus | look up Year Zero Engine keywords against FTL SRD manifest | S-02 | FR-003, FR-004 | done |
| S-12 | dnd-srd-deepen | richer D&D phase rulesets, alias map, and v2 corpus rebuild | S-07 | FR-003, FR-007 | done |

## Streams

Navigation aid — groups items that share a prerequisites chain. Canonical ordering still lives in the dependency graph below.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Core lookup wedge | `S-01` → `S-02` → `S-03` / `S-05` | Speed-first must-have path; north star at `S-02`. |
| B | Deploy for field test | `F-01` | Parallel with Stream A once `S-02` is demoable — share URL at the game store. |
| C | Phase browse | `S-04` | Joins Stream A at `S-02`; blocked on phase taxonomy until Open Question 1 resolves. |
| D | Real corpus | `S-07` → `S-08` / `S-09` / `S-10` / `S-11` | D&D + PF2e + YZE public SRD; GW/Archon Demo until consultation. See `distribution-policy.md`. |
| E | Session polish | `S-06` | Joins Stream A at `S-02`; nice-to-have, cut if schedule slips. |

## Baseline

What's already in place as of `2026-06-24` (auto-researched + confirmed after web pivot).

- **Frontend:** present — Next.js 16 App Router, Tailwind, tabbed UI at `src/app/` (system, lookup, phases), `src/components/AppNav.tsx`.
- **Backend / API:** absent — client-only app; no API routes or server lookup layer yet.
- **Data:** D&D ingested SRD JSON (public). WH40k/StarCraft: sample in repo; full corpus via local PDF build (`src/data/local/`, gitignored).
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
- **Status:** done

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
- **Status:** done

### S-04: Browse keywords by phase

- **Outcome:** user can enter a phase name and browse keywords relevant to that phase.
- **Change ID:** browse-by-phase
- **PRD refs:** FR-008
- **Prerequisites:** S-02
- **Parallel with:** S-03
- **Blockers:** —
- **Unknowns:**
  - Exact phase taxonomy per system — Owner: product/build. Block: yes for complete keyword lists per phase.
- **Risk:** Shipped; sample phase taxonomy until full corpus refines keyword lists per phase.
- **Status:** done

### S-05: Guided keyword suggestions

- **Outcome:** user can pick from guided keyword suggestions while searching, not only free typing.
- **Change ID:** guided-suggestions
- **PRD refs:** FR-002
- **Prerequisites:** S-02
- **Parallel with:** S-03
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Shipped in production; typeahead + auto-search on pick validated at table width.
- **Status:** done

### S-06: Recent session lookups

- **Outcome:** user can view recent keyword lookups from the current session without re-querying.
- **Change ID:** recent-lookups
- **PRD refs:** FR-005
- **Prerequisites:** S-02
- **Parallel with:** S-05
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Per-system recents with cached instant revisit shipped; legacy flat list migrates on rehydrate.
- **Status:** done

### S-07: Real D&D SRD corpus

- **Outcome:** user can look up keywords against the canonical license-free D&D corpus (not hardcoded samples).
- **Change ID:** dnd-srd-corpus
- **PRD refs:** FR-003, FR-004
- **Prerequisites:** S-02
- **Parallel with:** —
- **Blockers:** — (D&D SRD is CC BY 4.0)
- **Unknowns:** D&D phase taxonomy refinement — Owner: product. Block: no for v1.
- **Risk:** 228-entry static JSON (table-only entries filtered); rebuild via `npm run corpus:build-dnd`. v2 adds phase rulesets from Open5e rulesets.
- **Status:** done

### S-08: Real WH40k core rules corpus (personal)

- **Outcome:** user can look up WH40k core-rule keywords from the official free Core Rules PDF, built locally.
- **Change ID:** wh40k-core-corpus
- **PRD refs:** FR-003, FR-004
- **Prerequisites:** S-02, `context/foundation/distribution-policy.md`
- **Parallel with:** S-09
- **Blockers:** public deploy blocked until GW consultation; personal/local build OK
- **Risk:** Curated brief summaries + PDF page citations; 48 keywords; local full build via `npm run corpus:build-wh40k`; public preview uses paraphrased samples via `npm run corpus:build-samples`.
- **Status:** done

### S-09: Real StarCraft TMG corpus (personal)

- **Outcome:** user can look up StarCraft TMG keywords from the official free rulebook PDF, built locally.
- **Change ID:** starcraft-core-corpus
- **PRD refs:** FR-003, FR-004
- **Prerequisites:** S-02, distribution policy
- **Parallel with:** S-08
- **Blockers:** public deploy blocked until Archon consultation; personal/local build OK
- **Risk:** Curated brief summaries + PDF page citations; 17 keywords; local build via `npm run corpus:build-starcraft`.
- **Status:** done

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | shareable-web-deploy | Deploy Keyword Lexicanum preview to Vercel | yes | Unblocks table-side testing |
| S-01 | system-picker-local | Polish system picker for mobile web | yes | Scaffold exists |
| S-02 | keyword-lookup-citation | Ship keyword lookup with citation UX | yes | North star — sample corpus OK for v1 demo |
| S-03 | phase-on-keyword | Show phase relevance on keyword results | yes | Shipped |
| S-04 | browse-by-phase | Browse keywords by phase name | yes | Shipped |
| S-05 | guided-suggestions | Add guided keyword suggestions | yes | Shipped |
| S-06 | recent-lookups | Persist and show recent session lookups | yes | Shipped |
| S-07 | dnd-srd-corpus | Ingest D&D SRD corpus for real lookups | yes | Shipped — public OK |
| S-08 | wh40k-core-corpus | Build WH40k corpus from GW free PDF (local) | yes | Personal use; consult GW before public |
| S-09 | starcraft-core-corpus | Build StarCraft corpus from Archon free PDF (local) | yes | Personal use; consult Archon before public |
| S-10 | pf2e-srd-corpus | Ingest Pathfinder 2e ORC SRD manifest | yes | Shipped — 66 keywords |
| S-11 | yze-srd-corpus | Ingest Year Zero Engine FTL SRD manifest | yes | Shipped — 38 keywords |
| S-12 | dnd-srd-deepen | Deepen D&D phase rulesets and rebuild v2 corpus | yes | Shipped — v2 rebuild |

## Post-MVP horizon

MVP slices and test-plan rollout are complete. **Build priority (2026-07-07):** finish all SRD systems and main web-app quality first; keep WH40k and StarCraft as **Demo** (sample corpora) until the very end; **defer publisher outreach** until after that work ships.

| Priority | ID | Change ID | Outcome | Status | Notes |
|----------|-----|-----------|---------|--------|-------|
| 1 | S-16 | corpus-expansion | Grow D&D / PF2e / YZE manifests from table feedback | ongoing | v4 batch shipped — PF2e 75, YZE 59 keywords |
| 1 | — | m3l2-tdd | Ad-hoc tests via `/10x-tdd` + test-plan §6 cookbook | in progress | Quality contract for day-to-day test authoring |
| 2 | S-14 | field-table-test | Validate SRD lookup flow on phone at a live game | checklist ready | Manual — README field table test § |
| 2 | S-17 | offline-pwa | Service worker / IndexedDB corpus cache | parked | Only if field test (S-14) demands it |
| **last** | S-15 | publisher-outreach | GW / Archon permission for Demo-tier full corpus | **deferred** | After SRD + web app complete; see `distribution-policy.md` |
| **last** | — | demo-promotion | Promote WH40k / StarCraft from sample to full public corpus | **deferred** | Blocked on S-15; samples stay in production until then |

## Open Roadmap Questions

1. **Exact game-phase taxonomy per system** (Engagement, etc.) — Owner: product/build. Block: refines browse quality, not v1 demo.
2. **GW / Archon permission for public corpus** — Owner: product. **Deferred** until SRD + main web app work is complete; Demo samples remain in production until then.
3. **US-02 for phase-based keyword browse** — Owner: product. Block: roadmap-wide acceptance criteria only.

## Parked

- **Native mobile app** — Why parked: PRD §Non-Goals; web-first per pivot; Expo code in `mobile-expo-archive/`.
- **GM/DM campaign tooling** — Why parked: PRD §Non-Goals.
- **Full rules adjudication** — Why parked: PRD §Non-Goals.
- **Real-time multi-player table sync** — Why parked: PRD §Non-Goals.
- **D&D extension manuals** — Why parked: PRD §Non-Goals.
- **Voice-first input** — Why parked: PRD §Non-Goals.
- **User accounts / cloud sync** — Why parked: PRD §Non-Goals.
- **Publisher outreach (GW / Archon)** — Why parked: product decision 2026-07-07 — finish SRD depth and main web app first; WH40k and StarCraft stay Demo (sample corpora) until the very end. See S-15 in Post-MVP horizon.
- **Warhammer: The Old World** — Why dropped: no free core rules PDF; paid rulebook only. Out of scope unless GW publishes a free core document.
- **Offline corpus / service worker** — Why parked: speed path; NFR defers IndexedDB to post-MVP unless table testing (S-14) demands it.
- **Age of Sigmar** — Why parked: free core rules exist on Warhammer Community, but same GW republication constraints as 40k; only after S-15 publisher outreach if ever pursued.

## Done

- **S-01: user can select which game system is active and use a local browser profile with no login.** — Archived 2026-06-28 → `context/archive/2026-06-24-system-picker-local/`. Lesson: —.
- **S-02: user can look up a keyword or rule term and receive an in-context explanation grounded in the active system's corpus with a clear citation.** — Archived 2026-06-24 → `context/archive/2026-06-24-keyword-lookup-citation/`. Lesson: —.
- **F-01: (foundation) production preview URL on Vercel so testers can open the app on a phone browser at the table.** — Archived 2026-06-24 → `context/archive/2026-06-24-shareable-web-deploy/`. Preview: https://keyword-lexicanum.vercel.app. Lesson: —.
- **S-05: user can pick from guided keyword suggestions while searching, not only free typing.** — Archived 2026-06-24 → `context/archive/2026-06-24-guided-suggestions/`. Lesson: prefix match + corpus-only suggestions keeps table flow fast at sample corpus scale.
- **S-06: user can view recent keyword lookups from the current session without re-querying.** — Archived 2026-06-24 → `context/archive/2026-06-24-recent-lookups/`. Lesson: per-system recents + hit cache satisfies FR-005 without a server round-trip.
- **S-03: user can see which game phase a keyword applies to (or that it does not apply outside that phase).** — Archived 2026-06-24 → `context/archive/2026-06-24-phase-on-keyword/`. Lesson: restricted vs general applicability banners carry FR-007 until real corpus refines phase names.
- **S-04: user can enter a phase name and browse keywords relevant to that phase.** — Archived 2026-06-24 → `context/archive/2026-06-24-browse-by-phase/`. Lesson: phase chips + keyword list on home panel keeps browse in the lookup flow without a separate tab.
- **S-07: user can look up keywords against the canonical license-free D&D corpus (not hardcoded samples).** — Change docs at `context/changes/dnd-srd-corpus/`. Lesson: static SRD JSON + alias map keeps bundle small; D&D is the public-corpus wedge.
