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

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/dnd5e-srd-corpus.json');

const CONDITIONS_URL =
  'https://raw.githubusercontent.com/cocoajamworld/srd-5.2.1/main/data/conditions.json';
const RULES_URL =
  'https://api.open5e.com/v2/rules/?document__slug=wotc-srd&limit=100';

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

function inferPhaseMeta(ruleset) {
  if (COMBAT_RULESETS.has(ruleset)) {
    return { phase: 'Combat', applicability: 'restricted' };
  }
  if (SPELL_RULESETS.has(ruleset)) {
    return { phase: 'Spellcasting', applicability: 'restricted' };
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

  const byKeyword = new Map();

  for (const rule of rules) {
    const keyword = normalizeKeyword(rule.name);
    if (!keyword || byKeyword.has(keyword)) continue;

    const { phase, applicability } = inferPhaseMeta(rule.ruleset);
    byKeyword.set(keyword, {
      keyword: rule.name,
      phase,
      applicability,
      explanation: cleanDescription(rule.desc),
      citation: `SRD 5.2.1 (CC BY 4.0) — ${rule.name}`,
    });
  }

  for (const condition of conditionsPayload.conditions) {
    const keyword = normalizeKeyword(condition.name);
    byKeyword.set(keyword, {
      keyword: condition.name,
      phase: 'Combat',
      applicability: 'general',
      explanation: cleanDescription(condition.description),
      citation: 'SRD 5.2.1 (CC BY 4.0) — Conditions',
    });
  }

  const entries = [...byKeyword.values()].sort((a, b) =>
    a.keyword.localeCompare(b.keyword, 'en', { sensitivity: 'base' }),
  );

  const output = {
    version: '5.2.1',
    license: 'CC-BY-4.0',
    attribution:
      'D&D System Reference Document v5.2.1, © Wizards of the Coast LLC. ' +
      'Licensed under CC BY 4.0. Rule text via Open5e API (wotc-srd); ' +
      'conditions via github.com/cocoajamworld/srd-5.2.1.',
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
