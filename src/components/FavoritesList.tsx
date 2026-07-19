'use client';

import { useFavoritesContext } from '@/components/FavoritesProvider';

type FavoritesListProps = {
  onSelect: (keyword: string) => void;
};

export function FavoritesList({ onSelect }: FavoritesListProps) {
  const { configured, user, ready, favorites, loading, error, removeFavorite } =
    useFavoritesContext();

  if (!configured || !ready || !user) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2" aria-label="Synced favorites">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-[#a0a0b0]">Favorites</h2>
        {loading && (
          <span className="text-xs text-[#6b6b80]" aria-live="polite">
            Loading…
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#e0c0c8]" role="alert">
          {error}
        </p>
      )}

      {favorites.length === 0 && !loading ? (
        <p className="text-xs text-[#8a8aa0]">
          Star a lookup result to sync it here across devices.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {favorites.map((favorite) => (
            <li key={favorite.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelect(favorite.keyword)}
                className="min-w-0 flex-1 truncate rounded-lg border border-[#2a2a40] bg-[#151525] px-3 py-2 text-left text-sm text-[#f5f5f5] hover:border-[#3a3a55]"
              >
                {favorite.keyword}
              </button>
              <button
                type="button"
                aria-label={`Remove ${favorite.keyword} from favorites`}
                onClick={() => {
                  void removeFavorite(favorite.id);
                }}
                className="shrink-0 rounded border border-[#2a2a40] px-2 py-1 text-xs text-[#8a8aa0] hover:border-[#5a3040] hover:text-[#e0c0c8]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
