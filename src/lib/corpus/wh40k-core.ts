import type { CorpusBundle, CorpusEntry } from '@/lib/corpus/types';
import wh40kBundleJson from '@/data/wh40k-active-corpus.json';

const wh40kBundle = wh40kBundleJson as CorpusBundle;
const WH40K_CORPUS: CorpusEntry[] = wh40kBundle.entries;

const wh40kByKeyword = new Map(
  WH40K_CORPUS.map((entry) => [normalizeKeyword(entry.keyword), entry]),
);

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function findWh40kCorpusEntry(query: string): CorpusEntry | undefined {
  const normalized = normalizeKeyword(query);
  if (!normalized) return undefined;

  const direct = wh40kByKeyword.get(normalized);
  if (direct) return direct;

  const prefixMatches = WH40K_CORPUS.filter((entry) =>
    normalizeKeyword(entry.keyword).startsWith(normalized),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];

  return undefined;
}

export function getWh40kCorpusEntries(): CorpusEntry[] {
  return WH40K_CORPUS;
}

export function getWh40kCorpusAttribution(): string {
  return wh40kBundle.attribution;
}
