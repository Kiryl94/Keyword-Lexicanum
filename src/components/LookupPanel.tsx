'use client';

import { useEffect, useMemo, useState } from 'react';
import { KeywordSuggestionList } from '@/components/KeywordSuggestionList';
import { LookupResultCard } from '@/components/LookupResultCard';
import { RecentLookupList } from '@/components/RecentLookupList';
import { getKeywordSuggestions, lookupKeyword } from '@/lib/lookup';
import type { GameSystemId } from '@/store/session';
import { useSessionStore } from '@/store/session';

export function LookupPanel() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const recentLookupsBySystem = useSessionStore((s) => s.recentLookupsBySystem);
  const recordSuccessfulLookup = useSessionStore((s) => s.recordSuccessfulLookup);
  const getCachedLookup = useSessionStore((s) => s.getCachedLookup);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupKeyword>> | null>(
    null,
  );
  const [resultSystemId, setResultSystemId] = useState<GameSystemId | null>(null);

  useEffect(() => {
    setQuery('');
    setLoading(false);
    setResult(null);
    setResultSystemId(null);
  }, [activeSystemId]);

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

  async function onSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed || !activeSystem) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await lookupKeyword(trimmed, activeSystem.id);
      setResult(response);
      setResultSystemId(activeSystem.id);
      if (response.found) {
        recordSuccessfulLookup(activeSystem.id, response);
      }
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
    const cached = getCachedLookup(activeSystem.id, keyword);
    if (cached) {
      setResult(cached);
      setResultSystemId(activeSystem.id);
      return;
    }

    onSearch(keyword);
  }

  if (!activeSystem) {
    return (
      <div className="text-[#a0a0b0]">
        Select a game system to start looking up keywords.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="sr-only">Keyword lookup</h1>
      <input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && canSearch && onSearch(query)}
        placeholder="Enter a keyword (e.g. Advantage, Engagement)"
        className="rounded-lg border border-[#2a2a40] bg-[#1a1a2e] px-4 py-3 text-[#f5f5f5] placeholder:text-[#6b6b80] focus:border-[#e94560] focus:outline-none"
      />
      <KeywordSuggestionList
        suggestions={suggestions}
        onSelect={onSuggestionSelect}
      />
      <button
        type="button"
        disabled={!canSearch}
        onClick={() => onSearch(query)}
        className="rounded-lg bg-[#e94560] px-4 py-3 font-semibold text-white hover:bg-[#d63d56] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#e94560] data-[loading=true]:animate-pulse"
        data-loading={loading}
      >
        {loading ? 'Searching…' : 'Look up'}
      </button>

      {loading && (
        <p className="text-sm text-[#8a8aa0]" aria-live="polite">
          Looking up keyword…
        </p>
      )}

      {visibleResult && (
        <LookupResultCard result={visibleResult} systemLabel={activeSystem.label} />
      )}

      <RecentLookupList items={recentLookups} onSelect={onRecentSelect} />
    </div>
  );
}
