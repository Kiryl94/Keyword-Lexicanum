# Real D&D SRD Corpus Implementation Plan

## Overview

Ship roadmap slice S-07: ingest the license-free D&D 5e SRD into a static JSON bundle and wire lookup, suggestions, and phase browse to it for `dnd5e-srd`. WH40k and Starcraft stay on inline sample corpora until licensing is confirmed.

## Current State (before)

- **`src/lib/lookup.ts`** — single `SAMPLE_CORPUS` with ~11 curated entries per system.
- **No build pipeline** for rules text; no attribution file.
- **Tests** — assertions against sample keywords like `advantage` (lowercase).

## Desired End State

1. `src/data/dnd5e-srd-corpus.json` — ~258 SRD entries with keyword, explanation, phase, citation.
2. `scripts/build-dnd-srd-corpus.mjs` — reproducible fetch from Open5e + SRD 5.2.1 conditions; `npm run corpus:build-dnd`.
3. `src/lib/corpus/dnd5e-srd.ts` — load bundle, alias map, prefix-uniqueness fallback.
4. `lookup.ts` routes `dnd5e-srd` to real corpus; other systems unchanged.
5. `src/data/SRD-ATTRIBUTION.md` — CC BY 4.0 notice.
6. All quality gates pass.

## What We're NOT Doing

- WH40k / Starcraft real corpus (licensing blocked)
- IndexedDB or service worker offline cache
- Truncating long explanations in UI (deferred)
- Refining phase taxonomy (user deferred until full sources)

## Implementation Summary

| Area | Change |
|---|---|
| Data | `dnd5e-srd-corpus.json` + attribution |
| Build | `build-dnd-srd-corpus.mjs`, `corpus:build-dnd` script |
| Loader | `src/lib/corpus/types.ts`, `dnd5e-srd.ts` |
| Lookup | Split D&D from `SAMPLE_CORPUS` |
| Tests | Real SRD hits (`Blinded`, `Advantage and Disadvantage`) |

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```
