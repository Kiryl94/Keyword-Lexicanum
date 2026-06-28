'use client';

import { useState } from 'react';
import { getKeywordsForPhase } from '@/lib/lookup';
import { useSessionStore } from '@/store/session';

export default function PhasesPage() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const [phaseQuery, setPhaseQuery] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  function onBrowse() {
    if (!activeSystem || !phaseQuery.trim()) return;
    setKeywords(getKeywordsForPhase(phaseQuery, activeSystem.id));
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
      <h1 className="text-lg font-semibold text-[#f5f5f5]">Browse by phase</h1>
      <p className="text-sm text-[#a0a0b0]">
        Find keywords relevant to a game phase (e.g. Engagement).
      </p>
      <input
        value={phaseQuery}
        onChange={(e) => setPhaseQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onBrowse()}
        placeholder="Phase name"
        className="rounded-lg border border-[#2a2a40] bg-[#1a1a2e] px-4 py-3 text-[#f5f5f5] placeholder:text-[#6b6b80] focus:border-[#e94560] focus:outline-none"
      />
      <button
        type="button"
        onClick={onBrowse}
        className="rounded-lg bg-[#e94560] px-4 py-3 font-semibold text-white hover:bg-[#d63d56]"
      >
        Browse keywords
      </button>
      {keywords.length > 0 ? (
        <ul className="flex flex-col gap-2 rounded-xl bg-[#1a1a2e] p-4">
          {keywords.map((kw) => (
            <li key={kw} className="text-[#f5f5f5]">
              {kw}
            </li>
          ))}
        </ul>
      ) : (
        phaseQuery.trim() && (
          <p className="text-sm text-[#a0a0b0]">No keywords matched that phase in the sample corpus.</p>
        )
      )}
    </main>
  );
}
