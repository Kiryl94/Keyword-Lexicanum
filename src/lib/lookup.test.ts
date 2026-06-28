import { describe, expect, it } from 'vitest';
import {
  getKeywordSuggestions,
  getKeywordsForPhase,
  getPhasesForSystem,
  lookupKeyword,
} from '@/lib/lookup';
describe('lookupKeyword', () => {
  it('returns a hit for a known D&D term', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('advantage');
      expect(result.phaseApplicability).toBe('general');
      expect(result.citation).toBeTruthy();
    }
  });

  it('returns a hit for a known WH40k term', async () => {
    const result = await lookupKeyword('close quarters', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('close quarters');
      expect(result.phase).toBe('Engagement');
      expect(result.phaseApplicability).toBe('restricted');
      expect(result.citation).toBeTruthy();
    }
  });

  it('returns a hit for a known Starcraft term', async () => {
    const result = await lookupKeyword('engagement', 'starcraft-mini');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('engagement');
      expect(result.citation).toBeTruthy();
    }
  });

  it('matches case-insensitively', async () => {
    const result = await lookupKeyword('  ADVANTAGE  ', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('advantage');
    }
  });

  it('returns a miss for unknown terms', async () => {
    const result = await lookupKeyword('xyznotaterm', 'dnd5e-srd');
    expect(result).toEqual({ found: false, query: 'xyznotaterm' });
  });

  it('returns a miss for empty or whitespace-only queries', async () => {
    expect(await lookupKeyword('', 'dnd5e-srd')).toEqual({ found: false, query: '' });
    expect(await lookupKeyword('   ', 'dnd5e-srd')).toEqual({ found: false, query: '   ' });
  });
});

describe('getKeywordSuggestions', () => {
  it('returns an empty list for empty or whitespace-only queries', () => {
    expect(getKeywordSuggestions('', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordSuggestions('   ', 'dnd5e-srd')).toEqual([]);
  });

  it('matches prefixes case-insensitively', () => {
    expect(getKeywordSuggestions('adv', 'dnd5e-srd')).toContain('advantage');
    expect(getKeywordSuggestions('ADV', 'dnd5e-srd')).toContain('advantage');
  });

  it('returns an empty list when no keyword matches the prefix', () => {
    expect(getKeywordSuggestions('xyz', 'dnd5e-srd')).toEqual([]);
  });

  it('scopes results to the active game system', () => {
    expect(getKeywordSuggestions('close', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('close quarters');
  });

  it('respects the result limit', () => {
    const allMatches = getKeywordSuggestions('a', 'dnd5e-srd');
    expect(allMatches.length).toBeGreaterThan(1);
    expect(getKeywordSuggestions('a', 'dnd5e-srd', 1)).toHaveLength(1);
  });

  it('matches multi-word keywords by prefix on the first word', () => {
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('close quarters');
  });
});

describe('getPhasesForSystem', () => {
  it('returns sorted unique phases for a system', () => {
    const phases = getPhasesForSystem('wh40k-11');
    expect(phases).toContain('Engagement');
    expect(phases).toContain('Charge Phase');
    expect(new Set(phases).size).toBe(phases.length);
    expect(phases).toEqual([...phases].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });
});

describe('getKeywordsForPhase', () => {
  it('returns an empty list for empty or whitespace-only queries', () => {
    expect(getKeywordsForPhase('', 'wh40k-11')).toEqual([]);
    expect(getKeywordsForPhase('   ', 'dnd5e-srd')).toEqual([]);
  });

  it('returns keywords matching the phase case-insensitively', () => {
    expect(getKeywordsForPhase('engagement', 'wh40k-11')).toContain('close quarters');
    expect(getKeywordsForPhase('ENGAGEMENT', 'wh40k-11')).toContain('close quarters');
  });

  it('scopes results to the active game system', () => {
    expect(getKeywordsForPhase('engagement', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordsForPhase('combat', 'dnd5e-srd')).toContain('initiative');
  });

  it('returns results sorted alphabetically', () => {
    const keywords = getKeywordsForPhase('battle round', 'wh40k-11');
    expect(keywords.length).toBeGreaterThan(1);
    expect(keywords).toEqual([...keywords].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });
});
