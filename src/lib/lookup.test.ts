import { describe, expect, it } from 'vitest';
import { getKeywordSuggestions, lookupKeyword } from '@/lib/lookup';
describe('lookupKeyword', () => {
  it('returns a hit for a known D&D term', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('advantage');
      expect(result.citation).toBeTruthy();
    }
  });

  it('returns a hit for a known WH40k term', async () => {
    const result = await lookupKeyword('close quarters', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('close quarters');
      expect(result.phase).toBe('Engagement');
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
