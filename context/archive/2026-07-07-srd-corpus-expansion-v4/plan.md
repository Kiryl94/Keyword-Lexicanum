# Plan: SRD corpus expansion v4

## Desired end state

PF2e corpus grows by 9 keywords (66 → 75), YZE by 6 (53 → 59). Rebuilt JSON committed with bumped versions. Lookup tests pin one new term per system. All tests pass.

## Phase 1: Expand PF2e manifest and rebuild

### Changes Required

- Add 9 entries to `scripts/pf2e-rules-manifest.mjs`: Reactive Strike, Reach, Confused, Fascinated, Petrified, Fortitude Save, Reflex Save, Will Save, Degree of Success.
- Bump version in `scripts/build-pf2e-srd-corpus.mjs` to `pf2e-remaster-v3`.
- Run `npm run corpus:build-pf2e`.

### Success Criteria

- PF2e manifest length === corpus `entryCount` === 75.
- `npm test` passes (srd-corpus-guard).

## Phase 2: Expand YZE manifest and rebuild

### Changes Required

- Add 6 entries to `scripts/yze-rules-manifest.mjs`: Group Roll, Suppressive Fire, Overwatch, Mixed Success, Recon, Shelter.
- Bump version in `scripts/build-yze-srd-corpus.mjs` to `yze-srd-v4`.
- Run `npm run corpus:build-yze`.

### Success Criteria

- YZE manifest length === corpus `entryCount` === 59.
- `npm test` passes.

## Phase 3: M3L2 lookup regression tests

### Changes Required

- Add lookup tests in `src/lib/lookup.test.ts` for `reactive strike` (PF2e) and `group roll` (YZE) — oracle: keyword exists in committed corpus, not copied explanation text.

### Success Criteria

- New tests pass; full suite green.

## References

- `context/foundation/roadmap.md` — S-16
- `context/foundation/test-plan.md` — §6.1
- `context/changes/srd-corpus-expansion-v4/research.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Expand PF2e manifest and rebuild

#### Automated

- [x] 1.1 Add PF2e manifest entries and rebuild corpus
- [x] 1.2 Run full test suite

### Phase 2: Expand YZE manifest and rebuild

#### Automated

- [x] 2.1 Add YZE manifest entries and rebuild corpus
- [x] 2.2 Run full test suite

### Phase 3: M3L2 lookup regression tests

#### Automated

- [x] 3.1 Add lookup regression tests for new keywords
- [x] 3.2 Run full test suite
