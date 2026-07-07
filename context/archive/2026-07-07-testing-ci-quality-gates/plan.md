# CI Quality Gates — Implementation Plan

## Overview

Wire lint and production build into GitHub Actions per test-plan Phase 4.

## Desired End State

- CI job runs: `npm ci` → typecheck → lint → test → build.
- test-plan §5 gates for lint and build marked `required` in local + CI.
- test-plan §6.4 cookbook filled in.
- Phase 4 rollout status → `complete`.

## Phase 1: Workflow update

Add steps to `.github/workflows/ci.yml`:

```yaml
- name: Lint
  run: npm run lint

- name: Build
  run: npm run build
```

## Progress

- [x] 1.1 Lint step in CI
- [x] 1.2 Build step in CI
- [x] 1.3 test-plan §5 and §6.4 updated
