import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_SYSTEM_ID,
  MAX_RECENT_LOOKUPS,
  isValidGameSystemId,
  sanitizePersistedProfile,
  useSessionStore,
} from '@/store/session';

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

  it('coerces recentLookups to strings and caps length', () => {
    const keywords = Array.from({ length: 12 }, (_, i) => `term-${i}`);
    const result = sanitizePersistedProfile({
      recentLookups: ['valid', ...keywords, 42, null],
    });

    expect(result.recentLookups).toHaveLength(MAX_RECENT_LOOKUPS);
    expect(result.recentLookups.every((k) => typeof k === 'string')).toBe(true);
    expect(result.recentLookups[0]).toBe('valid');
  });

  it('returns empty recents when recentLookups is corrupted', () => {
    expect(sanitizePersistedProfile({ recentLookups: 'not-an-array' }).recentLookups).toEqual(
      [],
    );
  });
});

describe('useSessionStore addRecentLookup', () => {
  beforeEach(() => {
    useSessionStore.setState({
      activeSystemId: DEFAULT_SYSTEM_ID,
      recentLookups: [],
    });
  });

  it('dedupes keywords and moves the latest to the front', () => {
    const { addRecentLookup } = useSessionStore.getState();

    addRecentLookup('advantage');
    addRecentLookup('engagement');
    addRecentLookup('advantage');

    expect(useSessionStore.getState().recentLookups).toEqual(['advantage', 'engagement']);
  });

  it('caps recent lookups at ten entries', () => {
    const { addRecentLookup } = useSessionStore.getState();

    for (let i = 0; i < 12; i += 1) {
      addRecentLookup(`term-${i}`);
    }

    expect(useSessionStore.getState().recentLookups).toHaveLength(MAX_RECENT_LOOKUPS);
    expect(useSessionStore.getState().recentLookups[0]).toBe('term-11');
  });
});
