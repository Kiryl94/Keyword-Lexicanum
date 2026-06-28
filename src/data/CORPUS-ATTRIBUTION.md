# Corpus attribution

## D&D 5e SRD (public)

See [SRD-ATTRIBUTION.md](./SRD-ATTRIBUTION.md). CC BY 4.0 — safe for public deployment with attribution.

## Warhammer 40,000 (personal / local)

- **Source:** free **11th ed** Core Rules PDF — [GW assets (eng_01-06)](https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf)
- **Build:** `npm run corpus:build-wh40k` → `src/data/local/wh40k-core-corpus.json`
- **Activate:** set `WH40K_CORPUS_PATH` in `.env.local` (see `.env.local.example`)
- **Public deploy:** consult Games Workshop before embedding rules text. See `context/foundation/distribution-policy.md`.

## StarCraft Tabletop Miniatures Game (personal / local)

- **Source:** free rulebook PDF from [starcraft-tmg.com/downloads](https://starcraft-tmg.com/downloads)
- **Build:** `npm run corpus:build-starcraft` → `src/data/local/starcraft-core-corpus.json`
- **Activate:** set `STARCRAFT_CORPUS_PATH` in `.env.local`
- **Public deploy:** consult Archon Studio before embedding rules text.

## Sample corpora (committed)

When env paths are unset, the app ships with `*.sample.json` placeholder entries for UX demos on public preview — not official publisher text.

Regenerate paraphrased samples from manifests: `npm run corpus:build-samples`
