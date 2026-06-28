/**
 * Builds src/data/local/starcraft-core-corpus.json from the free Archon rulebook PDF.
 * Personal/local use only — see context/foundation/distribution-policy.md
 *
 * Run: npm run corpus:build-starcraft
 */

import {
  extractSection,
  fetchPdfText,
  normalizeKeyword,
  writeCorpusBundle,
} from './corpus-pdf-utils.mjs';

const STARCRAFT_PDF_URL =
  'https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf';

/** Curated keywords from StarCraft TMG core rules (living document — re-run after updates). */
const STARCRAFT_RULES = [
  { keyword: 'Supply', phase: 'Battle Round', applicability: 'general', labels: ['Supply', 'The Supply System', 'SUPPLY'] },
  { keyword: 'Reserves', phase: 'Deployment', applicability: 'restricted', labels: ['Reserves', 'Reserves-Based Deployment'] },
  { keyword: 'Alternating Activations', phase: 'Battle Round', applicability: 'general', labels: ['Alternating Activations'] },
  { keyword: 'Passing', phase: 'Battle Round', applicability: 'general', labels: ['Passing', 'Strategic Passing'] },
  { keyword: 'Surge', phase: 'Assault Phase', applicability: 'restricted', labels: ['Surge', 'Surge Mechanic', 'Surge Type'] },
  { keyword: 'Objective Control', phase: 'Battle Round', applicability: 'general', labels: ['Objective Control', 'Mission Markers'] },
  { keyword: 'Movement Phase', phase: 'Movement Phase', applicability: 'restricted', labels: ['Movement Phase'] },
  { keyword: 'Assault Phase', phase: 'Assault Phase', applicability: 'restricted', labels: ['Assault Phase'] },
  { keyword: 'Shooting Phase', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Shooting Phase'] },
  { keyword: 'Deployment', phase: 'Deployment', applicability: 'restricted', labels: ['Deployment', 'Deploy'] },
  { keyword: 'Line of Sight', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Line of Sight', 'line of sight'] },
  { keyword: 'Cover', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Cover'] },
  { keyword: 'Engagement', phase: 'Engagement', applicability: 'restricted', labels: ['Engagement', 'Engagement Range'] },
  { keyword: 'Draft System', phase: 'Deployment', applicability: 'restricted', labels: ['Draft System', 'Draft'] },
  { keyword: 'Minerals', phase: 'Army Building', applicability: 'general', labels: ['Minerals', 'Dual Resource Economy'] },
  { keyword: 'Vespene Gas', phase: 'Army Building', applicability: 'general', labels: ['Vespene Gas', 'Vespene'] },
];

async function main() {
  const { text, pages } = await fetchPdfText(STARCRAFT_PDF_URL);
  console.log(`Parsed StarCraft TMG rulebook (${pages} pages, ${text.length} chars)`);

  const allLabels = STARCRAFT_RULES.flatMap((rule) => rule.labels);
  const entries = [];
  const seen = new Set();

  for (const rule of STARCRAFT_RULES) {
    let explanation = null;
    for (const label of rule.labels) {
      explanation = extractSection(text, label, allLabels);
      if (explanation) break;
    }
    if (!explanation) {
      console.warn(`  skip (not found): ${rule.keyword}`);
      continue;
    }

    const key = normalizeKeyword(rule.keyword);
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push({
      keyword: rule.keyword,
      phase: rule.phase,
      applicability: rule.applicability,
      explanation,
      citation: 'StarCraft TMG Core Rules (Archon free PDF) — personal use',
    });
  }

  entries.sort((a, b) => a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }));

  writeCorpusBundle('starcraft-core-corpus.json', {
    version: '1.0',
    license: 'Archon-download-personal-use',
    attribution:
      'StarCraft Tabletop Miniatures Game © Blizzard Entertainment / Archon Studio. ' +
      'Free PDF from starcraft-tmg.com. Personal/local use only; consult Archon before public distribution.',
    entryCount: entries.length,
    envKey: 'STARCRAFT_CORPUS_PATH',
    entries,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
