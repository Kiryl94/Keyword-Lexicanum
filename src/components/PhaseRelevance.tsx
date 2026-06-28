import type { LookupHit } from '@/lib/lookup';

type PhaseRelevanceProps = {
  phase: string;
  phaseApplicability: LookupHit['phaseApplicability'];
};

export function PhaseRelevance({ phase, phaseApplicability }: PhaseRelevanceProps) {
  if (phaseApplicability === 'restricted') {
    return (
      <div
        className="rounded-lg border border-[#e94560]/40 bg-[#e94560]/10 px-3 py-2"
        role="note"
      >
        <p className="text-sm font-semibold text-[#e94560]">Only during: {phase}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#a0a0b0]">
          Outside {phase}, this keyword does not affect play — you can ignore it.
        </p>
      </div>
    );
  }

  if (phase === 'General') {
    return (
      <div
        className="rounded-lg border border-[#2a2a40] bg-[#151525] px-3 py-2"
        role="note"
      >
        <p className="text-sm font-semibold text-[#f5f5f5]">Applies throughout play</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#6b6b80]">
          Not tied to a single game phase.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-[#2a2a40] bg-[#151525] px-3 py-2"
      role="note"
    >
      <p className="text-sm text-[#d0d0e0]">
        <span className="font-semibold text-[#f5f5f5]">Primary context:</span> {phase}
      </p>
      <p className="mt-0.5 text-xs leading-relaxed text-[#6b6b80]">
        Can still matter outside {phase} depending on the situation.
      </p>
    </div>
  );
}
