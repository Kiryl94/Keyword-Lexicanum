/**
 * Builds src/data/local/wh40k-core-corpus.json from the free GW Core Rules PDF.
 * Personal/local use only — see context/foundation/distribution-policy.md
 *
 * Run: npm run corpus:build-wh40k
 */

import {
  buildPdfSource,
  findRuleLocation,
  fetchPdfText,
  normalizeKeyword,
  pageAtOffset,
  writeCorpusBundle,
} from './corpus-pdf-utils.mjs';
import { WH40K_RULES } from './wh40k-rules-manifest.mjs';

const WH40K_PDF_URL =
  'https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf';

const WH40K_DOCUMENT_TITLE = 'Warhammer 40,000 11th ed Core Rules';

const MAX_SUMMARY_LENGTH = 320;

async function main() {
  const { text, pages, pageStarts } = await fetchPdfText(WH40K_PDF_URL);
  console.log(`Parsed WH40k 11th ed Core Rules PDF (${pages} pages, ${text.length} chars)`);

  const entries = [];
  const seen = new Set();

  for (const rule of WH40K_RULES) {
    if (rule.summary.length > MAX_SUMMARY_LENGTH) {
      console.warn(`  summary too long (${rule.summary.length} chars): ${rule.keyword}`);
    }

    const location = findRuleLocation(text, rule.labels);
    if (!location) {
      console.warn(`  skip (not found): ${rule.keyword}`);
      continue;
    }

    const key = normalizeKeyword(rule.keyword);
    if (seen.has(key)) continue;
    seen.add(key);

    const page = pageAtOffset(pageStarts, location.startIndex);
    const section = rule.ruleRef ? `${rule.keyword} (${rule.ruleRef})` : rule.keyword;
    const { source, citation } = buildPdfSource({
      documentTitle: WH40K_DOCUMENT_TITLE,
      documentUrl: WH40K_PDF_URL,
      page,
      section,
    });

    entries.push({
      keyword: rule.keyword,
      phase: rule.phase,
      applicability: rule.applicability,
      explanation: rule.summary,
      citation,
      source,
    });
  }

  entries.sort((a, b) => a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }));

  writeCorpusBundle('wh40k-core-corpus.json', {
    version: '11th-core-summaries-v2',
    license: 'GW-download-personal-use',
    attribution:
      'Warhammer 40,000 11th ed Core Rules © Games Workshop Limited. ' +
      'Free PDF: eng_01-06_warhammer40k_new40k_core_rules (warhammer-community.com). ' +
      'Personal/local use only; consult GW before public distribution.',
    sourceDocumentUrl: WH40K_PDF_URL,
    entryCount: entries.length,
    envKey: 'WH40K_CORPUS_PATH',
    entries,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
