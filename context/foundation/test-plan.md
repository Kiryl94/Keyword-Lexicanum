# Test Plan

> Phased test rollout for this project. Strategy is frozen at the top
> (§1–§5); cookbook patterns at the bottom (§6) fill in as phases ship.
> Read before writing any new test.
>
> Refresh: re-run `/10x-test-plan --refresh` when stale (see §8).
>
> Last updated: 2026-07-07

## 1. Strategy

Tests follow three non-negotiable principles for this project:

1. **Cost × signal.** The cheapest test that gives a real signal for the
   risk wins. Do not promote to e2e because e2e "feels safer." Do not put a
   vision model on top of a deterministic visual diff that already catches
   the regression.
2. **User concerns are first-class evidence.** Risks anchored in "the
   team is worried about X, and the failure would surface somewhere in
   <area>" carry the same weight as PRD lines or hot-spot data.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Hot-spot scope used for likelihood weighting: `src/`, `scripts/`.

## 2. Risk Map

The top failure scenarios this project must protect against, ordered by
risk = impact × likelihood. Risks are failure scenarios in user / business
terms, not test names. The Source column cites the *evidence that surfaced
this risk* — never a specific file as "where the failure lives" (that is
research's job, see §1 principle #3).

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|-------------------------|--------|------------|--------------------------------|
| 1 | Player switches game system but lookup or recents still reflect the previous system's corpus or session history | High | High | interview Q1; PRD FR-001, FR-006; hot-spot dir `src/store/` (13 commits/30d) |
| 2 | Corpus rebuild completes without error but ships fewer keywords than the manifest declares | High | Medium | interview Q2; hot-spot dirs `src/data/` (19 commits/30d), `scripts/` |
| 3 | Player searches a known keyword and receives an explanation not traceable to the active corpus, or "not found" when the term exists | High | Medium | PRD guardrail "No invented rules"; US-01; hot-spot dir `src/lib/` (29 commits/30d) |
| 4 | Lookup result on a phone browser shows excessive rule text, internal fields, or debug-like values instead of a minimal table-side summary | Medium | Medium | interview Q3, Q4; hot-spot dir `src/components/` (33 commits/30d) |
| 5 | Production or public preview bundle includes full GW/Archon rules JSON instead of paraphrased sample corpora | High | Medium | `context/foundation/distribution-policy.md`; AGENTS.md hard rules; interview Q1 (publisher concern) |

Publisher legal action (GW/Archon) is a business/process risk outside automated testing. Risk #5 and distribution-policy compliance are the testable proxy.

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|------|-----------------------------|----------------|--------------------------------------|-----------------------|-----------------------|
| #1 | After system switch, lookup queries and recents read only from the newly active system's corpus and session partition | "System picker UI updated" implies isolation — UI can change while store/corpus routing still points at the old system | Active system id in persisted session; corpus loader selection path; recents keying strategy; rehydrate/migration behavior | unit + integration | Asserting picker label only; testing one system in isolation without a switch sequence |
| #2 | Build output keyword count meets manifest minimum; dropped/skipped entries fail the build or emit a visible error | "Build exited 0" means corpus is complete — silent skips are the reported failure mode | Manifest entry list; build script skip logic; sample vs local output paths; version bump expectations | integration (scripts) | Snapshotting entire corpus JSON; testing only happy-path PDF that always parses |
| #3 | Known corpus term returns grounded summary with citation metadata; unknown term returns explicit not-found without fabricated mechanics | "Test passes with current sample JSON" — oracle copied from implementation | Corpus entry shape; lookup matching rules (alias, case, prefix); not-found branch copy | unit + integration | Expected string copied from production formatter; happy-path-only on `advantage`-style terms |
| #4 | Result card renders bounded summary text and citation affordance — no raw debug fields, random numbers, or full rule paragraphs by default | "Component renders" — presence without asserting text bounds or collapsed default | Props from lookup layer to result card; mobile layout branch; default expanded/collapsed citation state | component unit | Pixel/screenshot regression on every variant; e2e before a prop-level bound test exists |
| #5 | Public build artifact resolves WH40k/StarCraft imports to sample JSON paths, not gitignored local corpora | "Sample files exist in repo" — wrong alias/env at build time could still bundle local paths on a developer machine | next.config / tsconfig alias targets; env override vars; CI vs local `.env.local` | integration + build smoke | Manual checklist only; asserting file exists without verifying bundled import graph |

## 3. Phased Rollout

Each row is a discrete rollout phase that will open its own change folder
via `/10x-new`. Status moves left-to-right through the values below; the
orchestrator updates Status as artifacts appear on disk.

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|------------|-----------------|---------------|------------|--------|---------------|
| 1 | System isolation & lookup grounding | Prove system switch rebinds corpus + recents; lookup stays corpus-grounded | #1, #3 | unit + integration | complete | testing-system-isolation-lookup-grounding |
| 2 | Corpus pipeline regression floor | Catch silent keyword drops and wrong public corpus targets at build time | #2, #5 | integration | complete | testing-corpus-pipeline-regression |
| 3 | Result card content bounds | Assert minimal table-side presentation — no debug leakage on mobile | #4 | component unit | not started | — |
| 4 | CI quality gates | Lock lint + production build in CI alongside existing typecheck/test | cross-cutting | gates | not started | — |

## 4. Stack

The classic test base for this project. AI-native tools (if any) carry a
`checked:` date so future readers can see which lines need re-verification.

| Layer | Tool | Version | Notes |
|-------|------|---------|-------|
| unit + integration | Vitest | 3.2.x | Node environment; corpus aliases in `vitest.config.ts` mirror production |
| component | Vitest + React Testing Library | none yet — see Phase 3 | Add only when Phase 3 research confirms cheapest layer |
| API mocking | none | — | Client-only app; no HTTP API surface in MVP |
| e2e / browser | cursor-ide-browser (session MCP) | n/a | Table-smoke only if component tests miss a real-device gap; not default |
| accessibility | none | — | Not in MVP rollout |

**Stack grounding tools (current session):**
- Docs: none — no Context7/framework docs MCP in session; relied on local `vitest.config.ts`, `package.json`; checked: 2026-06-24
- Search: none — no Exa/web-search MCP in session; checked: 2026-06-24
- Runtime/browser: cursor-ide-browser — optional post-Phase-3 smoke; not used for Phase 1; checked: 2026-06-24
- Provider/platform: none — no GitHub/Vercel MCP for CI verification; local `.github/workflows/ci.yml` read instead; checked: 2026-06-24

Test-base profile at plan authoring: **sparse** — 5 test files / 49 tests in `src/lib/`, `src/store/`, `scripts/`; `src/components/` and `src/app/` bare.

## 5. Quality Gates

| Gate | Where | Required? | Catches |
|------|-------|-----------|---------|
| typecheck | local + CI | required | type drift |
| unit + integration (Vitest) | local + CI | required | lookup, session, corpus logic regressions |
| lint (ESLint) | local | required after Phase 4 | style/import drift |
| production build | local + CI | required after Phase 4 | alias/bundle failures, Next.js compile errors |
| e2e table-smoke | manual / optional MCP | optional | full mobile browser quirks component tests miss |
| post-edit hook | local (agent loop) | not planned | — |
| visual diff | CI | excluded (see §7) | — |

## 6. Cookbook Patterns

How to add new tests in this project. Each sub-section fills in once the
relevant rollout phase ships.

### 6.1 Adding a unit test (lookup / session)

- **Location**: Co-located `*.test.ts` beside source (`src/lib/lookup.test.ts`, `src/store/session.test.ts`).
- **Naming**: `describe` blocks mirror the module; `it` names state behavior/regression caught.
- **Reference tests**: cross-corpus miss — `lookup.test.ts` (`close quarters` under D&D); switch sequence — `session.test.ts` (`preserves per-system recents across a switch sequence`).
- **Run locally**: `npm test`
- **Oracles**: independent corpus facts (term in one system only), PRD not-found contract, `getCorpusVersion()` — not copied explanation strings.

### 6.2 Adding an integration test (corpus build)

- **Location**: `scripts/*.test.mjs` beside build utilities.
- **Pattern**: assert manifest length === sample `entryCount` === `entries.length`; assert Demo samples use `license: sample-only`; assert tsconfig/next aliases point at `*.sample.json`.
- **Reference test**: `scripts/sample-corpus-guard.test.mjs`
- **Run locally**: `npm test`

### 6.3 Adding a component test (result presentation)

TBD — see §3 Phase 3 for minimal summary / no debug-field pattern.

### 6.4 Adding a CI gate

TBD — see §3 Phase 4 for lint + build workflow steps.

### 6.5 Per-rollout-phase notes

(empty — filled as phases complete)

## 7. What We Deliberately Don't Test

Exclusions from Phase 2 interview Q5. Re-evaluate if product scope or team size changes.

- **Pixel-perfect visual regression on every component** — high flake, low signal for a table-speed lookup UI; component assertions on text bounds preferred. (Source: interview Q5.)
- **Full keyword-list e2e per game system** — corpus scale makes exhaustive browser walks expensive; manifest/build guards + spot-check lookups are cheaper. (Source: cost × signal principle.)
- **Publisher legal outcomes** — GW/Archon permission is a business/process track (`distribution-policy.md`), not an automated test. Bundle path verification (Risk #5) is the technical proxy.

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-06-24
- Stack versions last verified: 2026-06-24
- AI-native tool references last verified: 2026-06-24

Refresh (`/10x-test-plan --refresh`) when:

- a new top-3 risk surfaces from the roadmap or archive,
- a recommended tool's `checked:` date is older than three months,
- the project's tech stack changes (new framework, new test runner),
- §7 negative-space no longer matches what the team believes.
