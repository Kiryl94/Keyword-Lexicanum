# Guided Keyword Suggestions — Plan Brief

> Full plan: `context/changes/guided-suggestions/plan.md`

## What & Why

New players struggle to guess exact keyword spellings in dense rulebooks. FR-002 requires lookup by typing **or** selecting guided suggestions. S-05 adds a filter-as-you-type suggestion list sourced from the active system's sample corpus so novices can discover and pick valid terms without memorizing names.

## Starting Point

Lookup works end-to-end via `LookupPanel` (submit-only search input + button). `SAMPLE_CORPUS` in `src/lib/lookup.ts` holds ~11 curated keywords per system. `lookupKeyword` matches exact normalized terms. Recent lookups render separately below results. No suggestion or autocomplete UI exists.

## Desired End State

After typing one or more characters, the user sees a filtered dropdown of corpus keywords for the active system. Tapping a suggestion immediately runs lookup (same as pressing Look up). Empty input shows no suggestions. Recent lookups remain a separate section. Unit tests cover suggestion filtering per system.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| UI pattern | Filter-as-you-type dropdown | Scales with corpus; familiar search UX |
| Pick behavior | Auto-run lookup on pick | Fastest table flow — one tap to answer |
| Empty input | Suggestions only after 1+ characters | Cleaner default view; user steered away from browse-all |
| Suggestion source | Corpus keywords only | Suggestions always match valid lookup hits |
| Recent lookups | Keep separate section | Clear browse vs session-repeat semantics |

## Scope

**In scope:**

- `getKeywordSuggestions` API in `src/lib/lookup.ts`
- Vitest coverage for filtering, case insensitivity, per-system isolation, empty query
- Typeahead dropdown UI in `LookupPanel`
- Auto-submit on suggestion pick
- Mobile-friendly tap targets

**Out of scope:**

- Suggestions when input is empty (browse-all mode)
- Merging suggestions with recent lookups
- Fuzzy/FTS search, server API, IndexedDB corpus (S-07)
- Phase-based suggestion grouping (S-03/S-04)
- E2E or component test suite
- Voice input

## Architecture / Approach

Add `getKeywordSuggestions(query, systemId)` that normalizes input and returns corpus keywords whose normalized form **starts with** the query (case-insensitive), sorted alphabetically, capped (~8). `LookupPanel` renders a suggestion list below the search input when `query.trim().length >= 1` and suggestions exist; pick calls existing `onSearch(term)`. Recent lookups block unchanged.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Suggestion API | `getKeywordSuggestions` + unit tests | Prefix vs substring matching semantics |
| 2. Typeahead UI | Dropdown in LookupPanel, auto-search on pick | Dropdown overlap/z-index on mobile |

**Prerequisites:** S-02 lookup flow (done)  
**Estimated effort:** ~1 session across 2 phases

## Open Risks & Assumptions

- Prefix matching means typing middle of a term (e.g. "quarters" for "close quarters") won't surface the keyword — acceptable for v1 sample corpus size
- S-07 real corpus may require pagination/virtualization later; cap at 8 keeps UI simple now

## Success Criteria (Summary)

- User types partial keyword → sees matching corpus suggestions
- Tapping a suggestion shows lookup result without pressing Look up
- Empty input shows no suggestion list
- Recent lookups still work independently
