---
change_id: m3l2-srd-phase-browse-tests
title: M3L2 — SRD phase browse behavioral tests
status: archived
created: 2026-07-07
updated: 2026-07-07
archived_at: 2026-07-07T12:00:00Z
---

## Notes

M3L2 ad-hoc testing exercise per `context/foundation/test-plan.md` §6.1 and PRD FR-008 (browse keywords by phase). Oracle: committed SRD corpora and phase labels in manifests — not copied from implementation strings.

**Behaviors under test:**
- `getPhasesForSystem` returns sorted unique phases per SRD system
- `getKeywordsForPhase` scopes results to active system and matches phase substrings case-insensitively
- `CitationBlock` exposes a page-linked citation affordance when source metadata exists
