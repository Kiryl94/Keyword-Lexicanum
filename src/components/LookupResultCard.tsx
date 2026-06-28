'use client';

import { useState } from 'react';
import { PhaseRelevance } from '@/components/PhaseRelevance';
import type { LookupResult } from '@/lib/lookup';

type LookupResultCardProps = {
  result: LookupResult;
  systemLabel: string;
};

export function LookupResultCard({ result, systemLabel }: LookupResultCardProps) {
  const [citationExpanded, setCitationExpanded] = useState(false);

  if (!result.found) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-[#3a3a55] bg-[#151525] p-4">
        <h2 className="text-lg font-semibold text-[#a0a0b0]">Not found</h2>
        <p className="leading-relaxed text-[#d0d0e0]">
          &ldquo;{result.query}&rdquo; is not in the loaded rules for {systemLabel}. Check
          spelling or try another term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[#1a1a2e] p-4">
      <h2 className="text-lg font-bold text-[#f5f5f5]">{result.keyword}</h2>
      <PhaseRelevance
        phase={result.phase}
        phaseApplicability={result.phaseApplicability}
      />
      <p className="leading-relaxed text-[#d0d0e0]">{result.explanation}</p>
      <button
        type="button"
        aria-expanded={citationExpanded}
        onClick={() => setCitationExpanded((open) => !open)}
        className="mt-1 flex w-full items-center justify-between gap-2 rounded-lg border border-[#2a2a40] bg-[#151525] px-3 py-2 text-left text-sm text-[#8a8aa0] hover:border-[#3a3a55] hover:text-[#a0a0b0]"
      >
        <span className="font-medium text-[#a0a0b0]">Source</span>
        <span className="shrink-0 text-xs">
          {citationExpanded ? '▲ Hide source' : '▼ Show source'}
        </span>
      </button>
      {citationExpanded && (
        <p className="text-xs leading-relaxed text-[#8a8aa0]">{result.citation}</p>
      )}
    </div>
  );
}
