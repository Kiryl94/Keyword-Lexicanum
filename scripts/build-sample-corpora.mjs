/**
 * Builds public sample corpora from curated manifests (paraphrased summaries only).
 * Safe for Vercel preview per distribution-policy.md — not verbatim publisher text.
 *
 * Run: npm run corpus:build-samples
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WH40K_RULES } from './wh40k-rules-manifest.mjs';
import { STARCRAFT_RULES } from './starcraft-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../src/data');

const WH40K_PDF_URL =
  'https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf';
const STARCRAFT_PDF_URL =
  'https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf';

function toSampleEntry(rule, documentTitle, documentUrl) {
  const section = rule.ruleRef ? `${rule.keyword} (${rule.ruleRef})` : rule.keyword;
  return {
    keyword: rule.keyword,
    phase: rule.phase,
    applicability: rule.applicability,
    explanation: rule.summary,
    citation: `${documentTitle} — ${rule.keyword} (sample)`,
    source: {
      documentTitle,
      documentUrl,
      section,
    },
  };
}

function writeSample(filename, bundle) {
  const outPath = join(DATA_DIR, filename);
  writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${bundle.entryCount} sample entries to ${outPath}`);
}

const wh40kEntries = WH40K_RULES.map((rule) =>
  toSampleEntry(rule, 'Warhammer 40,000 11th ed Core Rules', WH40K_PDF_URL),
).sort((a, b) => a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }));

writeSample('wh40k-core-corpus.sample.json', {
  version: 'sample-v5',
  license: 'sample-only',
  attribution:
    'Representative paraphrased entries for UX/demo. Not official Games Workshop text. ' +
    'Build full corpus locally with npm run corpus:build-wh40k.',
  entryCount: wh40kEntries.length,
  entries: wh40kEntries,
  sourceDocumentUrl: WH40K_PDF_URL,
});

const starcraftEntries = STARCRAFT_RULES.map((rule) =>
  toSampleEntry(
    rule,
    'StarCraft Tabletop Miniatures Game Core Rules',
    STARCRAFT_PDF_URL,
  ),
).sort((a, b) => a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }));

writeSample('starcraft-core-corpus.sample.json', {
  version: 'sample-v5',
  license: 'sample-only',
  attribution:
    'Representative paraphrased entries for UX/demo. Not official Archon/Blizzard text. ' +
    'Build full corpus locally with npm run corpus:build-starcraft.',
  entryCount: starcraftEntries.length,
  entries: starcraftEntries,
  sourceDocumentUrl: STARCRAFT_PDF_URL,
});
