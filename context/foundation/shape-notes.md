---
project: Keyword Lexicanum
context_type: greenfield
product_type: web
target_scale:
  users: small
  growth_note: handful at local game store first; dozens later
created: 2026-06-24
updated: 2026-06-24
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: pain category
      decision: workflow friction — book-flipping and cross-referencing slow learning during play
    - topic: insight
      decision: in-context lookup tied to game system and keyword, not generic web results
    - topic: primary persona
      decision: solo new player learning before/at the table, one system at a time
    - topic: v1 game systems
      decision: D&D 5e SRD, Warhammer 40k 11th ed core rules, Starcraft Miniature Game core rules
    - topic: access control
      decision: local profile — on-device data, no server login; flat single-user model, no roles in v1
    - topic: mvp timeline
      decision: 4–6 weeks after-hours; D&D scoped to basic/SRD only (extension manuals deferred)
    - topic: mvp scope
      decision: three game systems in v1 — D&D 5e basic, WH40k 11th, Starcraft Miniature
  frs_drafted: 8
  quality_check_status: accepted
timeline_budget:
  mvp_weeks: 5
  hard_deadline: 2026-08-31
  after_hours_only: true
  weekly_hours: 10
---

# Shape Notes

> Planning session complete — ready for /10x-prd.

## Vision & Problem Statement

New players entering tabletop RPGs (e.g. D&D) and miniature wargames (e.g. Warhammer 40k, Starcraft Miniature Game) hit a steep terminology barrier. Core rulebooks are large, dense, and full of cross-references to other pages. During a player's first sessions — or when switching from one game system to another — understanding keywords, effects, and rule interactions consumes significant time and interrupts play.

The pain is **workflow friction**: constant book-flipping and manual cross-referencing slow learning when a player needs to know what a term or rule means in the moment.

**Insight:** answers must be tied to the specific game system and keyword the player is looking at — in-context lookup, not generic search results or disconnected glossary entries.

**Seed idea:** an AI agent that helps new players in both RPG and miniature games with keywords and rules that are problematic early on or when changing game systems. Grounded in license-free official corpora where available.

## User & Persona

**Primary persona:** solo new player learning before or during play, focused on one game system at a time (may later switch systems).

- **Role:** new tabletop player (RPG and/or miniature games)
- **Context:** first few sessions/games, or returning to tabletop after learning a different system
- **Moment they reach for the product:** encounters an unfamiliar keyword, effect, or rule reference and needs a fast, trustworthy explanation without losing table momentum

**Pain echo (captured verbatim):**
- **Pain:** understanding keywords, effects, and rules terminology
- **Person:** new players for TTRPG and miniature games (D&D, Warhammer, etc.)
- **Moment:** starting to play; first few sessions/games; switching game systems
- **Cost today:** a lot of time, especially early on — big rulebooks with cross-page references

## Access Control

**Model:** local profile — data lives on-device; no account creation or server-side authentication in v1.

**User model:** flat — single local user per device. No role separation (player vs GM vs admin) in v1; matches the solo new-player persona.

**Rationale:** privacy-first, zero friction at the table, no dependency on network for identity.

## Success Criteria

### MVP flow (end-to-end)

1. User opens the app.
2. User selects a game system (D&D 5e basic/SRD, Warhammer 40k 11th ed, or Starcraft Miniature Game).
3. User enters or selects a keyword/rule term they do not understand.
4. Agent returns a short, in-context explanation grounded in that system's license-free rules corpus.

**Scope note:** D&D limited to basic manual / SRD for v1 — extension manuals (Xanathar's, Tasha's, etc.) deferred to future versions. Two mainstream systems plus one newer system; user accepts this as manageable with the narrowed D&D corpus.

### Primary

- A solo new player can complete steps 1–4 during a live session and understand an unfamiliar keyword without flipping through a physical rulebook.

### Secondary

- **Recent lookups history** — user can revisit terms looked up in the current session without re-querying.

### Guardrails

- **No invented rules** — answers must cite or trace to the loaded rules corpus; agent must not hallucinate mechanics.
- **Table-speed responses** — perceived response time fast enough to use mid-game (target: under a few seconds; exact threshold TBD in NFR phase).

### Timeline acknowledgment

Acknowledged on 2026-06-24: 4–6 week MVP (midpoint `mvp_weeks: 5`) requires sustained after-hours dedication; user accepted. Three corpora + AI agent is ambitious; D&D corpus scoped down to basic/SRD to keep delivery realistic.

## Functional Requirements

- FR-001: Player can select which game system is active (D&D 5e basic/SRD, Warhammer 40k 11th ed, Starcraft Miniature Game). Priority: must-have
- FR-002: Player can look up a keyword or rule term by typing it or selecting from guided suggestions. Priority: must-have
- FR-003: Player can receive an in-context explanation grounded in the active system's rules corpus. Priority: must-have
- FR-004: Player can see which rules text supports the explanation (citation/trace to corpus), shown with low-clutter default presentation. Priority: must-have
- FR-005: Player can view recent keyword lookups from the current session. Priority: nice-to-have
- FR-006: Player can use the app with a local profile (no login). Priority: must-have
- FR-007: Player can see which game phase a keyword applies to (or that it does not apply outside that phase). Priority: must-have
- FR-008: Player can enter a phase name to browse keywords relevant to that phase. Priority: must-have

  > Socrates: Counter-argument considered: none. Resolution: kept as written.
  > Socrates: Counter-argument considered: typing-only is weak for novices. Resolution: FR updated to include guided suggestions alongside typing.
  > Socrates: Counter-argument considered: simple definitions might be enough for MVP. Resolution: kept in-context requirement to preserve core value proposition and reduce system-switch confusion.
  > Socrates: Counter-argument considered: citation UI can clutter table-speed flow. Resolution: FR refined to require low-clutter default citation presentation.
  > Socrates: Counter-argument considered: recent history may be unnecessary if search is strong. Resolution: kept as nice-to-have (not MVP-critical, can be cut if schedule slips).
  > Socrates: Counter-argument considered: none. Resolution: kept local-profile model for MVP.

## User Stories

### US-01: New player resolves a rule keyword during play

- **Given** a new player in an active play session and the app open with a selected game system
- **When** they enter an unfamiliar keyword or rule term
- **Then** they receive a short explanation grounded in the selected system's rules corpus with citation/trace to source text

#### Acceptance Criteria
- Player can switch system first, then query without leaving the current flow
- Response includes a clear citation/trace to the supporting rule text
- If the term is unknown in the selected corpus, app returns a clear "not found in corpus" state instead of fabricating an answer

## Business Logic

**One-sentence rule:** Given a game system and a keyword (or phase name), the app explains the keyword in that system's official rules corpus, fast and without cross-page book hunting — and states which game phase the keyword applies to so the player knows when it matters and when it does not.

**Inputs:** active game system; keyword or phase name (typed or from guided suggestions); official rules corpus for that system.

**Output:** short in-context explanation grounded in corpus text; applicable game phase(s); citation/trace to supporting rules; for phase queries, list of related keywords for that phase.

**Player experience:** at the table, the player learns not only what a term means but whether it is relevant right now — e.g. *Close Quarters* only matters during Engagement, so outside that phase the player knows they can ignore it.

**Example (user-provided):** Close Quarters only works in Engagement — the app makes clear the keyword does not matter outside that phase.

## Non-Functional Requirements

- User-perceived keyword lookup response **< 3 seconds p95** during play.
- Answers come **only from the loaded official corpus**; clear fallback when a term or phase is not covered (no fabricated rules).
- **Usable on phone at the table** — readable in typical play conditions, workable one-handed where possible.
- **Keyword lookup works offline** once the corpus for the selected system is loaded on device.
- **Lookup/session data stays on-device** — aligned with local-profile model; no cloud sync of history in v1.

## Non-Goals

- **No GM/DM campaign tooling** — maps, initiative trackers, NPC sheets, session prep; out of scope for v1.
- **No full rules adjudication** — app explains terms and phase relevance; it does not referee moves or resolve disputes automatically.
- **No real-time multi-player table sync** — no shared session state across devices at the table.
- **No D&D extension manuals in v1** — basic/SRD only; paid extension books deferred.
- **No voice-first input in v1** — text and guided suggestions only.
- **No user accounts or cloud sync in v1** — local profile on-device only.

## Quality cross-check

| Element | Status |
|---------|--------|
| Access Control | present |
| Business Logic (one-sentence rule) | present |
| Project artifacts | present |
| Timeline-cost acknowledged | present (4–6 week MVP ack + hard deadline 2026-08-31, ~10 h/week after hours) |
| Non-Goals | present |
| Preserved behavior | n/a (greenfield) |

## Forward: rules corpus

Candidate license-free sources for v1 (user-provided; licensing to be verified before ingestion):
- D&D 5e — SRD / free rules
- Warhammer 40k — 11th edition core rules (license-free version)
- Starcraft Miniature Game — core rules

## Open Questions

- Exact game-phase taxonomy per system (Engagement, etc.) — must be derived from each corpus during implementation.
- Licensing verification for WH40k 11th and Starcraft Miniature free core rules before ingestion.
