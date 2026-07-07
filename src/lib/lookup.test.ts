import { describe, expect, it } from 'vitest';
import { getCorpusVersion } from '@/lib/corpus/version';
import {
  getKeywordSuggestions,
  getKeywordsForPhase,
  getPhasesForSystem,
  lookupKeyword,
} from '@/lib/lookup';
import type { GameSystemId } from '@/store/session';
describe('lookupKeyword', () => {
  it('returns a hit for a known D&D term via alias', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Advantage and Disadvantage');
      expect(result.phaseApplicability).toBe('general');
      expect(result.source?.documentTitle).toContain('Reference Document');
      expect(result.source?.documentUrl).toMatch(/^https?:\/\//);
    }
  });

  it('resolves slash and alias forms to the single Advantage entry', async () => {
    const slash = await lookupKeyword('advantage/disadvantage', 'dnd5e-srd');
    const disadvantage = await lookupKeyword('disadvantage', 'dnd5e-srd');
    expect(slash.found).toBe(true);
    expect(disadvantage.found).toBe(true);
    if (slash.found && disadvantage.found) {
      expect(slash.keyword).toBe('Advantage and Disadvantage');
      expect(disadvantage.keyword).toBe('Advantage and Disadvantage');
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

  it('excludes pure numeric reference tables from the D&D corpus', async () => {
    const result = await lookupKeyword(
      'experience points by challenge rating',
      'dnd5e-srd',
    );
    expect(result.found).toBe(false);
  });

  it('strips score tables from Ability Modifiers', async () => {
    const result = await lookupKeyword('ability modifiers', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.explanation).not.toContain('|');
      expect(result.explanation).not.toMatch(/\+0|10–11/);
      expect(result.explanation).toContain('ability modifier');
    }
  });

  it('returns a hit for a known WH40k term', async () => {
    const result = await lookupKeyword('close quarters', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Close Quarters');
      expect(result.phase).toBe('Shooting Phase');
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
      expect(result.source?.section).toContain('24.21');
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
      expect(result.keyword).toBe('Engagement');
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

  it('does not return WH40k-only terms when D&D is active', async () => {
    const result = await lookupKeyword('close quarters', 'dnd5e-srd');
    expect(result).toEqual({ found: false, query: 'close quarters' });
  });

  it('scopes engagement to StarCraft — miss under D&D, hit under StarCraft', async () => {
    const dndResult = await lookupKeyword('engagement', 'dnd5e-srd');
    expect(dndResult).toEqual({ found: false, query: 'engagement' });

    const scResult = await lookupKeyword('engagement', 'starcraft-mini');
    expect(scResult.found).toBe(true);
    if (scResult.found) {
      expect(scResult.keyword).toBe('Engagement');
    }
  });

  it('stamps corpusVersion on hits for every game system', async () => {
    const cases: Array<{ query: string; systemId: GameSystemId }> = [
      { query: 'advantage', systemId: 'dnd5e-srd' },
      { query: 'strike', systemId: 'pf2e-srd' },
      { query: 'push', systemId: 'year-zero-engine' },
      { query: 'lance', systemId: 'wh40k-11' },
      { query: 'engagement', systemId: 'starcraft-mini' },
    ];

    for (const { query, systemId } of cases) {
      const result = await lookupKeyword(query, systemId);
      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.corpusVersion).toBe(getCorpusVersion(systemId));
      }
    }
  });

  it('stamps pf2e-remaster-v4 and yze-srd-v5 on expanded SRD hits', async () => {
    const pf2e = await lookupKeyword('degree of success', 'pf2e-srd');
    expect(pf2e.found).toBe(true);
    if (pf2e.found) {
      expect(pf2e.corpusVersion).toBe('pf2e-remaster-v4');
      expect(pf2e.keyword).toBe('Degree of Success');
    }

    const yze = await lookupKeyword('suppressive fire', 'year-zero-engine');
    expect(yze.found).toBe(true);
    if (yze.found) {
      expect(yze.corpusVersion).toBe('yze-srd-v5');
      expect(yze.keyword).toBe('Suppressive Fire');
    }

    const detect = await lookupKeyword('detect magic', 'pf2e-srd');
    expect(detect.found).toBe(true);
    if (detect.found) {
      expect(detect.keyword).toBe('Detect Magic');
    }

    const hunger = await lookupKeyword('hunger', 'year-zero-engine');
    expect(hunger.found).toBe(true);
    if (hunger.found) {
      expect(hunger.keyword).toBe('Hunger');
    }
  });

  it('scopes degree of success to PF2e — miss under D&D and YZE', async () => {
    expect(await lookupKeyword('degree of success', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'degree of success',
    });
    expect(await lookupKeyword('degree of success', 'year-zero-engine')).toEqual({
      found: false,
      query: 'degree of success',
    });
  });

  it('returns PF2e v5 healing and condition keywords', async () => {
    const banishment = await lookupKeyword('banishment', 'pf2e-srd');
    expect(banishment.found).toBe(true);
    if (banishment.found) {
      expect(banishment.keyword).toBe('Banishment');
      expect(banishment.phaseApplicability).toBe('restricted');
    }

    const counteract = await lookupKeyword('counteract check', 'pf2e-srd');
    expect(counteract.found).toBe(true);
    if (counteract.found) {
      expect(counteract.keyword).toBe('Counteract');
    }

    const firstAid = await lookupKeyword('first aid', 'pf2e-srd');
    expect(firstAid.found).toBe(true);
    if (firstAid.found) {
      expect(firstAid.keyword).toBe('Administer First Aid');
    }
  });

  it('returns YZE v5 survival and stress keywords', async () => {
    const rally = await lookupKeyword('rally', 'year-zero-engine');
    expect(rally.found).toBe(true);
    if (rally.found) {
      expect(rally.keyword).toBe('Rally');
    }

    const breaking = await lookupKeyword('breaking point', 'year-zero-engine');
    expect(breaking.found).toBe(true);
    if (breaking.found) {
      expect(breaking.keyword).toBe('Breaking Point');
    }

    const thirst = await lookupKeyword('thirst', 'year-zero-engine');
    expect(thirst.found).toBe(true);
    if (thirst.found) {
      expect(thirst.keyword).toBe('Thirst');
    }
  });

  it('scopes banishment to PF2e — miss under D&D', async () => {
    expect(await lookupKeyword('banishment', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'banishment',
    });
  });

  it('returns PF2e hits for remaster terms and aliases', async () => {
    const strike = await lookupKeyword('strike', 'pf2e-srd');
    expect(strike.found).toBe(true);
    if (strike.found) {
      expect(strike.keyword).toBe('Strike');
    }

    const alias = await lookupKeyword('flat-footed', 'pf2e-srd');
    expect(alias.found).toBe(true);
    if (alias.found) {
      expect(alias.keyword).toBe('Off-Guard');
    }

    const hero = await lookupKeyword('hero points', 'pf2e-srd');
    expect(hero.found).toBe(true);
    if (hero.found) {
      expect(hero.keyword).toBe('Hero Point');
    }

    const reactive = await lookupKeyword('attack of opportunity', 'pf2e-srd');
    expect(reactive.found).toBe(true);
    if (reactive.found) {
      expect(reactive.keyword).toBe('Reactive Strike');
    }
  });

  it('returns YZE SRD hits', async () => {
    const result = await lookupKeyword('push', 'year-zero-engine');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Push');
      expect(result.explanation.toLowerCase()).toContain('push');
    }

    const hp = await lookupKeyword('hp', 'year-zero-engine');
    expect(hp.found).toBe(true);
    if (hp.found) {
      expect(hp.keyword).toBe('Hit Points');
    }

    const group = await lookupKeyword('group roll', 'year-zero-engine');
    expect(group.found).toBe(true);
    if (group.found) {
      expect(group.keyword).toBe('Group Roll');
    }
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
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('Close Quarters');
  });

  it('suggests PF2e Reactive Strike from react prefix', () => {
    expect(getKeywordSuggestions('react', 'pf2e-srd')).toContain('Reactive Strike');
    expect(getKeywordSuggestions('react', 'dnd5e-srd')).not.toContain('Reactive Strike');
  });

  it('suggests PF2e Counteract and Detect Magic from v5 prefixes', () => {
    expect(getKeywordSuggestions('count', 'pf2e-srd')).toContain('Counteract');
    expect(getKeywordSuggestions('det', 'pf2e-srd')).toContain('Detect Magic');
    expect(getKeywordSuggestions('count', 'dnd5e-srd')).not.toContain('Counteract');
  });

  it('respects the result limit', () => {
    const allMatches = getKeywordSuggestions('a', 'dnd5e-srd');
    expect(allMatches.length).toBeGreaterThan(1);
    expect(getKeywordSuggestions('a', 'dnd5e-srd', 1)).toHaveLength(1);
  });

  it('matches multi-word keywords by prefix on the first word', () => {
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('Close Quarters');
  });
});

describe('getPhasesForSystem', () => {
  it('returns sorted unique phases for a system', () => {
    const phases = getPhasesForSystem('wh40k-11');
    expect(phases).toContain('Fight Phase');
    expect(phases).toContain('Charge Phase');
    expect(new Set(phases).size).toBe(phases.length);
    expect(phases).toEqual([...phases].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });

  it('includes Encounter and Exploration for Pathfinder 2e SRD', () => {
    const phases = getPhasesForSystem('pf2e-srd');
    expect(phases).toContain('Encounter');
    expect(phases).toContain('Exploration');
    expect(phases).not.toContain('Fight Phase');
  });

  it('includes core YZE phase buckets', () => {
    const phases = getPhasesForSystem('year-zero-engine');
    expect(phases).toContain('Encounter');
    expect(phases).toContain('Exploration');
    expect(phases).toContain('Downtime');
    expect(phases).toContain('General');
  });
});

describe('getKeywordsForPhase', () => {
  it('returns an empty list for empty or whitespace-only queries', () => {
    expect(getKeywordsForPhase('', 'wh40k-11')).toEqual([]);
    expect(getKeywordsForPhase('   ', 'dnd5e-srd')).toEqual([]);
  });

  it('returns keywords matching the phase case-insensitively', () => {
    expect(getKeywordsForPhase('shooting', 'wh40k-11')).toContain('Close Quarters');
    expect(getKeywordsForPhase('fight', 'wh40k-11')).toContain('Engagement');
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

  it('returns PF2e exploration keywords from the ORC corpus', () => {
    const keywords = getKeywordsForPhase('exploration', 'pf2e-srd');
    expect(keywords).toContain('Detect Magic');
    expect(keywords).not.toContain('Reactive Strike');
  });

  it('returns PF2e encounter keywords from the ORC corpus', () => {
    const keywords = getKeywordsForPhase('encounter', 'pf2e-srd');
    expect(keywords).toContain('Strike');
    expect(keywords).toContain('Off-Guard');
    expect(keywords).toContain('Reactive Strike');
    expect(keywords).not.toContain('Close Quarters');
  });

  it('returns YZE encounter keywords without PF2e-only terms', () => {
    const keywords = getKeywordsForPhase('encounter', 'year-zero-engine');
    expect(keywords).toContain('Push');
    expect(keywords).toContain('Skill Roll');
    expect(keywords).toContain('Sneak Attack');
    expect(keywords).toContain('Group Roll');
    expect(keywords).toContain('Suppressive Fire');
    expect(keywords).not.toContain('Strike');
  });

  it('returns YZE downtime keywords from the FTL corpus', () => {
    const keywords = getKeywordsForPhase('downtime', 'year-zero-engine');
    expect(keywords).toContain('Rest');
    expect(keywords).toContain('Craft');
    expect(keywords).not.toContain('Reactive Strike');
  });

  it('returns YZE exploration keywords from the FTL corpus', () => {
    const keywords = getKeywordsForPhase('exploration', 'year-zero-engine');
    expect(keywords).toContain('Hunger');
    expect(keywords).toContain('Thirst');
    expect(keywords).toContain('Recon');
    expect(keywords).not.toContain('Detect Magic');
  });

  it('does not return D&D combat keywords when browsing PF2e phases', () => {
    expect(getKeywordsForPhase('combat', 'pf2e-srd')).not.toContain('Advantage');
    expect(getKeywordsForPhase('combat', 'pf2e-srd').length).toBe(0);
  });
});
