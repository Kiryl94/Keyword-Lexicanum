'use client';

import { useMemo, useState } from 'react';
import { KeywordSuggestionList } from '@/components/KeywordSuggestionList';
import { getKeywordsForPhase, getPhasesForSystem } from '@/lib/lookup';
import type { GameSystemId } from '@/store/session';

type PhaseBrowseSectionProps = {
  systemId: GameSystemId;
  onKeywordSelect: (keyword: string) => void;
};

export function PhaseBrowseSection({ systemId, onKeywordSelect }: PhaseBrowseSectionProps) {
  const [phaseQuery, setPhaseQuery] = useState('');

  const phases = useMemo(() => getPhasesForSystem(systemId), [systemId]);

  const keywords = useMemo(() => {
    if (phaseQuery.trim().length < 1) {
      return [];
    }
    return getKeywordsForPhase(phaseQuery, systemId);
  }, [phaseQuery, systemId]);

  return (
    <section className="mt-4 flex flex-col gap-2 border-t border-[#2a2a40] pt-4">
      <h2 className="font-semibold text-[#f5f5f5]">Browse by phase</h2>
      <p className="text-sm text-[#6b6b80]">
        Enter or pick a phase to see related keywords for this system.
      </p>
      <input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={phaseQuery}
        onChange={(e) => setPhaseQuery(e.target.value)}
        placeholder="e.g. Engagement, Combat"
        className="rounded-lg border border-[#2a2a40] bg-[#1a1a2e] px-4 py-3 text-[#f5f5f5] placeholder:text-[#6b6b80] focus:border-[#e94560] focus:outline-none"
      />
      {phases.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Known phases for this system">
          {phases.map((phase) => {
            const selected = phaseQuery === phase;
            return (
              <li key={phase}>
                <button
                  type="button"
                  onClick={() => setPhaseQuery(phase)}
                  aria-pressed={selected}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? 'border-[#e94560] bg-[#1a1a2e] text-[#e94560]'
                      : 'border-[#2a2a40] bg-[#1a1a2e] text-[#a0a0b0] hover:border-[#3a3a55] hover:text-[#f5f5f5]'
                  }`}
                >
                  {phase}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {phaseQuery.trim().length >= 1 && keywords.length === 0 && (
        <p className="text-sm text-[#8a8aa0]">No keywords found for this phase.</p>
      )}
      <KeywordSuggestionList
        suggestions={keywords}
        onSelect={onKeywordSelect}
        ariaLabel="Keywords for selected phase"
      />
    </section>
  );
}
