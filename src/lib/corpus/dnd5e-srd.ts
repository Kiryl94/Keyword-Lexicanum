import type { CorpusBundle, CorpusEntry } from '@/lib/corpus/types';
import dndBundleJson from '@/data/dnd5e-srd-corpus.json';

const dndBundle = dndBundleJson as CorpusBundle;
const DND_SRD_CORPUS: CorpusEntry[] = dndBundle.entries;

const aliasToKeyword = new Map<string, string>();
for (const entry of DND_SRD_CORPUS) {
  const canonical = normalizeKeyword(entry.keyword);
  for (const alias of entry.aliases ?? []) {
    aliasToKeyword.set(normalizeKeyword(alias), canonical);
  }
}

/** Common table terms → canonical SRD entry keyword (normalized). */
const DND_KEYWORD_ALIASES: Record<string, string> = {
  advantage: 'advantage and disadvantage',
  disadvantage: 'advantage and disadvantage',
  ac: 'armor class',
  hp: 'hit points',
  dc: 'difficulty class',
  grapple: 'grappling',
  dash: 'dashing',
  dodge: 'dodging',
  help: 'helping',
  hide: 'hiding',
  ready: 'readying an action',
  search: 'searching',
  concentration: 'concentration',
  initiative: 'initiative',
  opportunity: 'opportunity attacks',
  'opportunity attack': 'opportunity attacks',
  rest: 'resting',
  'short rest': 'resting',
  'long rest': 'resting',
};

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function findDndCorpusEntry(query: string): CorpusEntry | undefined {
  const normalized = normalizeKeyword(query);
  if (!normalized) return undefined;

  const direct = DND_SRD_CORPUS.find(
    (entry) => normalizeKeyword(entry.keyword) === normalized,
  );
  if (direct) return direct;

  const corpusAlias = aliasToKeyword.get(normalized);
  if (corpusAlias) {
    return DND_SRD_CORPUS.find((entry) => normalizeKeyword(entry.keyword) === corpusAlias);
  }

  const aliasTarget = DND_KEYWORD_ALIASES[normalized];
  if (aliasTarget) {
    return DND_SRD_CORPUS.find((entry) => normalizeKeyword(entry.keyword) === aliasTarget);
  }

  const prefixMatches = DND_SRD_CORPUS.filter((entry) =>
    normalizeKeyword(entry.keyword).startsWith(normalized),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];

  return undefined;
}

export function getDndCorpusEntries(): CorpusEntry[] {
  return DND_SRD_CORPUS;
}

export function getDndCorpusVersion(): string {
  return dndBundle.version;
}

export function getDndCorpusAttribution(): string {
  return dndBundle.attribution;
}
