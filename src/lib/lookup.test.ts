import { describe, expect, it } from 'vitest';
import {
  getKeywordSuggestions,
  getKeywordsForPhase,
  getPhasesForSystem,
  lookupKeyword,
} from '@/lib/lookup';
describe('lookupKeyword', () => {
  it('returns a hit for a known D&D term via alias', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword.toLowerCase()).toContain('advantage');
      expect(result.phaseApplicability).toBe('general');
      expect(result.source?.documentTitle).toContain('Reference Document');
      expect(result.source?.documentUrl).toMatch(/^https?:\/\//);
    }
  });

  it('returns a hit for a real SRD condition', async () => {
    const result = await lookupKeyword('blinded', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Blinded');
      expect(result.source?.section).toBe('Blinded');
      expect(result.citation).toContain('Blinded');
    }
  });

  it('returns a hit for a known WH40k term', async () => {
    const result = await lookupKeyword('close quarters', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('close quarters');
      expect(result.phase).toBe('Engagement');
      expect(result.phaseApplicability).toBe('restricted');
      expect(result.source?.documentUrl).toContain('warhammer-community.com');
    }
  });

  it('returns a hit for Lance in the WH40k sample corpus', async () => {
    const result = await lookupKeyword('lance', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Lance');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.source?.page).toBe(82);
      expect(result.corpusVersion).toBeTruthy();
    }
  });

  it('returns a brief Stratagems summary without individual stratagem cards', async () => {
    const result = await lookupKeyword('stratagems', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.explanation).toContain('favour');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.explanation).not.toMatch(/HEROIC INTERVENTION/i);
      expect(result.explanation).not.toMatch(/1CP/i);
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

  it('returns a brief Surge summary for Starcraft', async () => {
    const result = await lookupKeyword('surge', 'starcraft-mini');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Surge');
      expect(result.explanation).toContain('Combat Tag');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.explanation).not.toMatch(/Jim Raynor|James needs/i);
    }
  });

  it('matches case-insensitively', async () => {
    const result = await lookupKeyword('  ADVANTAGE  ', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Advantage and Disadvantage');
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
    expect(getKeywordSuggestions('adv', 'dnd5e-srd').length).toBeGreaterThan(0);
    expect(getKeywordSuggestions('ADV', 'dnd5e-srd').length).toBeGreaterThan(0);
  });

  it('returns an empty list when no keyword matches the prefix', () => {
    expect(getKeywordSuggestions('xyznotaterm999', 'dnd5e-srd')).toEqual([]);
  });

  it('scopes D&D suggestions to the real SRD corpus', () => {
    expect(getKeywordSuggestions('bl', 'dnd5e-srd')).toContain('Blinded');
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
    expect(getKeywordsForPhase('combat', 'dnd5e-srd')).toContain('Attack');
  });

  it('returns results sorted alphabetically', () => {
    const keywords = getKeywordsForPhase('battle round', 'wh40k-11');
    expect(keywords.length).toBeGreaterThan(1);
    expect(keywords).toEqual([...keywords].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });
});
