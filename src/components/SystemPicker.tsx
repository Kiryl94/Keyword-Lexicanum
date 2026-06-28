'use client';

import { GAME_SYSTEMS, type GameSystemId, useSessionStore } from '@/store/session';

type SystemPickerProps = {
  onSelect?: (id: GameSystemId) => void;
  compact?: boolean;
};

export function SystemPicker({ onSelect, compact = false }: SystemPickerProps) {
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const setActiveSystem = useSessionStore((s) => s.setActiveSystem);

  function handleSelect(id: GameSystemId) {
    setActiveSystem(id);
    onSelect?.(id);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Active game system"
      className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}
    >
      {!compact && (
        <>
          <p className="text-[#a0a0b0]">Select your active game system</p>
          <p className="text-sm text-[#6b6b80]">Your choice is saved locally in this browser.</p>
        </>
      )}
      {GAME_SYSTEMS.map((system) => {
        const selected = activeSystemId === system.id;
        return (
          <button
            key={system.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => handleSelect(system.id)}
            className={`min-h-[48px] rounded-xl border px-4 py-3 text-left transition-colors ${
              selected
                ? 'border-[#e94560] bg-[#1a1a2e]'
                : 'border-[#2a2a40] bg-[#1a1a2e] hover:border-[#3a3a55]'
            }`}
          >
            <div className={`font-semibold text-[#f5f5f5] ${compact ? 'text-sm' : ''}`}>
              {system.label}
            </div>
            {!compact && (
              <div className="text-sm text-[#a0a0b0]">{system.description}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
