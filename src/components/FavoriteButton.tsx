'use client';

import { useMemo, useState } from 'react';
import { useFavoritesContext } from '@/components/FavoritesProvider';
import type { GameSystemId } from '@/store/session';

type FavoriteButtonProps = {
  systemId: GameSystemId;
  keyword: string;
};

export function FavoriteButton({ systemId, keyword }: FavoriteButtonProps) {
  const { configured, user, ready, favorites, addFavorite, removeFavorite } =
    useFavoritesContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existing = useMemo(
    () =>
      favorites.find(
        (f) =>
          f.system_id === systemId &&
          f.keyword.toLowerCase() === keyword.trim().toLowerCase(),
      ),
    [favorites, systemId, keyword],
  );

  if (!configured || !ready) {
    return null;
  }

  if (!user) {
    return <p className="text-xs text-[#8a8aa0]">Sign in to sync favorites</p>;
  }

  async function onToggle() {
    setBusy(true);
    setError(null);
    try {
      if (existing) {
        await removeFavorite(existing.id);
      } else {
        await addFavorite(keyword);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update favorite');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        aria-pressed={Boolean(existing)}
        className="self-start rounded-lg border border-[#2a2a40] bg-[#151525] px-3 py-1.5 text-sm text-[#a0a0b0] hover:border-[#e94560] hover:text-[#f5f5f5] disabled:opacity-50"
      >
        {existing ? '★ Favorited' : '☆ Favorite'}
      </button>
      {error && (
        <p className="text-xs text-[#e0c0c8]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
