---
project: Keyword Lexicanum
version: 1
status: draft
created: 2026-06-24
context_type: greenfield
product_type: web
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 5
  hard_deadline: 2026-08-31
  after_hours_only: true
  weekly_hours: 10
---

## Vision & Problem Statement

New players entering tabletop RPGs (e.g. D&D) and miniature wargames (e.g. Warhammer 40k, Starcraft Miniature Game) hit a steep terminology barrier. Core rulebooks are large, dense, and full of cross-references to other pages. During a player's first sessions — or when switching from one game system to another — understanding keywords, effects, and rule interactions consumes significant time and interrupts play.

The pain is workflow friction: constant book-flipping and manual cross-referencing slow learning when a player needs to know what a term or rule means in the moment. Answers must be tied to the specific game system and keyword the player is looking at — in-context lookup, not generic search results or disconnected glossary entries.

## User & Persona

**Primary persona:** solo new player learning before or during play, focused on one game system at a time (may later switch systems).

- **Role:** new tabletop player (RPG and/or miniature games)
- **Context:** first few sessions/games, or returning to tabletop after learning a different system
- **Moment they reach for the product:** encounters an unfamiliar keyword, effect, or rule reference and needs a fast, trustworthy explanation without losing table momentum

**Initial scale:** handful of users at a local game store; potential growth to dozens later.

## Success Criteria

### Primary

- A solo new player can complete the core lookup flow during a live session and understand an unfamiliar keyword without flipping through a physical rulebook.

### Secondary

- Recent lookups history — user can revisit terms looked up in the current session without re-querying.

### Guardrails

- No invented rules — answers must cite or trace to the loaded rules corpus; the product must not fabricate mechanics.
- Table-speed responses — perceived response time fast enough to use mid-game (target: under 3 seconds p95).

## User Stories

### US-01: New player resolves a rule keyword during play

- **Given** a new player in an active play session and the app open with a selected game system
- **When** they enter an unfamiliar keyword or rule term
- **Then** they receive a short explanation grounded in the selected system's rules corpus with citation/trace to source text

#### Acceptance Criteria

- Player can switch system first, then query without leaving the current flow
- Response includes a clear citation/trace to the supporting rule text
- If the term is unknown in the selected corpus, app returns a clear "not found in corpus" state instead of fabricating an answer

## Functional Requirements

### Game system & profile

- FR-001: Player can select which game system is active (D&D 5e basic/SRD, Warhammer 40k 11th ed, Starcraft Miniature Game). Priority: must-have

  > Socrates: Counter-argument considered: none. Resolution: kept as written.

- FR-006: Player can use the app with a local profile (no login required). Optional magic-link sign-in may sync favorites when configured. Priority: must-have

  > Socrates: Counter-argument considered: none. Resolution: kept local-profile model for MVP; accounts later added as opt-in sync only.

### Keyword & phase lookup

- FR-002: Player can look up a keyword or rule term by typing it or selecting from guided suggestions. Priority: must-have

  > Socrates: Counter-argument considered: typing-only is weak for novices. Resolution: FR updated to include guided suggestions alongside typing.

- FR-003: Player can receive an in-context explanation grounded in the active system's rules corpus. Priority: must-have

  > Socrates: Counter-argument considered: simple definitions might be enough for MVP. Resolution: kept in-context requirement to preserve core value proposition and reduce system-switch confusion.

- FR-004: Player can see which rules text supports the explanation (citation/trace to corpus), shown with low-clutter default presentation. Priority: must-have

  > Socrates: Counter-argument considered: citation UI can clutter table-speed flow. Resolution: FR refined to require low-clutter default citation presentation.

- FR-007: Player can see which game phase a keyword applies to (or that it does not apply outside that phase). Priority: must-have

- FR-008: Player can enter a phase name to browse keywords relevant to that phase. Priority: must-have

### Session

- FR-005: Player can view recent keyword lookups from the current session. Priority: nice-to-have

  > Socrates: Counter-argument considered: recent history may be unnecessary if search is strong. Resolution: kept as nice-to-have (not MVP-critical, can be cut if schedule slips).

## Non-Functional Requirements

- User-perceived keyword lookup response **< 3 seconds p95** during play.
- Answers come **only from the loaded official rules content** for the selected system; clear fallback when a term or phase is not covered (no fabricated rules).
- **Responsive web at the table** — usable on phone browsers in typical play conditions; desktop-friendly for prep. Native mobile app deferred (see Non-Goals).
- **Keyword lookup works offline** after the rules corpus for the selected system is cached in the browser (service worker / IndexedDB in a later milestone; sample corpus online-first for MVP bootstrap).
- **Session data stays in the browser** in v1 — not synced across devices or accounts.

## Business Logic

Given a game system and a keyword (or phase name), the app explains the keyword in that system's official rules corpus, fast and without cross-page book hunting — and states which game phase the keyword applies to so the player knows when it matters and when it does not.

**Inputs:** active game system; keyword or phase name (typed or from guided suggestions); official rules corpus for that system.

**Output:** short in-context explanation grounded in corpus text; applicable game phase(s); citation/trace to supporting rules; for phase queries, list of related keywords for that phase.

**Player experience:** at the table, the player learns not only what a term means but whether it is relevant right now — e.g. *Close Quarters* only matters during Engagement, so outside that phase the player knows they can ignore it.

**Example:** Close Quarters only works in Engagement — the app makes clear the keyword does not matter outside that phase.

## Access Control

Guest use remains the default: no login required; session data lives in the browser (localStorage).

**Optional sync:** when Supabase env vars are configured, players may sign in with a magic-link email to sync keyword favorites across devices. Lookup and local recents continue to work without an account.

**User model:** flat — one local guest profile per browser, plus optional authenticated favorites. No role separation (player vs GM vs admin) in v1.

**Rationale:** privacy-first and zero friction at the table; accounts are opt-in for sync only.

## Non-Goals

- **No GM/DM campaign tooling** — maps, initiative trackers, NPC sheets, session prep; out of scope for v1.
- **No full rules adjudication** — app explains terms and phase relevance; it does not referee moves or resolve disputes automatically.
- **No real-time multi-player table sync** — no shared session state across devices at the table.
- **No D&D extension manuals in v1** — basic/SRD only; paid extension books deferred.
- **No voice-first input in v1** — text and guided suggestions only.
- **No required user accounts or cloud sync for core lookup** — guest/local profile is enough; optional magic-link sync exists only for keyword favorites when Supabase is configured.

## Open Questions

1. **Exact game-phase taxonomy per system** (Engagement, etc.) — must be derived from each corpus during implementation. Owner: product/build. By: before FR-007/FR-008 implementation.
2. **Public distribution of GW / Archon corpus** — personal/local build from free PDFs is OK; public web deploy with embedded rules text requires GW and Archon consultation first. See `context/foundation/distribution-policy.md`. Owner: product. By: before any public relaunch with full miniature-system corpora.
3. **D&D 5e SRD vs basic manual boundary** — resolved: SRD 5.2.1 via Open5e is canonical for v1.
4. **US-02 for phase-based keyword browse** — only US-01 captured in shaping; add user story for FR-007/FR-008 if acceptance criteria need explicit Given/When/Then coverage.
