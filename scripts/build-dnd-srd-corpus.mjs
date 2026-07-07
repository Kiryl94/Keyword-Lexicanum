/**
 * Builds src/data/dnd5e-srd-corpus.json from CC BY 4.0 sources:
 * - Open5e API (wotc-srd rules)
 * - SRD 5.2.1 conditions (cocoajamworld/srd-5.2.1)
 *
 * Run: node scripts/build-dnd-srd-corpus.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cleanDndExplanation,
  canonicalDndTopicKey,
  disambiguateDndPhaseKeyword,
  mergeDndDuplicateEntries,
  shouldExcludeDndEntry,
} from './dnd-corpus-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/dnd5e-srd-corpus.json');

const CONDITIONS_URL =
  'https://raw.githubusercontent.com/cocoajamworld/srd-5.2.1/main/data/conditions.json';
const RULES_URL =
  'https://api.open5e.com/v2/rules/?document__slug=wotc-srd&limit=100';

const DND_DOCUMENT_TITLE = 'D&D System Reference Document 5.2.1';
const DND_DOCUMENT_URL = 'https://www.dndbeyond.com/sources/dnd/free-rules';

function formatCorpusCitation(source) {
  const parts = [source.documentTitle];
  if (source.page) {
    parts.push(`p. ${source.page}`);
  }
  if (source.section) {
    parts.push(`— ${source.section}`);
  }
  return parts.join(', ').replace(', —', ' —');
}

function dndRuleSource(section, documentUrl = DND_DOCUMENT_URL) {
  const source = {
    documentTitle: DND_DOCUMENT_TITLE,
    documentUrl,
    section,
  };
  return { source, citation: formatCorpusCitation(source) };
}

const COMBAT_RULESETS = new Set([
  'srd_actions-in-combat',
  'srd_attacking',
  'srd_combat',
  'srd_cover',
  'srd_damage-and-healing',
  'srd_initiative',
  'srd_movement-and-position',
  'srd_underwater-combat',
]);

const SPELL_RULESETS = new Set([
  'srd_spellcasting',
  'srd_spells',
  'srd_spells-casting',
]);

const EXPLORATION_RULESETS = new Set([
  'srd_exploration',
  'srd_travel',
  'srd_environment',
  'srd_hazards',
]);

const SOCIAL_RULESETS = new Set([
  'srd_social-interaction',
]);

const ADVENTURING_RULESETS = new Set([
  'srd_adventuring',
  'srd_equipment',
  'srd_using-ability-scores',
]);

function inferPhaseMeta(ruleset) {
  if (COMBAT_RULESETS.has(ruleset)) {
    return { phase: 'Combat', applicability: 'restricted' };
  }
  if (SPELL_RULESETS.has(ruleset)) {
    return { phase: 'Spellcasting', applicability: 'restricted' };
  }
  if (EXPLORATION_RULESETS.has(ruleset)) {
    return { phase: 'Exploration', applicability: 'restricted' };
  }
  if (SOCIAL_RULESETS.has(ruleset)) {
    return { phase: 'Social', applicability: 'restricted' };
  }
  if (ADVENTURING_RULESETS.has(ruleset)) {
    return { phase: 'Adventuring', applicability: 'general' };
  }
  if (ruleset === 'srd_conditions') {
    return { phase: 'Combat', applicability: 'general' };
  }
  return { phase: 'General', applicability: 'general' };
}

function normalizeKeyword(value) {
  return value.trim().toLowerCase();
}

function cleanDescription(text) {
  return text.replace(/\*\*/g, '').replace(/\*/g, '•').trim();
}

async function fetchAllRules() {
  const results = [];
  let url = RULES_URL;

  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open5e rules fetch failed: ${response.status} ${url}`);
    }
    const payload = await response.json();
    results.push(...payload.results);
    url = payload.next;
  }

  return results;
}

async function main() {
  const [conditionsPayload, rules] = await Promise.all([
    fetch(CONDITIONS_URL).then((r) => {
      if (!r.ok) throw new Error(`Conditions fetch failed: ${r.status}`);
      return r.json();
    }),
    fetchAllRules(),
  ]);

  const byTopicPhase = new Map();

  function topicPhaseKey(keyword, phase) {
    return `${canonicalDndTopicKey(keyword)}::${normalizeKeyword(phase)}`;
  }

  function refreshTopicDisambiguation(topicKey) {
    const related = [...byTopicPhase.entries()].filter(([key]) =>
      key.startsWith(`${topicKey}::`),
    );
    if (related.length <= 1) return;

    for (const [key, entry] of related) {
      const baseKeyword = entry.keyword.replace(/\s*\([^)]+ Only\)$/i, '').trim();
      const nextKeyword =
        entry.applicability === 'restricted'
          ? disambiguateDndPhaseKeyword(baseKeyword, entry.phase)
          : baseKeyword;
      if (nextKeyword !== entry.keyword) {
        byTopicPhase.set(key, { ...entry, keyword: nextKeyword });
      }
    }
  }

  function upsertEntry(candidate) {
    const topicKey = canonicalDndTopicKey(candidate.keyword);
    if (!topicKey) return;

    const key = topicPhaseKey(candidate.keyword, candidate.phase);
    const existing = byTopicPhase.get(key);
    if (existing) {
      byTopicPhase.set(key, mergeDndDuplicateEntries(existing, candidate));
    } else {
      byTopicPhase.set(key, { ...candidate });
    }
    refreshTopicDisambiguation(topicKey);
  }

  for (const rule of rules) {
    const keyword = rule.name.trim();
    if (!keyword) continue;

    const rawExplanation = cleanDescription(rule.desc);
    if (shouldExcludeDndEntry(keyword, rawExplanation)) continue;

    const explanation = cleanDndExplanation(rawExplanation);
    if (!explanation || explanation.length < 15) continue;

    const { phase, applicability } = inferPhaseMeta(rule.ruleset);
    const open5eUrl = `https://open5e.com/search/?query=${encodeURIComponent(keyword)}`;
    const { source, citation } = dndRuleSource(keyword, open5eUrl);
    upsertEntry({
      keyword,
      phase,
      applicability,
      explanation,
      citation,
      source,
    });
  }

  for (const condition of conditionsPayload.conditions) {
    const keyword = condition.name.trim();
    const rawExplanation = cleanDescription(condition.description);
    if (shouldExcludeDndEntry(keyword, rawExplanation)) continue;

    const explanation = cleanDndExplanation(rawExplanation);
    if (!explanation || explanation.length < 15) continue;

    const open5eUrl = `https://open5e.com/search/?query=${encodeURIComponent(`${keyword} condition`)}`;
    const { source, citation } = dndRuleSource(keyword, open5eUrl);
    upsertEntry({
      keyword,
      phase: 'Combat',
      applicability: 'general',
      explanation,
      citation,
      source,
    });
  }

  const entries = [...byTopicPhase.values()].sort((a, b) =>
    a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }),
  );

  const output = {
    version: '5.2.1-lookup-v3',
    license: 'CC-BY-4.0',
    attribution:
      'D&D System Reference Document v5.2.1, © Wizards of the Coast LLC. ' +
      'Licensed under CC BY 4.0. Rule text via Open5e API (wotc-srd); ' +
      'conditions via github.com/cocoajamworld/srd-5.2.1.',
    sourceDocumentUrl: DND_DOCUMENT_URL,
    entryCount: entries.length,
    entries,
  };

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${entries.length} entries to ${OUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
