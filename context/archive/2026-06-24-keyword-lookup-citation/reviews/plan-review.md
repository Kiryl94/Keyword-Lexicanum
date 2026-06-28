<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Keyword Lookup with Citation

- **Plan**: `context/changes/keyword-lookup-citation/plan.md`
- **Mode**: Deep
- **Date**: 2026-06-24
- **Verdict**: SOUND
- **Findings**: 1 critical, 2 warnings, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | PASS |
| Lean Execution | PASS |
| Architectural Fitness | PASS |
| Blind Spots | PASS |
| Plan Completeness | PASS |

## Grounding

Grounding: 6/6 paths ✓, 3/3 symbols ✓ (`lookupKeyword`, `getKeywordsForPhase`, `LookupResult`), brief↔plan ✓

## Findings

### F1 — Phase 1 type change breaks typecheck before Phase 2

- **Severity**: ❌ CRITICAL
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Plan Completeness
- **Location**: Phase 1 — Lookup types; Phase 1 Success Criteria
- **Detail**: Phase 1 introduces `LookupHit | LookupMiss` but leaves `src/app/lookup/page.tsx` unchanged until Phase 2. The page currently accesses `result.keyword`, `result.explanation`, `result.citation`, and `result.offlineNote` unconditionally (`lookup/page.tsx:61–74`). After the union change, `npm run typecheck` and `npm run build` — both Phase 1 automated gates — will fail. Phase 1 cannot complete as written.
- **Fix A ⭐ Recommended**: Add a minimal `lookup/page.tsx` update to Phase 1 — narrow on `result.found` before rendering hit fields; show a simple interim miss state (plain text OK). Phase 2 then replaces inline rendering with `LookupResultCard`.
  - Strength: Phase 1 exit criteria become honest; no broken build between phases.
  - Tradeoff: Lookup page touched in both phases (minimal edit, then component extraction).
  - Confidence: HIGH — TypeScript strict mode will fail on union access without narrowing.
  - Blind spot: None significant.
- **Fix B**: Merge Phase 1 and Phase 2 into a single phase ("Contract + UI").
  - Strength: One atomic delivery; no interim page state.
  - Tradeoff: Larger phase; loses incremental pause after corpus/tests land.
  - Confidence: HIGH — eliminates the gap entirely.
  - Blind spot: Phase effort estimate may need updating.
- **Decision**: FIXED via Fix B (merged Phase 1 + Phase 2); `systemLabel` required in Phase 1 props

### F2 — systemLabel prop deferred past when not-found copy needs it

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 1 — LookupResultCard
- **Detail**: Phase 2 required system label in not-found copy but deferred systemLabel prop to Phase 3.
- **Fix**: Move `systemLabel: string` into Phase 1 LookupResultCard props; remove duplicate Phase 3 section.
- **Decision**: FIXED — reinforced in merged Phase 1 contract

### F3 — Collapsed citation lacks affordance spec

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Phase 1 — LookupResultCard citation row
- **Detail**: Plan requires citation collapsed by default with a `Source` button and `aria-expanded`, but no visible affordance (chevron, "Tap to expand") is specified.
- **Fix**: Add chevron/expand hint to Phase 1 LookupResultCard contract.
- **Decision**: FIXED

### F4 — Phase 1 Progress manual step wording mismatch

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 1 — Manual Verification vs Progress
- **Detail**: Old Phase 1 said "tests suffice" but Progress had a vague manual step.
- **Fix**: Replaced with concrete UI manual checks (1.6–1.9) in merged Phase 1.
- **Decision**: FIXED
