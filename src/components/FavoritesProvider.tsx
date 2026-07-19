'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import type { FavoriteRow } from '@/lib/favorites';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { GameSystemId } from '@/store/session';

type FavoritesContextValue = {
  configured: boolean;
  user: User | null;
  ready: boolean;
  favorites: FavoriteRow[];
  loading: boolean;
  error: string | null;
  addFavorite: (keyword: string) => Promise<FavoriteRow | null>;
  removeFavorite: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({
  systemId,
  children,
}: {
  systemId: GameSystemId;
  children: ReactNode;
}) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (!ready) return;

    if (!configured || !user) {
      queueMicrotask(() => {
        setFavorites([]);
        setLoading(false);
        setError(null);
      });
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `/api/favorites?systemId=${encodeURIComponent(systemId)}`,
          );
          if (cancelled) return;
          if (response.status === 401) {
            setFavorites([]);
            return;
          }
          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as {
              error?: string;
            } | null;
            throw new Error(body?.error ?? 'Failed to load favorites');
          }
          const body = (await response.json()) as { favorites: FavoriteRow[] };
          if (!cancelled) {
            setFavorites(body.favorites);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to load favorites');
            setFavorites([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [ready, configured, user, systemId]);

  const addFavorite = useCallback(
    async (keyword: string) => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemId, keyword }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Failed to save favorite');
      }
      const body = (await response.json()) as { favorite: FavoriteRow };
      setFavorites((prev) => {
        const withoutDup = prev.filter(
          (f) =>
            !(
              f.system_id === body.favorite.system_id &&
              f.keyword.toLowerCase() === body.favorite.keyword.toLowerCase()
            ),
        );
        return [body.favorite, ...withoutDup];
      });
      return body.favorite;
    },
    [systemId],
  );

  const removeFavorite = useCallback(async (id: string) => {
    const response = await fetch(`/api/favorites/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? 'Failed to remove favorite');
    }
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      configured,
      user,
      ready,
      favorites,
      loading,
      error,
      addFavorite,
      removeFavorite,
    }),
    [
      configured,
      user,
      ready,
      favorites,
      loading,
      error,
      addFavorite,
      removeFavorite,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return ctx;
}
