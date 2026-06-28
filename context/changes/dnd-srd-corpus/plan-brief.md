# Real D&D SRD Corpus — Plan Brief

> Full plan: `context/changes/dnd-srd-corpus/plan.md`

## What & Why

S-02 proved lookup UX with ~11 sample terms per system. S-07 swaps D&D to the canonical CC BY 4.0 SRD so table lookups return real rule text and citations (FR-003, FR-004). Phase labels in the corpus are coarse (General / Combat / Spellcasting) until full source taxonomy is defined.

## Phases

1. Build script + committed JSON bundle + attribution file
2. Corpus loader with common aliases (`advantage`, `ac`)
3. Route `lookup.ts` to real D&D corpus; keep WH40k/Starcraft samples
4. Tests, `npm run corpus:build-dnd`, roadmap update
