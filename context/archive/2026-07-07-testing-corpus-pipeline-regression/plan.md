# Corpus Pipeline Regression — Implementation Plan

## Overview

Add Vitest guards in `scripts/` for Risks #2 and #5. No production app code changes.

## Desired End State

- `sample-corpus-guard.test.mjs` and `srd-corpus-guard.test.mjs` pass in `npm test`.
- Phase 2 rollout status → `complete`.

## Phase 1: Demo bundle guards

- Assert `wh40k-core-corpus.sample.json` and `starcraft-core-corpus.sample.json` entry counts and `license: sample-only`.
- Assert tsconfig/next/vitest aliases point at `*.sample.json` paths.

## Phase 2: SRD manifest integrity

- Assert PF2e and YZE committed corpora match manifest lengths and license fields.

## Progress

- [x] 1.1 Demo sample corpus guard tests
- [x] 1.2 Alias path resolution tests
- [x] 2.1 SRD manifest vs JSON integrity tests
