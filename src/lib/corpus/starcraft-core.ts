import type { CorpusBundle, CorpusEntry } from '@/lib/corpus/types';
import starcraftBundleJson from '@/data/starcraft-active-corpus.json';

const starcraftBundle = starcraftBundleJson as CorpusBundle;
const STARCRAFT_CORPUS: CorpusEntry[] = starcraftBundle.entries;

const starcraftByKeyword = new Map(
  STARCRAFT_CORPUS.map((entry) => [normalizeKeyword(entry.keyword), entry]),
);

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export function findStarcraftCorpusEntry(query: string): CorpusEntry | undefined {
  const normalized = normalizeKeyword(query);
  if (!normalized) return undefined;

  const direct = starcraftByKeyword.get(normalized);
  if (direct) return direct;

  const prefixMatches = STARCRAFT_CORPUS.filter((entry) =>
    normalizeKeyword(entry.keyword).startsWith(normalized),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];

  return undefined;
}

export function getStarcraftCorpusEntries(): CorpusEntry[] {
  return STARCRAFT_CORPUS;
}

export function getStarcraftCorpusAttribution(): string {
  return starcraftBundle.attribution;
}
