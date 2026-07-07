---
project: Keyword Lexicanum
version: 2
status: active
created: 2026-06-24
updated: 2026-07-07
---

# Distribution & corpus policy

## Product tiers

| Tier | Systems | Public deploy | Upgrade path |
|------|---------|---------------|--------------|
| **SRD** | D&D 5e (live), Pathfinder 2e (planned), Year Zero Engine (planned) | Full open-licensed corpus with attribution | N/A — already public-safe |
| **Demo** | Warhammer 40k, StarCraft TMG | Paraphrased **sample** JSON only | Publisher permission → promote to full corpus |

The UI groups systems into **SRD** and **Demo** on the game-system picker. Demo systems are playable with sample data; they are not hidden — they signal future value if GW/Archon grant republication rights.

## Public distribution

- **D&D (SRD 5.2.1):** CC BY 4.0 — safe to ship in a public web app with attribution.
- **Pathfinder 2e (planned):** ORC license — target for full public corpus once ingested from official Remaster SRD sources.
- **Year Zero Engine (planned):** Free League third-party license — target for public corpus per license terms once ingested.
- **Warhammer 40,000 & StarCraft TMG (Demo tier):** Official core rules PDFs are free to download for personal use. That download license is **not** equivalent to an open republication license.

**Decision:** Do **not** publish Demo-tier systems with embedded full rules text until GW and Archon grant explicit permission. Public deploy uses `*-core-corpus.sample.json` only.

## Personal / local use

For private table-side use, you may build full Demo-tier corpora from the official free PDFs using the repo build scripts. Generated JSON for GW and Archon content is **gitignored** — run `npm run corpus:build-wh40k` and `npm run corpus:build-starcraft` locally; do not push those files to a public remote.

## Systems in scope

| System | Tier | Corpus source | Public ship | Personal build |
|---|---|---|---|---|
| D&D 5e SRD | SRD | Open5e + SRD 5.2.1 (CC BY 4.0) | Yes (full) | `npm run corpus:build-dnd` |
| Pathfinder 2e | SRD | Official ORC Remaster SRD (planned) | Yes when ingested | Planned |
| Year Zero Engine | SRD | Free League license docs (planned) | Yes when ingested | Planned |
| Warhammer 40k | Demo | [11th ed Core Rules PDF](https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf) | Sample only until GW permission | `npm run corpus:build-wh40k` |
| StarCraft TMG | Demo | Archon free rulebook PDF | Sample only until Archon permission | `npm run corpus:build-starcraft` |

## Before promoting Demo → full public

1. Contact Games Workshop (licensing / IP) regarding embedding core rules excerpts in a lookup tool.
2. Contact Archon Studio regarding StarCraft TMG rule text in a third-party web app.
3. Keep attribution files (`src/data/*-ATTRIBUTION.md`) accurate.
4. Ensure production bundle excludes gitignored personal corpora unless permission is granted.
