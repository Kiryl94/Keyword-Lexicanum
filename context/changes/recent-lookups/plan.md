# Recent Session Lookups Implementation Plan

## Overview

Complete roadmap slice S-06: scope recent lookups per game system, cache successful hit payloads, and show cached results instantly when the user taps a recent term.

## Phase 1: Session store

- Replace flat `recentLookups` with `recentLookupsBySystem` and `recentLookupCacheBySystem`
- Export `recordSuccessfulLookup(systemId, hit)`, `getRecentLookups(systemId)`, `getCachedLookup(systemId, keyword)`
- Migrate legacy `recentLookups` array into active system bucket in `sanitizePersistedProfile`
- Update `session.test.ts`

## Phase 2: Lookup UI

- Add `RecentLookupList` component (chip-style tappable list)
- Wire `LookupPanel` to per-system recents and cache-first revisit
- Manual: switch systems — recents change; tap recent — instant card

## Progress

### Phase 1: Session store

#### Automated

- [ ] 1.1 Unit tests pass: `npm run test`
- [ ] 1.2 Type checking passes: `npm run typecheck`
- [ ] 1.3 Linting passes: `npm run lint`
- [ ] 1.4 Production build passes: `npm run build`

### Phase 2: Lookup UI

#### Automated

- [ ] 2.1 Unit tests pass: `npm run test`
- [ ] 2.2 Type checking passes: `npm run typecheck`
- [ ] 2.3 Linting passes: `npm run lint`
- [ ] 2.4 Production build passes: `npm run build`

#### Manual

- [ ] 2.5 Lookup on D&D → recent appears → tap shows card without loading
- [ ] 2.6 Switch to WH40k → D&D recents hidden; WH40k list independent
- [ ] 2.7 Refresh browser → recents and instant revisit still work
