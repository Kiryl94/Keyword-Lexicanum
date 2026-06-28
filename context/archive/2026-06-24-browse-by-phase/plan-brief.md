# Browse Keywords by Phase — Plan Brief

> Full plan: `context/changes/browse-by-phase/plan.md`

## What & Why

FR-008 lets players discover keywords by game phase (e.g. everything relevant during Engagement). Lookup is keyword-first today; S-04 adds a phase-first browse path on the merged home page.

## Approach

- `getPhasesForSystem` + hardened `getKeywordsForPhase` with tests
- `PhaseBrowseSection` below recent lookups: phase input, quick-pick chips, tappable keyword list
