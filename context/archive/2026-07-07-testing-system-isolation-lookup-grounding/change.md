---
change_id: testing-system-isolation-lookup-grounding
title: System isolation and lookup grounding tests
status: archived
created: 2026-07-07
updated: 2026-07-07
archived_at: 2026-07-07
---

## Notes

Rollout Phase 1 of context/foundation/test-plan.md. Risks #1 (cross-system corpus/recents bleed) and #3 (ungrounded lookup / missing not-found).

Open a change folder for rollout Phase 1: prove system switch rebinds corpus + recents; lookup stays corpus-grounded.

Risk response intent:
- #1: After system switch, lookup and recents must use only the new system's corpus and session partition; challenge UI-only switch assertions; avoid testing one system without a switch sequence.
- #3: Known corpus terms return grounded summaries with citation metadata; unknown terms return explicit not-found; challenge oracle copied from formatter; avoid happy-path-only on a single keyword.
