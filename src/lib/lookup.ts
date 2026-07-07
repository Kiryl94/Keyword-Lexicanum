import { getCorpusVersion } from '@/lib/corpus/version';
import { findDndCorpusEntry, getDndCorpusEntries } from '@/lib/corpus/dnd5e-srd';
import { findPf2eCorpusEntry, getPf2eCorpusEntries } from '@/lib/corpus/pf2e-srd';
import { findStarcraftCorpusEntry, getStarcraftCorpusEntries } from '@/lib/corpus/starcraft-core';
import { findWh40kCorpusEntry, getWh40kCorpusEntries } from '@/lib/corpus/wh40k-core';
import { findYzeCorpusEntry, getYzeCorpusEntries } from '@/lib/corpus/year-zero-engine';
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
  /** Bumped when corpus content changes; stale recent-lookup cache entries are ignored. */
  corpusVersion?: string;
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
  switch (systemId) {
    case 'dnd5e-srd':
      return getDndCorpusEntries();
    case 'pf2e-srd':
      return getPf2eCorpusEntries();
    case 'year-zero-engine':
      return getYzeCorpusEntries();
    case 'wh40k-11':
      return getWh40kCorpusEntries();
    case 'starcraft-mini':
      return getStarcraftCorpusEntries();
    default:
      return [];
  }
}

function findCorpusEntry(query: string, systemId: GameSystemId): CorpusEntry | undefined {
  switch (systemId) {
    case 'dnd5e-srd':
      return findDndCorpusEntry(query);
    case 'pf2e-srd':
      return findPf2eCorpusEntry(query);
    case 'year-zero-engine':
      return findYzeCorpusEntry(query);
    case 'wh40k-11':
      return findWh40kCorpusEntry(query);
    case 'starcraft-mini':
      return findStarcraftCorpusEntry(query);
    default:
      return undefined;
  }
}

function getCorpusVersionForSystem(systemId: GameSystemId): string {
  return getCorpusVersion(systemId);
}

function toLookupHit(entry: CorpusEntry, systemId: GameSystemId): LookupHit {
  return {
    found: true,
    keyword: entry.keyword,
    explanation: entry.explanation,
    phase: entry.phase,
    phaseApplicability: entry.applicability,
    citation: entry.citation,
    source: entry.source,
    corpusVersion: getCorpusVersionForSystem(systemId),
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

  return toLookupHit(match, systemId);
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
