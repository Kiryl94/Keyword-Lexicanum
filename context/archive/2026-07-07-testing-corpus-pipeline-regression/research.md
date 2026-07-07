---
date: 2026-07-07T11:00:00+02:00
researcher: Cursor Agent
branch: main
repository: keyword-lexicanum
topic: "Rollout Phase 2 — corpus pipeline regression (Risks #2, #5)"
tags: [research, testing, corpus, test-plan]
status: complete
last_updated: 2026-07-07
---

# Research: Corpus pipeline regression guards

**Test plan**: `context/foundation/test-plan.md` Phase 2 — Risks #2, #5

## Research Question

How can build-time tests catch silent keyword drops and wrong public corpus bundle targets for Demo-tier systems?

## Summary

**Risk #2:** Build scripts (`scripts/build-*-corpus.mjs`) write JSON with `entryCount`. Curated manifests (`pf2e-rules-manifest.mjs`, `yze-rules-manifest.mjs`) can drift from output if someone edits JSON by hand. Guard: assert manifest length === corpus `entryCount` === `entries.length`.

**Risk #5:** `next.config.ts` and `vitest.config.ts` alias `@/data/wh40k-active-corpus.json` and `@/data/starcraft-active-corpus.json` to `*.sample.json`. A wrong alias or env override could bundle gitignored local corpora on a developer machine. Guard: read alias targets from config files and assert they resolve to committed sample paths; assert sample JSON uses `license: sample-only`.

**Cheapest layer:** Vitest integration tests in `scripts/*.test.mjs` beside build utilities — no full corpus snapshots.

## Recommended tests

| # | Test file | Proves |
|---|-----------|--------|
| T1 | `sample-corpus-guard.test.mjs` | WH40k/StarCraft samples: entryCount, license, alias paths |
| T2 | `srd-corpus-guard.test.mjs` | PF2e/YZE manifest === committed JSON counts |

## Code References

- `scripts/sample-corpus-guard.test.mjs`
- `scripts/srd-corpus-guard.test.mjs`
- `next.config.ts` — corpus aliases
- `vitest.config.ts` — test alias mirror
