# Keyword Lookup with Citation Implementation Plan

## Overview

Polish S-02 — the north-star keyword lookup flow — so a player on the active game system receives a grounded explanation with a low-clutter, collapsible citation, or a visually distinct not-found state. Expand the in-memory sample corpus, formalize the lookup contract, add vitest coverage, and refine the Lookup page UI. Guided suggestions (S-05), recent-lookups polish (S-06), and real corpus ingestion (S-07) stay out of scope.

## Current State Analysis

The lookup path is wired end-to-end but demo-thin:

- **`src/lib/lookup.ts`** — `SAMPLE_CORPUS` has 2–3 terms per system; `lookupKeyword` returns a flat `LookupResult` where not-found reuses the same shape with an explanation string; `offlineNote` is returned on every response.
- **`src/app/lookup/page.tsx`** — submit-only search (Enter + button); single result card for hit and miss; citation always visible as `Source: …`; phase shown when present; recent lookups rendered inline (unchanged this slice).
- **Tests** — none; `package.json` has no test runner.
- **PRD alignment** — US-01 not-found AC met in logic but not UX; FR-004 citation exists but not low-clutter (always visible + dev banner noise).

### Key Discoveries:

- `src/store/session.ts:38` — default `activeSystemId: 'dnd5e-srd'` so Lookup works without visiting System tab first.
- `lib/lookup.ts` at repo root is a stale Expo-era duplicate; active import path is `@/lib/lookup` → `src/lib/lookup.ts`.
- Roadmap explicitly allows sample corpus for S-02 done; S-07 owns real D&D SRD ingestion.

## Desired End State

After this plan:

1. `lookupKeyword` returns a discriminated result (`found: true | false`) without user-facing dev notes.
2. ~8–12 curated sample terms per system cover hits, misses, and phase-tagged entries.
3. Lookup page renders success vs not-found via a dedicated result component; citation collapses by default.
4. `npm run test` runs vitest unit tests for lookup match/not-found behavior per system.
5. Manual verification on a phone-width browser confirms table-speed submit flow.

## What We're NOT Doing

- Guided keyword suggestions (S-05 / FR-002 partial)
- Recent-lookups UI polish (S-06 / FR-005)
- Real rules corpus ingestion, IndexedDB, FTS, RAG (S-07)
- Citation excerpt quotes from source text (forward-compatible collapse only)
- Phase taxonomy resolution (roadmap OQ-1)
- API routes, server-side lookup, auth
- E2E or component test suite
- Removing or refactoring recent-lookups block (leave as-is)

## Implementation Approach

Two incremental phases: (1) lookup contract, expanded corpus, vitest, and result UI in one atomic delivery; (2) search UX tweaks and final manual verification gate. Each phase ends with automated checks plus a manual pause before the next.

## Phase 1: Lookup Contract, Corpus & Result UI

### Overview

Formalize the lookup API, expand sample data, add vitest, remove dev-facing fields, and ship `LookupResultCard` with distinct success/not-found styling and collapsible citation — atomically with the type change so typecheck/build never break mid-stream.

### Changes Required:

#### 1. Vitest setup

**File**: `package.json`

**Intent**: Add a `test` script and vitest dev dependency so lookup logic has an automated verification gate.

**Contract**: New scripts `"test": "vitest run"` and `"test:watch": "vitest"`; devDependency `vitest` (latest compatible with TypeScript 5).

**File**: `vitest.config.ts` (new)

**Intent**: Configure vitest to resolve `@/` path alias consistent with `tsconfig.json`.

**Contract**: `resolve.alias` maps `@` → `./src`; test file pattern `src/**/*.test.ts`.

#### 2. Lookup types and corpus

**File**: `src/lib/lookup.ts`

**Intent**: Expand `SAMPLE_CORPUS` to ~8–12 curated entries per `GameSystemId` including terms that exercise phase metadata and terms reserved for not-found tests. Replace flat miss handling with an explicit discriminated union.

**Contract**:

- Export types:
  - `LookupHit = { found: true; keyword: string; explanation: string; phase?: string; citation: string }`
  - `LookupMiss = { found: false; query: string }`
  - `LookupResult = LookupHit | LookupMiss`
- `lookupKeyword(rawQuery, systemId)` returns `LookupMiss` when query is empty/whitespace-only OR no exact normalized match.
- Remove `offlineNote` from all return paths.
- Keep `normalize()` as trim + lowercase; matching remains exact on normalized keyword.
- Preserve `getKeywordsForPhase` signature; update if new corpus entries affect phase filters.

**File**: `src/lib/lookup.test.ts` (new)

**Intent**: Lock match/not-found behavior per system without UI coupling.

**Contract**: Tests cover at minimum:
- Known hit per system (e.g. `advantage` / `close quarters` / `engagement`)
- Case-insensitive match
- Unknown term → `{ found: false }`
- Empty/whitespace query → miss
- Hit includes required `citation` string

#### 3. Stale duplicate cleanup

**File**: `lib/lookup.ts` (repo root)

**Intent**: Delete unused Expo-era duplicate to prevent drift.

**Contract**: Grep confirms no imports of root `lib/lookup.ts`; delete file.

#### 4. LookupResultCard component

**File**: `src/components/LookupResultCard.tsx` (new)

**Intent**: Centralize result presentation; success and not-found are visually distinct; citation collapsed by default.

**Contract**:

- Props: `result: LookupResult`, `systemLabel: string` (required — lookup page passes `activeSystem.label` whenever a result card renders)
- **`found: true` branch:**
  - Card with existing dark theme (`bg-[#1a1a2e]`, rounded-xl)
  - Heading: keyword (title case as stored)
  - Optional phase line: `Applies during: {phase}` (unchanged copy/styling)
  - Body: explanation
  - Citation row: button/disclosure labeled `Source` with chevron or expand hint (e.g. ▼ / "Show source") when collapsed; expanded state shows citation text + collapse control (e.g. ▲ / "Hide source"); click toggles state
  - Accessible: use `<button type="button">` with `aria-expanded`
- **`found: false` branch:**
  - Distinct card: muted border/background (e.g. border `[#3a3a55]`, no accent heading)
  - Heading: `Not found`
  - Body: `{query}` quoted + short guidance ("Not in the loaded rules for {systemLabel}. Check spelling or try another term.")
  - No citation block, no phase line, no fabricated explanation

#### 5. Lookup page integration

**File**: `src/app/lookup/page.tsx`

**Intent**: Consume new `LookupResult` type; delegate rendering to `LookupResultCard`; stop adding recent lookup on miss (only record successful lookups).

**Contract**:

- Update `onSearch`: call `lookupKeyword`; `addRecentLookup(trimmed)` only when `result.found === true`
- Replace inline result `<div>` with `<LookupResultCard result={result} systemLabel={activeSystem.label} />`
- Remove rendering of `offlineNote` (field no longer exists)

### Success Criteria:

#### Automated Verification:

- Dependencies install cleanly: `npm install`
- Unit tests pass: `npm run test`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Build passes: `npm run build`

#### Manual Verification:

- Known term shows success card with collapsed Source; tap expands/collapses
- Unknown term shows distinct not-found card — no Source, no fake explanation
- Phase line still appears for phase-tagged sample entries (e.g. `close quarters`)
- Recent lookups list only grows on successful hits

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Search Polish & Verification

### Overview

Small Lookup page UX improvements for table-side mobile use; final manual smoke checklist.

### Changes Required:

#### 1. Search input polish

**File**: `src/app/lookup/page.tsx`

**Intent**: Improve mobile search affordance without live/debounced search.

**Contract**:

- Input: `type="search"`, `enterKeyHint="search"`, `autoComplete="off"`
- Disable Look up button while `loading` or query is whitespace-only
- Loading state: replace text-only "Searching…" with subtle inline indicator (text + optional CSS pulse on button) — keep minimal, no new dependencies
- Preserve submit-on-Enter and button click only (no `onChange` auto-search)

### Success Criteria:

#### Automated Verification:

- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Build passes: `npm run build`
- Unit tests pass: `npm run test`

#### Manual Verification:

- Phone-width browser (375px): search input and button usable one-handed; no horizontal scroll
- Submit unknown then known term: states transition cleanly; no stale success card flash
- Switch system on System tab → Lookup tab: query for system-specific term resolves correctly
- Perceived lookup latency under 3 seconds on local dev (instant for in-memory corpus)
- Run through one WH40k demo path: `close quarters` → see Engagement phase + collapsed citation

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- `lookupKeyword` hit/miss per `GameSystemId`
- Normalization edge cases (leading/trailing space, mixed case)
- Empty query returns miss
- Hit always includes non-empty `citation`

### Integration Tests:

- None for S-02 (deferred)

### Manual Testing Steps:

1. Open `/lookup` with default D&D system; search `advantage` → success + collapsed Source
2. Search `xyznotaterm` → distinct not-found card
3. Switch to WH40k on System tab; search `close quarters` → phase + citation
4. Confirm recent lookups skips failed searches
5. Resize to mobile width; verify tap targets and citation toggle

## Performance Considerations

In-memory exact match on ≤40 corpus entries is negligible. No caching layer needed. Guard against future corpus growth by keeping lookup O(n) scan documented in code comment only if n stays small.

## Migration Notes

Not applicable — no persisted data or API changes. `LookupResult` shape change is internal to lookup page + new component.

## References

- PRD US-01, FR-002 (typing only this slice), FR-003, FR-004: `context/foundation/prd.md`
- Roadmap S-02: `context/foundation/roadmap.md`
- Current lookup logic: `src/lib/lookup.ts`
- Current lookup UI: `src/app/lookup/page.tsx`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Lookup Contract, Corpus & Result UI

#### Automated

- [x] 1.1 Dependencies install cleanly: `npm install`
- [x] 1.2 Unit tests pass: `npm run test`
- [x] 1.3 Type checking passes: `npm run typecheck`
- [x] 1.4 Linting passes: `npm run lint`
- [x] 1.5 Build passes: `npm run build`

#### Manual

- [x] 1.6 Known term shows success card with collapsed Source; tap expands/collapses
- [x] 1.7 Unknown term shows distinct not-found card — no Source, no fake explanation
- [x] 1.8 Phase line still appears for phase-tagged sample entries
- [x] 1.9 Recent lookups list only grows on successful hits

### Phase 2: Search Polish & Verification

#### Automated

- [x] 2.1 Type checking passes: `npm run typecheck`
- [x] 2.2 Linting passes: `npm run lint`
- [x] 2.3 Build passes: `npm run build`
- [x] 2.4 Unit tests pass: `npm run test`

#### Manual

- [x] 2.5 Phone-width browser: search input and button usable; no horizontal scroll
- [x] 2.6 Submit unknown then known term: states transition cleanly
- [x] 2.7 Switch system → Lookup: system-specific term resolves correctly
- [x] 2.8 Perceived lookup latency under 3 seconds on local dev
- [x] 2.9 WH40k demo path: `close quarters` → Engagement phase + collapsed citation
