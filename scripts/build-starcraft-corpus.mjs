/**
 * Builds src/data/local/starcraft-core-corpus.json from the free Archon rulebook PDF.
 * Personal/local use only — see context/foundation/distribution-policy.md
 *
 * Run: npm run corpus:build-starcraft
 */

import {
  buildPdfSource,
  findRuleLocation,
  fetchPdfText,
  normalizeKeyword,
  pageAtOffset,
  writeCorpusBundle,
} from './corpus-pdf-utils.mjs';
import { STARCRAFT_RULES } from './starcraft-rules-manifest.mjs';

const STARCRAFT_PDF_URL =
  'https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf';

const STARCRAFT_DOCUMENT_TITLE = 'StarCraft Tabletop Miniatures Game Core Rules';

const MAX_SUMMARY_LENGTH = 320;

async function main() {
  const { text, pages, pageStarts } = await fetchPdfText(STARCRAFT_PDF_URL);
  console.log(`Parsed StarCraft TMG rulebook (${pages} pages, ${text.length} chars)`);

  const entries = [];
  const seen = new Set();

  for (const rule of STARCRAFT_RULES) {
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
      documentTitle: STARCRAFT_DOCUMENT_TITLE,
      documentUrl: STARCRAFT_PDF_URL,
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

  writeCorpusBundle('starcraft-core-corpus.json', {
    version: 'core-summaries-v2',
    license: 'Archon-download-personal-use',
    attribution:
      'StarCraft Tabletop Miniatures Game © Blizzard Entertainment / Archon Studio. ' +
      'Free PDF from starcraft-tmg.com. Personal/local use only; consult Archon before public distribution.',
    sourceDocumentUrl: STARCRAFT_PDF_URL,
    entryCount: entries.length,
    envKey: 'STARCRAFT_CORPUS_PATH',
    entries,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
