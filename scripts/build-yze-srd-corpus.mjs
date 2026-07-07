/**
 * Builds src/data/year-zero-engine-srd-corpus.json from YZE FTL SRD manifest.
 * Run: npm run corpus:build-yze
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  YZE_DOCUMENT_TITLE,
  YZE_DOCUMENT_URL,
  YZE_RULES,
} from './yze-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/year-zero-engine-srd-corpus.json');

function toEntry(rule) {
  const section = rule.ruleRef ?? rule.keyword;
  const source = {
    documentTitle: YZE_DOCUMENT_TITLE,
    documentUrl: YZE_DOCUMENT_URL,
    section,
  };
  return {
    keyword: rule.keyword,
    phase: rule.phase,
    applicability: rule.applicability,
    explanation: rule.summary,
    citation: `${YZE_DOCUMENT_TITLE} — ${section}`,
    source,
    aliases: rule.aliases ?? [],
  };
}

const entries = YZE_RULES.map(toEntry).sort((a, b) =>
  a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }),
);

const output = {
  version: 'yze-srd-v8',
  license: 'YZE-FTL',
  attribution:
    'Year Zero Engine SRD © Fria Ligan AB. Summaries are brief paraphrases for table lookup; ' +
    'published under the Year Zero Engine Free Tabletop License. Not affiliated with Free League.',
  sourceDocumentUrl: YZE_DOCUMENT_URL,
  entryCount: entries.length,
  entries,
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote ${entries.length} entries to ${OUT_PATH}`);
