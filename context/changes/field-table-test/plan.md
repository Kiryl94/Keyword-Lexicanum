# Plan: Field table test (S-14)

## Desired end state

README contains a step-by-step field-test checklist a player can run on their phone during a live session. Checklist covers all three SRD systems, system switching, phase browse, and recents. Tester records pass/fail in this plan's Progress section.

## Phase 1: Write field-test checklist

### Changes Required

- Add `## Field table test` section to `README.md` with:
  - Prerequisites (phone browser, preview URL, optional local dev)
  - Per-system lookup smoke (D&D, PF2e, YZE) with specific terms
  - System-switch isolation check (lookup + recents)
  - Phase browse spot-check
  - Demo tier spot-check (WH40k sample)
  - Pass/fail recording template

### Success Criteria

- Checklist is self-contained; no code changes required to run it.
- Terms match committed corpora (oracle keywords from manifests).

## Phase 2: Execute at table (manual)

### Changes Required

- Human runs checklist on phone at a live game session.
- Record results in Progress below.

### Success Criteria

- All automated deploy-verify steps from README still pass.
- Field checklist completed with notes on any failures.

## References

- `context/foundation/roadmap.md` — S-14
- `context/foundation/test-plan.md` — §5 optional e2e table-smoke

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Write field-test checklist

#### Automated

- [x] 1.1 Add field table test section to README

#### Manual

- [ ] 1.2 Review checklist for completeness

### Phase 2: Execute at table (manual)

#### Manual

- [ ] 2.1 Run full checklist on phone at live session
- [ ] 2.2 Record pass/fail and notes
