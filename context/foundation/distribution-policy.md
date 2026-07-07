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
| **SRD** | D&D 5e (live), Pathfinder 2e (live), Year Zero Engine (live) | Full open-licensed corpus with attribution | N/A — already public-safe |
| **Demo** | Warhammer 40k, StarCraft TMG | Paraphrased **sample** JSON only | No active upgrade path — publisher outreach dropped for now |

The UI groups systems into **SRD** and **Demo** on the game-system picker. Demo systems are playable with sample data; they signal optional publisher-licensed depth, not a pending promotion track.

## Public distribution

- **D&D (SRD 5.2.1):** CC BY 4.0 — safe to ship in a public web app with attribution (`5.2.1-lookup-v5`, phase-deepened rulesets).
- **Pathfinder 2e:** ORC license — public curated manifest (`pf2e-remaster-v12`, 121 keywords).
- **Year Zero Engine:** Free League YZE FTL — public curated manifest (`yze-srd-v13`, 95 keywords).
- **Warhammer 40,000 & StarCraft TMG (Demo tier):** Official core rules PDFs are free to download for personal use. That download license is **not** equivalent to an open republication license.

**Decision:** Do **not** publish Demo-tier systems with embedded full rules text until GW and Archon grant explicit permission. Public deploy uses `*-core-corpus.sample.json` only.

## Personal / local use

For private table-side use, you may build full Demo-tier corpora from the official free PDFs using the repo build scripts. Generated JSON for GW and Archon content is **gitignored** — run `npm run corpus:build-wh40k` and `npm run corpus:build-starcraft` locally; do not push those files to a public remote.

## Systems in scope

| System | Tier | Corpus source | Public ship | Personal build |
|---|---|---|---|---|
| D&D 5e SRD | SRD | Open5e + SRD 5.2.1 (CC BY 4.0) | Yes (full) | `npm run corpus:build-dnd` |
| Pathfinder 2e | SRD | Curated ORC Remaster manifest | Yes (121 keywords) | `npm run corpus:build-pf2e` |
| Year Zero Engine | SRD | Curated YZE FTL manifest | Yes (95 keywords) | `npm run corpus:build-yze` |
| Warhammer 40k | Demo | [11th ed Core Rules PDF](https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf) | Sample only (no promotion planned) | `npm run corpus:build-wh40k` |
| StarCraft TMG | Demo | Archon free rulebook PDF | Sample only (no promotion planned) | `npm run corpus:build-starcraft` |

## Demo tier policy (2026-07-07)

Publisher outreach to GW and Archon is **not planned** for the foreseeable future. WH40k and StarCraft remain **Demo** tier with sample corpora in the public bundle. Personal/local full PDF builds stay available via gitignored corpora and `.env.local` overrides.

Keep attribution files (`src/data/*-ATTRIBUTION.md`) accurate. Ensure production bundle excludes gitignored personal corpora.
