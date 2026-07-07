# System Isolation & Lookup Grounding Tests — Implementation Plan

## Overview

Add six Vitest unit tests to lock Risks #1 and #3 from `context/foundation/test-plan.md` Phase 1. No production code changes unless a test reveals a real bug. Cheapest layer: extend `src/lib/lookup.test.ts` and `src/store/session.test.ts`.

## Current State Analysis

- **Research:** `research.md` maps failure paths and recommends T1–T6.
- **Existing coverage:** Per-system recents/cache (`session.test.ts:91-147`); lookup hits/misses per system (`lookup.test.ts`); system-scoped suggestions/phases.
- **Gaps:** Cross-corpus negatives, switch sequence with `setActiveSystem`, stale `corpusVersion` cache rejection.

## Desired End State

- Six new tests pass in `npm test`.
- `context/foundation/test-plan.md` §6.1 cookbook placeholder can be filled after implement epilogue.
- Phase 1 rollout status → `complete`.

## What We're NOT Doing

- React Testing Library or component tests (Phase 3).
- Corpus build script tests (Phase 2).
- CI lint/build gates (Phase 4).
- Production code refactors unless tests expose a defect.

## Implementation Approach

Two phases: (1) lookup cross-corpus + corpusVersion tests, (2) session switch sequence + stale cache tests. Single commit after full suite passes.

## Phase 1: Lookup cross-corpus & corpusVersion

### Overview

Prove `lookupKeyword` never returns another system's entries and stamps `corpusVersion` on hits.

### Changes Required

#### 1. Cross-corpus negative tests (`lookup.test.ts`)

- `close quarters` under `dnd5e-srd` → `{ found: false }` (WH40k-only term).
- `engagement` under `dnd5e-srd` → miss; under `starcraft-mini` → hit with keyword `Engagement`.

#### 2. corpusVersion on hits (`lookup.test.ts`)

- One known hit per system (`dnd5e-srd`, `wh40k-11`, `starcraft-mini`) asserts `corpusVersion === getCorpusVersion(systemId)`.

### Success Criteria

#### Automated

- [ ] `npm test` passes with new lookup tests.

#### Manual

- None — pure unit tests.

## Phase 2: Session switch sequence & stale cache

### Overview

Prove recents/cache stay partitioned across `setActiveSystem` and stale cache entries are ignored.

### Changes Required

#### 1. Switch sequence (`session.test.ts`)

- Record WH40k hit → `setActiveSystem('dnd5e-srd')` → D&D recents empty, WH40k recents unchanged.
- Full sequence: D&D hit → switch WH40k → WH40k hit → switch back → each bucket only its keywords.

#### 2. Stale cache (`session.test.ts`)

- Record hit with mismatched `corpusVersion` → `getCachedLookup` returns `undefined`.

### Success Criteria

#### Automated

- [ ] `npm test` — full suite green (49 + 6 = 55 tests expected).

#### Manual

- None.

## Progress

- [x] 1.1 Cross-corpus negative lookup tests
- [x] 1.2 corpusVersion stamped on all system hits
- [x] 2.1 Switch sequence isolates recents per system
- [x] 2.2 Stale corpusVersion cache rejected
