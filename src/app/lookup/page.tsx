'use client';

import { useState } from 'react';
import { lookupKeyword } from '@/lib/lookup';
import { LookupResultCard } from '@/components/LookupResultCard';
import type { GameSystemId } from '@/store/session';
import { useSessionStore } from '@/store/session';

export default function LookupPage() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const recentLookups = useSessionStore((s) => s.recentLookups);
  const addRecentLookup = useSessionStore((s) => s.addRecentLookup);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupKeyword>> | null>(
    null,
  );
  const [resultSystemId, setResultSystemId] = useState<GameSystemId | null>(null);

  const canSearch = query.trim().length > 0 && !loading;
  const visibleResult =
    result && resultSystemId === activeSystem?.id ? result : null;

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
        addRecentLookup(trimmed);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!activeSystem) {
    return (
      <main className="p-5 text-[#a0a0b0]">
        Select a game system on the System tab first.
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-3 p-5">
      <h1 className="text-lg font-semibold text-[#f5f5f5]">{activeSystem.label}</h1>
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

      {recentLookups.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          <p className="font-semibold text-[#a0a0b0]">Recent lookups</p>
          {recentLookups.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                onSearch(item);
              }}
              className="py-1 text-left text-[#e94560] hover:underline"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
