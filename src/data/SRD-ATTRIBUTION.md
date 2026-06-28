# D&D SRD Corpus Attribution

This application includes game rules text from the **D&D System Reference Document v5.2.1**, © Wizards of the Coast LLC, used under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

## Source lineage

- **Rules sections:** [Open5e API](https://api.open5e.com/) (`document__slug=wotc-srd`), CC BY 4.0
- **Conditions:** [cocoajamworld/srd-5.2.1](https://github.com/cocoajamworld/srd-5.2.1) (`data/conditions.json`), CC BY 4.0

## Regenerating the corpus

```bash
npm run corpus:build-dnd
```

Output: `src/data/dnd5e-srd-corpus.json`

## Non-D&D systems

Warhammer 40k and Starcraft Miniature Game entries remain sample data until separate licensing clearance (PRD Open Question 2).
