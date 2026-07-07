import type { CorpusBundle, CorpusEntry } from '@/lib/corpus/types';
import pf2eBundleJson from '@/data/pf2e-srd-corpus.json';

const pf2eBundle = pf2eBundleJson as CorpusBundle;
const PF2E_SRD_CORPUS: CorpusEntry[] = pf2eBundle.entries;

const aliasToKeyword = new Map<string, string>();
for (const entry of PF2E_SRD_CORPUS) {
  const canonical = normalizeKeyword(entry.keyword);
  for (const alias of entry.aliases ?? []) {
    aliasToKeyword.set(normalizeKeyword(alias), canonical);
  }
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function findPf2eCorpusEntry(query: string): CorpusEntry | undefined {
  const normalized = normalizeKeyword(query);
  if (!normalized) return undefined;

  const direct = PF2E_SRD_CORPUS.find(
    (entry) => normalizeKeyword(entry.keyword) === normalized,
  );
  if (direct) return direct;

  const aliasTarget = aliasToKeyword.get(normalized);
  if (aliasTarget) {
    return PF2E_SRD_CORPUS.find((entry) => normalizeKeyword(entry.keyword) === aliasTarget);
  }

  const prefixMatches = PF2E_SRD_CORPUS.filter((entry) =>
    normalizeKeyword(entry.keyword).startsWith(normalized),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];

  return undefined;
}

export function getPf2eCorpusEntries(): CorpusEntry[] {
  return PF2E_SRD_CORPUS;
}

export function getPf2eCorpusVersion(): string {
  return pf2eBundle.version;
}

export function getPf2eCorpusAttribution(): string {
  return pf2eBundle.attribution;
}
