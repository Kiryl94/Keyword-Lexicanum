import { beforeEach, describe, expect, it } from 'vitest';
import type { LookupHit } from '@/lib/lookup';
import { getCorpusVersion } from '@/lib/corpus/version';
import {
  DEFAULT_SYSTEM_ID,
  MAX_RECENT_LOOKUPS,
  isValidGameSystemId,
  sanitizePersistedProfile,
  useSessionStore,
} from '@/store/session';

const sampleHit: LookupHit = {
  found: true,
  keyword: 'advantage',
  explanation: 'Roll twice, take higher.',
  phase: 'Ability Checks & Attacks',
  phaseApplicability: 'general',
  citation: 'SRD — Advantage',
  corpusVersion: getCorpusVersion('dnd5e-srd'),
};

describe('isValidGameSystemId', () => {
  it('accepts all PRD game systems', () => {
    expect(isValidGameSystemId('dnd5e-srd')).toBe(true);
    expect(isValidGameSystemId('wh40k-11')).toBe(true);
    expect(isValidGameSystemId('starcraft-mini')).toBe(true);
  });

  it('rejects unknown strings and non-strings', () => {
    expect(isValidGameSystemId('bogus')).toBe(false);
    expect(isValidGameSystemId(null)).toBe(false);
    expect(isValidGameSystemId(undefined)).toBe(false);
    expect(isValidGameSystemId(42)).toBe(false);
  });
});

describe('sanitizePersistedProfile', () => {
  it('falls back to default when activeSystemId is missing or invalid', () => {
    expect(sanitizePersistedProfile({}).activeSystemId).toBe(DEFAULT_SYSTEM_ID);
    expect(sanitizePersistedProfile({ activeSystemId: 'bogus' }).activeSystemId).toBe(
      DEFAULT_SYSTEM_ID,
    );
  });

  it('preserves a valid activeSystemId', () => {
    expect(sanitizePersistedProfile({ activeSystemId: 'wh40k-11' }).activeSystemId).toBe(
      'wh40k-11',
    );
  });

  it('migrates legacy flat recentLookups into the active system bucket', () => {
    const result = sanitizePersistedProfile({
      activeSystemId: 'wh40k-11',
      recentLookups: ['engagement', 'advantage'],
    });

    expect(result.recentLookupsBySystem).toEqual({
      'wh40k-11': ['engagement', 'advantage'],
    });
  });

  it('preserves per-system recents and sanitizes unknown systems', () => {
    const result = sanitizePersistedProfile({
      recentLookupsBySystem: {
        'dnd5e-srd': ['advantage', 42, 'initiative'],
        bogus: ['ignored'],
      },
    });

    expect(result.recentLookupsBySystem).toEqual({
      'dnd5e-srd': ['advantage', 'initiative'],
    });
  });

  it('returns empty recents when recentLookups is corrupted', () => {
    expect(
      sanitizePersistedProfile({ recentLookups: 'not-an-array' }).recentLookupsBySystem,
    ).toEqual({});
  });
});

describe('useSessionStore recent lookups', () => {
  beforeEach(() => {
    useSessionStore.setState({
      activeSystemId: DEFAULT_SYSTEM_ID,
      recentLookupsBySystem: {},
      recentLookupCacheBySystem: {},
    });
  });

  it('scopes recents and cache per system', () => {
    const { recordSuccessfulLookup, getRecentLookups, getCachedLookup } =
      useSessionStore.getState();

    recordSuccessfulLookup('dnd5e-srd', sampleHit);
    recordSuccessfulLookup('wh40k-11', {
      ...sampleHit,
      keyword: 'engagement',
      citation: 'Core Rules — Engagement',
      corpusVersion: getCorpusVersion('wh40k-11'),
    });

    expect(getRecentLookups('dnd5e-srd')).toEqual(['advantage']);
    expect(getRecentLookups('wh40k-11')).toEqual(['engagement']);
    expect(getCachedLookup('dnd5e-srd', 'advantage')).toEqual(sampleHit);
    expect(getCachedLookup('wh40k-11', 'engagement')?.keyword).toBe('engagement');
  });

  it('dedupes and caps recents per system', () => {
    const { recordSuccessfulLookup, getRecentLookups } = useSessionStore.getState();

    for (let i = 0; i < 12; i += 1) {
      recordSuccessfulLookup('dnd5e-srd', {
        ...sampleHit,
        keyword: `term-${i}`,
      });
    }

    recordSuccessfulLookup('dnd5e-srd', sampleHit);

    const recents = getRecentLookups('dnd5e-srd');
    expect(recents).toHaveLength(MAX_RECENT_LOOKUPS);
    expect(recents[0]).toBe('advantage');
  });

  it('clears recents and cache for one system without affecting others', () => {
    const {
      recordSuccessfulLookup,
      clearRecentLookups,
      getRecentLookups,
      getCachedLookup,
    } = useSessionStore.getState();

    recordSuccessfulLookup('dnd5e-srd', sampleHit);
    recordSuccessfulLookup('wh40k-11', {
      ...sampleHit,
      keyword: 'Lance',
      corpusVersion: getCorpusVersion('wh40k-11'),
    });

    clearRecentLookups('dnd5e-srd');

    expect(getRecentLookups('dnd5e-srd')).toEqual([]);
    expect(getCachedLookup('dnd5e-srd', 'advantage')).toBeUndefined();
    expect(getRecentLookups('wh40k-11')).toEqual(['Lance']);
    expect(getCachedLookup('wh40k-11', 'Lance')?.keyword).toBe('Lance');
  });

  it('keeps WH40k recents when switching active system to D&D', () => {
    const { recordSuccessfulLookup, setActiveSystem, getRecentLookups } =
      useSessionStore.getState();

    recordSuccessfulLookup('wh40k-11', {
      ...sampleHit,
      keyword: 'Close Quarters',
      corpusVersion: getCorpusVersion('wh40k-11'),
    });

    setActiveSystem('dnd5e-srd');

    expect(getRecentLookups('dnd5e-srd')).toEqual([]);
    expect(getRecentLookups('wh40k-11')).toEqual(['Close Quarters']);
    expect(useSessionStore.getState().activeSystemId).toBe('dnd5e-srd');
  });

  it('preserves per-system recents across a switch sequence', () => {
    const { recordSuccessfulLookup, setActiveSystem, getRecentLookups } =
      useSessionStore.getState();

    recordSuccessfulLookup('dnd5e-srd', sampleHit);
    setActiveSystem('wh40k-11');
    recordSuccessfulLookup('wh40k-11', {
      ...sampleHit,
      keyword: 'Lance',
      corpusVersion: getCorpusVersion('wh40k-11'),
    });
    setActiveSystem('dnd5e-srd');

    expect(getRecentLookups('dnd5e-srd')).toEqual(['advantage']);
    expect(getRecentLookups('wh40k-11')).toEqual(['Lance']);
  });

  it('rejects cached lookups when corpusVersion is stale', () => {
    const { recordSuccessfulLookup, getCachedLookup } = useSessionStore.getState();

    recordSuccessfulLookup('dnd5e-srd', {
      ...sampleHit,
      corpusVersion: 'stale-version',
    });

    expect(getCachedLookup('dnd5e-srd', 'advantage')).toBeUndefined();
  });
});
