/**
 * Builds src/data/pf2e-srd-corpus.json from ORC-licensed curated manifest.
 * Run: npm run corpus:build-pf2e
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PF2E_DOCUMENT_TITLE,
  PF2E_DOCUMENT_URL,
  PF2E_RULES,
} from './pf2e-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/pf2e-srd-corpus.json');

function formatCitation(keyword, ruleRef) {
  return `${PF2E_DOCUMENT_TITLE} — ${ruleRef || keyword}`;
}

function toEntry(rule) {
  const section = rule.ruleRef ?? rule.keyword;
  const source = {
    documentTitle: PF2E_DOCUMENT_TITLE,
    documentUrl: PF2E_DOCUMENT_URL,
    section,
  };
  return {
    keyword: rule.keyword,
    phase: rule.phase,
    applicability: rule.applicability,
    explanation: rule.summary,
    citation: formatCitation(rule.keyword, rule.ruleRef),
    source,
    aliases: rule.aliases ?? [],
  };
}

const entries = PF2E_RULES.map(toEntry).sort((a, b) =>
  a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }),
);

const output = {
  version: 'pf2e-remaster-v6',
  license: 'ORC',
  attribution:
    'Pathfinder Remaster content © Paizo Inc. Summaries are brief paraphrases for table lookup; ' +
    'see ORC license at paizo.com/licenses. Not affiliated with or endorsed by Paizo.',
  sourceDocumentUrl: PF2E_DOCUMENT_URL,
  entryCount: entries.length,
  entries,
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote ${entries.length} entries to ${OUT_PATH}`);
