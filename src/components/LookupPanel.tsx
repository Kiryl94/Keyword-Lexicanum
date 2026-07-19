'use client';

import { useMemo, useState } from 'react';
import { FavoritesList } from '@/components/FavoritesList';
import { FavoritesProvider } from '@/components/FavoritesProvider';
import { KeywordSuggestionList } from '@/components/KeywordSuggestionList';
import { LookupResultCard } from '@/components/LookupResultCard';
import { PhaseBrowseSection } from '@/components/PhaseBrowseSection';
import { RecentLookupList } from '@/components/RecentLookupList';
import { getKeywordSuggestions, lookupKeyword } from '@/lib/lookup';
import type { GameSystemId } from '@/store/session';
import { useSessionStore } from '@/store/session';

const SEARCH_INPUT_CLASS =
  'min-h-[48px] rounded-lg border border-[#2a2a40] bg-[#1a1a2e] px-4 py-3 text-base text-[#f5f5f5] placeholder:text-[#6b6b80] focus:border-[#e94560] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]';

export function LookupPanel() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const recentLookupsBySystem = useSessionStore((s) => s.recentLookupsBySystem);
  const recordSuccessfulLookup = useSessionStore((s) => s.recordSuccessfulLookup);
  const getCachedLookup = useSessionStore((s) => s.getCachedLookup);
  const clearRecentLookups = useSessionStore((s) => s.clearRecentLookups);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupKeyword>> | null>(
    null,
  );
  const [resultSystemId, setResultSystemId] = useState<GameSystemId | null>(null);

  const canSearch = query.trim().length > 0 && !loading;
  const visibleResult =
    result && resultSystemId === activeSystem?.id ? result : null;

  const recentLookups = useMemo(() => {
    if (!activeSystemId) return [];
    return recentLookupsBySystem[activeSystemId] ?? [];
  }, [activeSystemId, recentLookupsBySystem]);

  const suggestions = useMemo(() => {
    if (!activeSystem || query.trim().length < 1 || loading) {
      return [];
    }
    return getKeywordSuggestions(query, activeSystem.id);
  }, [activeSystem, query, loading]);

  const showWelcomeHint =
    !loading && !error && !visibleResult && query.trim().length === 0;

  async function onSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed || !activeSystem) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await lookupKeyword(trimmed, activeSystem.id);
      setResult(response);
      setResultSystemId(activeSystem.id);
      if (response.found) {
        recordSuccessfulLookup(activeSystem.id, response);
      }
    } catch {
      setError('Something went wrong loading that keyword. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function onSuggestionSelect(keyword: string) {
    setQuery(keyword);
    onSearch(keyword);
  }

  function onRecentSelect(keyword: string) {
    if (!activeSystem) return;

    setQuery(keyword);
    setError(null);
    const cached = getCachedLookup(activeSystem.id, keyword);
    if (cached) {
      setResult(cached);
      setResultSystemId(activeSystem.id);
      return;
    }

    onSearch(keyword);
  }

  function onClearRecents() {
    if (!activeSystemId) return;
    clearRecentLookups(activeSystemId);
  }

  if (!activeSystem) {
    return (
      <div className="rounded-xl border border-[#2a2a40] bg-[#151525] p-4 text-[#a0a0b0]">
        Select a game system above to start looking up keywords.
      </div>
    );
  }

  return (
    <FavoritesProvider systemId={activeSystem.id}>
      <div className="flex flex-col gap-3">
        <h1 className="sr-only">Keyword lookup</h1>
        <input
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          inputMode="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && canSearch && onSearch(query)}
          placeholder="Enter a keyword (e.g. Advantage, Lance)"
          className={SEARCH_INPUT_CLASS}
        />
        <KeywordSuggestionList
          suggestions={suggestions}
          onSelect={onSuggestionSelect}
        />

        {showWelcomeHint && (
          <p className="text-sm leading-relaxed text-[#8a8aa0]">
            Type a keyword or tap a suggestion to look it up. Use{' '}
            <span className="text-[#a0a0b0]">Browse by phase</span> below to explore terms
            for the current game phase.
          </p>
        )}

        {loading && (
          <p className="text-sm text-[#8a8aa0]" aria-live="polite">
            Looking up keyword…
          </p>
        )}

        {error && (
          <div
            className="rounded-xl border border-[#5a3040] bg-[#1a1520] p-4 text-sm text-[#e0c0c8]"
            role="alert"
          >
            {error}
          </div>
        )}

        {visibleResult && (
          <LookupResultCard
            result={visibleResult}
            systemLabel={activeSystem.label}
            systemId={activeSystem.id}
          />
        )}

        <FavoritesList onSelect={onRecentSelect} />

        <RecentLookupList
          items={recentLookups}
          onSelect={onRecentSelect}
          onClear={onClearRecents}
        />

        <PhaseBrowseSection
          systemId={activeSystem.id}
          onKeywordSelect={onSuggestionSelect}
        />
      </div>
    </FavoritesProvider>
  );
}
