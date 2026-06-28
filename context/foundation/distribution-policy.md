---
project: Keyword Lexicanum
version: 1
status: active
created: 2026-06-24
updated: 2026-06-24
---

# Distribution & corpus policy

## Public distribution

- **D&D (SRD 5.2.1):** CC BY 4.0 — safe to ship in a public web app with attribution.
- **Warhammer 40,000 & StarCraft TMG:** Official core rules PDFs are free to download for personal use from [Warhammer Community](https://www.warhammer-community.com/) and [starcraft-tmg.com](https://starcraft-tmg.com/downloads). That download license is **not** equivalent to an open republication license.

**Decision:** Do **not** publish a public deployment that embeds Games Workshop or Archon/Blizzard rules text until you have consulted GW and Archon and received explicit permission.

The existing Vercel preview should remain D&D-forward (or sample-only placeholders for miniature systems) until that clearance exists.

## Personal / local use

For private table-side use, you may build full corpora from the official free PDFs using the repo build scripts. Generated JSON for GW and Archon content is **gitignored** — run `npm run corpus:build-wh40k` and `npm run corpus:build-starcraft` locally; do not push those files to a public remote.

## Systems in scope

| System | Corpus source | Public ship | Personal build |
|---|---|---|---|
| D&D 5e SRD | Open5e + SRD 5.2.1 (CC BY 4.0) | Yes | `npm run corpus:build-dnd` |
| Warhammer 40k | [11th ed Core Rules PDF](https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf) | After GW consultation | `npm run corpus:build-wh40k` |
| StarCraft TMG | Archon free rulebook PDF | After Archon consultation | `npm run corpus:build-starcraft` |
| Age of Sigmar | GW free core rules (future) | After GW consultation | Parked — post-deadline stretch |
| Warhammer: The Old World | Paid rulebook only | **Out of scope** | No free core PDF — dropped |

## Before any public relaunch

1. Contact Games Workshop (licensing / IP) regarding embedding core rules excerpts in a lookup tool.
2. Contact Archon Studio regarding StarCraft TMG rule text in a third-party web app.
3. Keep attribution files (`src/data/*-ATTRIBUTION.md`) accurate.
4. Ensure production bundle excludes gitignored personal corpora unless permission is granted.
