import { findDndCorpusEntry, getDndCorpusEntries } from '@/lib/corpus/dnd5e-srd';
import { findStarcraftCorpusEntry, getStarcraftCorpusEntries } from '@/lib/corpus/starcraft-core';
import { findWh40kCorpusEntry, getWh40kCorpusEntries } from '@/lib/corpus/wh40k-core';
import type { CorpusEntry, CorpusSource, PhaseApplicability } from '@/lib/corpus/types';
import type { GameSystemId } from '@/store/session';

export type { PhaseApplicability, CorpusSource };

export type LookupHit = {
  found: true;
  keyword: string;
  explanation: string;
  phase: string;
  phaseApplicability: PhaseApplicability;
  citation: string;
  source?: CorpusSource;
};

export type LookupMiss = {
  found: false;
  query: string;
};

export type LookupResult = LookupHit | LookupMiss;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getCorpusEntries(systemId: GameSystemId): CorpusEntry[] {
  if (systemId === 'dnd5e-srd') {
    return getDndCorpusEntries();
  }
  if (systemId === 'wh40k-11') {
    return getWh40kCorpusEntries();
  }
  return getStarcraftCorpusEntries();
}

function findCorpusEntry(query: string, systemId: GameSystemId): CorpusEntry | undefined {
  if (systemId === 'dnd5e-srd') {
    return findDndCorpusEntry(query);
  }
  if (systemId === 'wh40k-11') {
    return findWh40kCorpusEntry(query);
  }
  return findStarcraftCorpusEntry(query);
}

function toLookupHit(entry: CorpusEntry): LookupHit {
  return {
    found: true,
    keyword: entry.keyword,
    explanation: entry.explanation,
    phase: entry.phase,
    phaseApplicability: entry.applicability,
    citation: entry.citation,
    source: entry.source,
  };
}

export async function lookupKeyword(
  rawQuery: string,
  systemId: GameSystemId,
): Promise<LookupResult> {
  const query = normalize(rawQuery);
  if (!query) {
    return { found: false, query: rawQuery };
  }

  const match = findCorpusEntry(query, systemId);
  if (!match) {
    return { found: false, query: rawQuery.trim() || rawQuery };
  }

  return toLookupHit(match);
}

export function getPhasesForSystem(systemId: GameSystemId): string[] {
  const phases = new Set(getCorpusEntries(systemId).map((entry) => entry.phase));
  return [...phases].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

export function getKeywordsForPhase(phaseQuery: string, systemId: GameSystemId): string[] {
  const phase = normalize(phaseQuery);
  if (!phase) {
    return [];
  }

  return getCorpusEntries(systemId)
    .filter(
      (entry) =>
        normalize(entry.phase).includes(phase) || phase.includes(normalize(entry.phase)),
    )
    .map((entry) => entry.keyword)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

export function getKeywordSuggestions(
  rawQuery: string,
  systemId: GameSystemId,
  limit = 8,
): string[] {
  const query = normalize(rawQuery);
  if (!query) {
    return [];
  }

  return getCorpusEntries(systemId)
    .filter((entry) => normalize(entry.keyword).startsWith(query))
    .map((entry) => entry.keyword)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    .slice(0, limit);
}
