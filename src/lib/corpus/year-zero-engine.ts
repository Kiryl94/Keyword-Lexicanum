import type { CorpusBundle, CorpusEntry } from '@/lib/corpus/types';
import yzeBundleJson from '@/data/year-zero-engine-srd-corpus.json';

const yzeBundle = yzeBundleJson as CorpusBundle;
const YZE_SRD_CORPUS: CorpusEntry[] = yzeBundle.entries;

const aliasToKeyword = new Map<string, string>();
for (const entry of YZE_SRD_CORPUS) {
  const canonical = normalizeKeyword(entry.keyword);
  for (const alias of entry.aliases ?? []) {
    aliasToKeyword.set(normalizeKeyword(alias), canonical);
  }
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function findYzeCorpusEntry(query: string): CorpusEntry | undefined {
  const normalized = normalizeKeyword(query);
  if (!normalized) return undefined;

  const direct = YZE_SRD_CORPUS.find(
    (entry) => normalizeKeyword(entry.keyword) === normalized,
  );
  if (direct) return direct;

  const aliasTarget = aliasToKeyword.get(normalized);
  if (aliasTarget) {
    return YZE_SRD_CORPUS.find((entry) => normalizeKeyword(entry.keyword) === aliasTarget);
  }

  const prefixMatches = YZE_SRD_CORPUS.filter((entry) =>
    normalizeKeyword(entry.keyword).startsWith(normalized),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];

  return undefined;
}

export function getYzeCorpusEntries(): CorpusEntry[] {
  return YZE_SRD_CORPUS;
}

export function getYzeCorpusVersion(): string {
  return yzeBundle.version;
}

export function getYzeCorpusAttribution(): string {
  return yzeBundle.attribution;
}
