# Guided Keyword Suggestions Implementation Plan

## Overview

Complete roadmap slice S-05: add corpus-driven, filter-as-you-type keyword suggestions to the lookup flow so players satisfy FR-002 without memorizing exact spellings. Suggestions appear only after the user types at least one character, auto-run lookup on pick, and stay separate from the existing Recent lookups section.

## Current State Analysis

Lookup is submit-only with no discovery aid for novices:

- **`src/lib/lookup.ts`** — `SAMPLE_CORPUS` holds ~11 curated entries per `GameSystemId`; `lookupKeyword` exact-matches normalized query; `getKeywordsForPhase` exists for phase browse (orphaned from UI after Phases tab removal) but no general keyword listing API.
- **`src/components/LookupPanel.tsx`** — search input + Look up button; recent lookups as tappable links below results; no autocomplete or suggestion list.
- **Tests** — `src/lib/lookup.test.ts` covers hit/miss; no suggestion tests.
- **Layout** — Desktop merged home (`src/app/page.tsx`) and mobile `/lookup` both render `LookupPanel`; changes apply to both automatically.

### Key Discoveries:

- S-02 archived plan explicitly deferred guided suggestions to S-05 (`context/archive/2026-06-24-keyword-lookup-citation/plan.md`).
- Corpus size (~11 terms/system) makes client-side prefix filter sufficient — no FTS needed for this slice.
- User chose **prefix match** implicitly via filter-as-you-type; plan uses `startsWith` on normalized strings for predictable typeahead behavior.

## Desired End State

After this plan:

1. `getKeywordSuggestions(query, systemId)` returns sorted, capped keyword strings from `SAMPLE_CORPUS` when `query` has ≥1 non-whitespace character; returns `[]` when empty.
2. `LookupPanel` shows a suggestion dropdown below the input when suggestions exist.
3. Selecting a suggestion auto-runs lookup (same path as Look up button).
4. Recent lookups section unchanged.
5. `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.

## What We're NOT Doing

- Browse-all suggestions on empty input
- Merging corpus suggestions with `recentLookups`
- Substring/fuzzy matching (middle-of-word discovery)
- Phase-grouped suggestion sections (S-03/S-04)
- Replacing or redesigning Recent lookups (S-06)
- Server API, IndexedDB, or real corpus ingestion (S-07)
- Keyboard roving focus beyond basic button/list semantics (defer full combobox ARIA pattern unless trivial)
- E2E or React component tests

## Implementation Approach

Two phases: (1) suggestion API + vitest — testable without UI; (2) typeahead dropdown wired into `LookupPanel` with manual mobile verification. Phase 2 depends on Phase 1's export.

## Phase 1: Suggestion API & Tests

### Overview

Add a corpus-backed suggestion function with deterministic prefix filtering and lock behavior with unit tests.

### Changes Required:

#### 1. Keyword suggestion API

**File**: `src/lib/lookup.ts`

**Intent**: Expose corpus keywords for typeahead filtering without duplicating corpus data.

**Contract**:

- Export `getKeywordSuggestions(rawQuery: string, systemId: GameSystemId, limit = 8): string[]`.
- Reuse existing `normalize()` helper.
- If `normalize(rawQuery)` is empty → return `[]`.
- Filter `(SAMPLE_CORPUS[systemId] ?? [])` entries where `normalize(entry.keyword).startsWith(normalizedQuery)`.
- Return matching keywords sorted alphabetically (locale `en`, case-insensitive sort via normalized comparison or `localeCompare` on display form).
- Cap result length at `limit` (default 8).
- Do not change `lookupKeyword` or `getKeywordsForPhase` signatures.

#### 2. Suggestion unit tests

**File**: `src/lib/lookup.test.ts`

**Intent**: Guard suggestion filtering independently of UI.

**Contract**:

- Empty/whitespace query → `[]`.
- Prefix match is case-insensitive (e.g. `"adv"` → includes `"advantage"` for D&D).
- Non-matching prefix → `[]`.
- Results scoped to `systemId` (WH40k term not returned for D&D).
- Respects `limit` cap when many entries match.
- Multi-word keyword: prefix on first word matches (e.g. `"close"` matches `"close quarters"`).

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Production build passes: `npm run build`

#### Manual Verification:

- None required for API-only phase (verified via unit tests)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that automated checks look good before proceeding to the next phase.

---

## Phase 2: Typeahead UI in Lookup Panel

### Overview

Render filter-as-you-type suggestions below the search input and wire pick → auto-search.

### Changes Required:

#### 1. Suggestion list component

**File**: `src/components/KeywordSuggestionList.tsx` (new)

**Intent**: Reusable presentational list for typeahead results with accessible tap/click targets.

**Contract**:

- Props: `suggestions: string[]`, `onSelect: (keyword: string) => void`, optional `className`.
- Render nothing when `suggestions.length === 0`.
- Unordered list or `role="listbox"` with each item as a `<button type="button">` (min touch height ~44px).
- Styling: dark card (`bg-[#1a1a2e]`, border `#2a2a40`, hover/focus accent) consistent with lookup input.
- `onSelect` fires with exact corpus keyword string on click.

#### 2. LookupPanel integration

**File**: `src/components/LookupPanel.tsx`

**Intent**: Show suggestions while typing and auto-run lookup when user picks one.

**Contract**:

- Import `getKeywordSuggestions` and `KeywordSuggestionList`.
- Derive suggestions from `query` + `activeSystem.id` on each render (or memoized when query/system changes).
- Show `KeywordSuggestionList` below search input when `query.trim().length >= 1` and suggestions non-empty.
- Hide suggestions while `loading` (optional — prevents double-submit confusion).
- On suggestion pick: set query to selected keyword and call `onSearch(selectedKeyword)` immediately.
- Do not modify Recent lookups block.
- Preserve existing Enter key + Look up button behavior for free-typed queries.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Production build passes: `npm run build`

#### Manual Verification:

- Type `"adv"` on D&D → see `advantage` suggestion → tap → result card appears without pressing Look up
- Type `"xyz"` → no suggestion list; Look up still shows not-found
- Empty input → no suggestion list
- Mobile (~375px): suggestion buttons easy to tap; list does not overflow viewport horizontally
- Desktop merged layout: suggestions appear in lookup column below input
- Recent lookups still work after using a suggestion

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking S-05 done.

---

## Testing Strategy

### Unit Tests:

- `getKeywordSuggestions` empty query, prefix match, case insensitivity, system isolation, limit cap, multi-word prefix

### Integration Tests:

- None in this slice

### Manual Testing Steps:

1. D&D: type `con` → pick `concentration` → hit card with citation
2. WH40k: type `eng` → pick `engagement` → hit with phase
3. Clear input → confirm no suggestions visible
4. Use suggestion then verify term appears in Recent lookups after successful hit
5. Phone-width smoke on `/lookup` and desktop `/`

## Performance Considerations

Negligible — linear scan of ~11 corpus entries per keystroke. No debounce required at current scale; optional 0ms memoization sufficient.

## Migration Notes

Not applicable — no persisted data changes. S-07 corpus expansion may require raising `limit` or adding virtualization later.

## References

- PRD FR-002: `context/foundation/prd.md`
- Roadmap S-05: `context/foundation/roadmap.md`
- Prior deferral: `context/archive/2026-06-24-keyword-lookup-citation/plan.md`
- Lookup panel: `src/components/LookupPanel.tsx`
- Corpus: `src/lib/lookup.ts`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Suggestion API & Tests

#### Automated

- [x] 1.1 Unit tests pass: `npm run test`
- [x] 1.2 Type checking passes: `npm run typecheck`
- [x] 1.3 Linting passes: `npm run lint`
- [x] 1.4 Production build passes: `npm run build`

#### Manual

- [x] 1.5 Automated checks reviewed — ready for Phase 2

### Phase 2: Typeahead UI in Lookup Panel

#### Automated

- [x] 2.1 Unit tests pass: `npm run test`
- [x] 2.2 Type checking passes: `npm run typecheck`
- [x] 2.3 Linting passes: `npm run lint`
- [x] 2.4 Production build passes: `npm run build`

#### Manual

- [x] 2.5 Type partial keyword → tap suggestion → result without Look up button
- [x] 2.6 Empty input shows no suggestions; unknown term still not-found via button
- [x] 2.7 Recent lookups unchanged and still tappable
- [x] 2.8 Phone-width and desktop smoke — suggestions usable, no horizontal overflow
