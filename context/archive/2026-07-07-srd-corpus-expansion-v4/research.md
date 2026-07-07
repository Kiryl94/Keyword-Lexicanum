---
topic: SRD corpus expansion v4
researcher: agent
created: 2026-07-07
---

# Research: SRD corpus expansion v4

## Current state

| System | Manifest | Committed corpus | Version |
|--------|----------|------------------|---------|
| PF2e | 66 entries | 66 | `pf2e-remaster-v2` |
| YZE | 53 entries | 53 | `yze-srd-v3` |
| D&D | Open5e + conditions API | 236 | `5.2.1-lookup-v3` |

Build: `npm run corpus:build-pf2e`, `npm run corpus:build-yze`, `npm run corpus:build-dnd`.
Guard: `scripts/srd-corpus-guard.test.mjs` asserts manifest length === corpus `entryCount`.

## Gaps (high table frequency, absent from manifests)

**PF2e:** Reactive Strike (remaster name for AoO), Reach, Confused, Fascinated, Petrified, Fortitude/Reflex/Will saves, Degree of Success.

**YZE:** Group Roll, Suppressive Fire, Overwatch, Mixed Success, Recon, Shelter.

## Code references

- `scripts/pf2e-rules-manifest.mjs` — curated ORC entries
- `scripts/yze-rules-manifest.mjs` — curated FTL entries
- `scripts/build-pf2e-srd-corpus.mjs` — writes `src/data/pf2e-srd-corpus.json`
- `scripts/build-yze-srd-corpus.mjs` — writes `src/data/year-zero-engine-srd-corpus.json`
- `src/lib/lookup.test.ts` — M3L2 oracle tests (independent of summary strings)

## Constraints

- Paraphrased summaries only — not verbatim publisher text (`distribution-policy.md`).
- Version bump on each corpus rebuild.
- No Demo-tier (WH40k/StarCraft) changes.
