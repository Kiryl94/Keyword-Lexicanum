import { isValidGameSystemId, type GameSystemId } from '@/store/session';

export const MAX_FAVORITE_KEYWORD_LENGTH = 120;

export type FavoriteRow = {
  id: string;
  system_id: GameSystemId;
  keyword: string;
  created_at: string;
};

export type FavoriteInput = {
  systemId: string;
  keyword: string;
};

export type FavoriteValidationResult =
  | { ok: true; systemId: GameSystemId; keyword: string }
  | { ok: false; error: string };

export type SystemIdValidationResult =
  | { ok: true; systemId: GameSystemId }
  | { ok: false; error: string };

export function normalizeFavoriteKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, ' ');
}

export function validateSystemId(systemId: string): SystemIdValidationResult {
  if (!isValidGameSystemId(systemId)) {
    return { ok: false, error: 'Invalid game system' };
  }
  return { ok: true, systemId };
}

export function validateFavoriteInput(input: FavoriteInput): FavoriteValidationResult {
  const system = validateSystemId(input.systemId);
  if (!system.ok) {
    return system;
  }

  const keyword = normalizeFavoriteKeyword(input.keyword);
  if (!keyword) {
    return { ok: false, error: 'Keyword is required' };
  }
  if (keyword.length > MAX_FAVORITE_KEYWORD_LENGTH) {
    return { ok: false, error: `Keyword must be at most ${MAX_FAVORITE_KEYWORD_LENGTH} characters` };
  }

  return { ok: true, systemId: system.systemId, keyword };
}
