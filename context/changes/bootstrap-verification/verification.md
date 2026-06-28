---
bootstrapped_at: 2026-06-24T13:10:00Z
starter_id: expo
starter_name: Expo (React Native)
project_name: keyword-lexicanum
language_family: js
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: verified
phase_3_status: ok
audit_command: npm audit --json
---

## Hand-off

```yaml
starter_id: expo
package_manager: npm
project_name: keyword-lexicanum
hints:
  language_family: js
  team_size: solo
  deployment_target: appstore-via-eas
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: verified
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

A solo after-hours builder shipping a 5-week mobile MVP needs a battle-tested, agent-friendly starter for offline keyword lookup at the table. Expo is the recommended default for `(mobile, js)` and clears all four agent-friendly gates with verified bootstrapper confidence. It fits Android-first delivery via EAS Build, on-device rules storage with expo-sqlite and FTS5, and a local-only profile with no login—matching PRD non-goals on accounts, cloud sync, and realtime. GitHub Actions with auto-deploy-on-merge is the standard CI shape. Auth, payments, realtime, AI, and background jobs are out of scope per PRD.

## Pre-scaffold verification

| Signal             | Value                                      | Severity | Notes                              |
| ------------------ | ------------------------------------------ | -------- | ---------------------------------- |
| npm package        | create-expo-app v4.0.0 published 2026-05-15 | fresh    | resolved from cmd_template         |
| GitHub repo        | not run (docs.expo.dev, not GitHub)        | —        | no recency signal available        |

## Scaffold log

**Resolved invocation**: `npx create-expo-app@latest .bootstrap-scaffold --yes --template default`
**Strategy**: subdir-then-move
**Exit code**: 0
**Files moved**: 7
**Conflicts (.scaffold siblings)**: node_modules, scripts, app.json, package-lock.json, package.json, README.md, tsconfig.json
**.gitignore handling**: append-merged
**.bootstrap-scaffold cleanup**: deleted

New files from the official Expo default template also landed without conflict: `src/`, `components/`, `hooks/`, `constants/`, `AGENTS.md`, `CLAUDE.md`, `.claude/`. Your existing `app/` (expo-router tabs), `lib/`, and `store/` were preserved. `context/` was not overwritten.

## Post-scaffold audit

**Command**: `npm audit --json`
**Exit code**: 1 (informational)
**Summary**: 30 vulnerabilities (24 moderate, 6 high)
**Typecheck**: `npm run typecheck` passes after excluding scaffold-only `src/` from `tsconfig.json` (project routes live in `app/`).

Review `.scaffold` siblings to diff your prior files against the official template. You may delete `node_modules.scaffold/` once done comparing.

## Hints recorded but not acted on in v1

- `deployment_target`: appstore-via-eas (logged; no EAS/CI files generated in v1)
- `ci_provider`: github-actions (logged; no workflow scaffolded in v1)
- `ci_default_flow`: auto-deploy-on-merge (logged)
- `bootstrapper_confidence`: verified
- `path_taken`: standard
- `quality_override`: false
- `self_check_answers`: null
- `team_size`: solo (defaulted from standard path)
- Feature flags: all false

## Next steps

- Compare `.scaffold` siblings (`package.json.scaffold`, `app.json.scaffold`, etc.) and merge any useful defaults.
- Remove `src/` if unused (your app uses root `app/` with expo-router).
- Run `npx expo start --android` to verify on device/emulator.
- Future skill will generate agent context files and CI workflows.
