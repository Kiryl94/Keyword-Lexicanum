/**
 * Builds src/data/local/wh40k-core-corpus.json from the free GW Core Rules PDF.
 * Personal/local use only — see context/foundation/distribution-policy.md
 *
 * Run: npm run corpus:build-wh40k
 */

import {
  extractSection,
  fetchPdfText,
  normalizeKeyword,
  writeCorpusBundle,
} from './corpus-pdf-utils.mjs';

const WH40K_PDF_URL =
  'https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf';

/** Curated core-rule keywords with phase metadata (11th ed Core Rules). */
const WH40K_RULES = [
  { keyword: 'Battle Round', phase: 'Battle Round', applicability: 'general', labels: ['THE BATTLE ROUND'] },
  { keyword: 'Command Phase', phase: 'Command Phase', applicability: 'restricted', labels: ['COMMAND PHASE'] },
  { keyword: 'Movement Phase', phase: 'Movement Phase', applicability: 'restricted', labels: ['MOVEMENT PHASE'] },
  { keyword: 'Shooting Phase', phase: 'Shooting Phase', applicability: 'restricted', labels: ['SHOOTING PHASE'] },
  { keyword: 'Charge Phase', phase: 'Charge Phase', applicability: 'restricted', labels: ['CHARGE PHASE'] },
  { keyword: 'Fight Phase', phase: 'Fight Phase', applicability: 'restricted', labels: ['FIGHT PHASE', 'START OF FIGHT PHASE'] },
  { keyword: 'Engagement', phase: 'Fight Phase', applicability: 'restricted', labels: ['ENGAGEMENT'] },
  { keyword: 'Engagement Range', phase: 'Fight Phase', applicability: 'restricted', labels: ['Engagement Range'] },
  { keyword: 'Coherency', phase: 'Movement Phase', applicability: 'restricted', labels: ['COHERENCY'] },
  { keyword: 'Objectives', phase: 'Battle Round', applicability: 'general', labels: ['OBJECTIVES', 'CONTROLLING A TERRAIN OBJECTIVE'] },
  { keyword: 'Battle-shock', phase: 'Command Phase', applicability: 'restricted', labels: ['BATTLE-SHOCK', 'Battle-shock'] },
  { keyword: 'Blast', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Blast'] },
  { keyword: 'Feel No Pain', phase: 'General', applicability: 'general', labels: ['Feel No Pain'] },
  { keyword: 'Deep Strike', phase: 'Movement Phase', applicability: 'restricted', labels: ['Deep Strike'] },
  { keyword: 'Infiltrators', phase: 'Deployment', applicability: 'restricted', labels: ['Infiltrators'] },
  { keyword: 'Reserves', phase: 'Movement Phase', applicability: 'restricted', labels: ['Reserves'] },
  { keyword: 'Transports', phase: 'Movement Phase', applicability: 'restricted', labels: ['Transports'] },
  { keyword: 'Cover', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Cover'] },
  { keyword: 'Line of Sight', phase: 'Shooting Phase', applicability: 'restricted', labels: ['Line of Sight'] },
  { keyword: 'Pile-in', phase: 'Fight Phase', applicability: 'restricted', labels: ['PILE-IN MOVES', 'Pile-in'] },
  { keyword: 'Consolidate', phase: 'Fight Phase', applicability: 'restricted', labels: ['ONGOING CONSOLIDATION', 'Consolidation'] },
  { keyword: 'Stratagems', phase: 'Command Phase', applicability: 'general', labels: ['STRATAGEMS'] },
  { keyword: 'Terrain', phase: 'Movement Phase', applicability: 'restricted', labels: ['TERRAIN AND MOVEMENT', 'TERRAIN PLACED ON THE BATTLEFIELD'] },
];

async function main() {
  const { text, pages } = await fetchPdfText(WH40K_PDF_URL);
  console.log(`Parsed WH40k 11th ed Core Rules PDF (${pages} pages, ${text.length} chars)`);

  const allLabels = WH40K_RULES.flatMap((rule) => rule.labels);
  const entries = [];
  const seen = new Set();

  for (const rule of WH40K_RULES) {
    let explanation = null;
    for (const label of rule.labels) {
      explanation = extractSection(text, label, allLabels);
      if (explanation && explanation.length >= 40) break;
      explanation = null;
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
      citation: 'WH40k 11th ed Core Rules (GW free PDF) — personal use',
    });
  }

  entries.sort((a, b) => a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }));

  writeCorpusBundle('wh40k-core-corpus.json', {
    version: '11th-core',
    license: 'GW-download-personal-use',
    attribution:
      'Warhammer 40,000 11th ed Core Rules © Games Workshop Limited. ' +
      'Free PDF: eng_01-06_warhammer40k_new40k_core_rules (warhammer-community.com). ' +
      'Personal/local use only; consult GW before public distribution.',
    entryCount: entries.length,
    envKey: 'WH40K_CORPUS_PATH',
    entries,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
