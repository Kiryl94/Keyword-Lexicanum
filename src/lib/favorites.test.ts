import { describe, expect, it } from 'vitest';
import {
  MAX_FAVORITE_KEYWORD_LENGTH,
  normalizeFavoriteKeyword,
  validateFavoriteInput,
  validateSystemId,
} from '@/lib/favorites';
import { isSupabaseConfigured } from '@/lib/supabase/config';

describe('isSupabaseConfigured', () => {
  it('is false when url or anon key is missing', () => {
    expect(isSupabaseConfigured(undefined, undefined)).toBe(false);
    expect(isSupabaseConfigured('https://example.supabase.co', undefined)).toBe(false);
    expect(isSupabaseConfigured(undefined, 'anon')).toBe(false);
    expect(isSupabaseConfigured('', 'anon')).toBe(false);
  });

  it('is true when both url and anon key are set', () => {
    expect(isSupabaseConfigured('https://example.supabase.co', 'anon-key')).toBe(true);
  });
});

describe('validateFavoriteInput', () => {
  it('accepts a valid system and keyword', () => {
    expect(validateFavoriteInput({ systemId: 'dnd5e-srd', keyword: '  Advantage  ' })).toEqual({
      ok: true,
      systemId: 'dnd5e-srd',
      keyword: 'Advantage',
    });
  });

  it('rejects invalid system ids', () => {
    expect(validateSystemId('not-a-system')).toEqual({
      ok: false,
      error: 'Invalid game system',
    });
    expect(validateFavoriteInput({ systemId: 'not-a-system', keyword: 'Advantage' }).ok).toBe(
      false,
    );
  });

  it('rejects empty keywords', () => {
    expect(validateFavoriteInput({ systemId: 'dnd5e-srd', keyword: '   ' })).toEqual({
      ok: false,
      error: 'Keyword is required',
    });
  });

  it('rejects oversized keywords', () => {
    const keyword = 'x'.repeat(MAX_FAVORITE_KEYWORD_LENGTH + 1);
    expect(validateFavoriteInput({ systemId: 'pf2e-srd', keyword }).ok).toBe(false);
  });

  it('collapses internal whitespace', () => {
    expect(normalizeFavoriteKeyword('hero   point')).toBe('hero point');
  });
});
