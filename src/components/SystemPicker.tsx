'use client';

import { SystemIcon } from '@/components/SystemIcon';
import { GAME_SYSTEMS, type GameSystemId, useSessionStore } from '@/store/session';

type SystemPickerProps = {
  onSelect?: (id: GameSystemId) => void;
  variant?: 'full' | 'compact' | 'icons';
  className?: string;
};

export function SystemPicker({
  onSelect,
  variant = 'full',
  className = '',
}: SystemPickerProps) {
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const setActiveSystem = useSessionStore((s) => s.setActiveSystem);

  function handleSelect(id: GameSystemId) {
    setActiveSystem(id);
    onSelect?.(id);
  }

  if (variant === 'icons') {
    return (
      <div
        role="radiogroup"
        aria-label="Active game system"
        className={`flex flex-row items-center justify-center gap-3 ${className}`}
      >
        {GAME_SYSTEMS.map((system) => {
          const selected = activeSystemId === system.id;
          return (
            <button
              key={system.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={system.label}
              title={system.label}
              onClick={() => handleSelect(system.id)}
              className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${
                selected
                  ? 'border-[#e94560] bg-[#1a1a2e] text-[#e94560]'
                  : 'border-[#2a2a40] bg-[#1a1a2e] text-[#a0a0b0] hover:border-[#3a3a55] hover:text-[#f5f5f5]'
              }`}
            >
              <SystemIcon systemId={system.id} className="h-8 w-8" />
            </button>
          );
        })}
      </div>
    );
  }

  const compact = variant === 'compact';

  return (
    <div
      role="radiogroup"
      aria-label="Active game system"
      className={`${compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'} ${className}`}
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
            <div className={`flex items-center gap-2.5 ${compact ? '' : 'mb-0.5'}`}>
              <SystemIcon
                systemId={system.id}
                className={compact ? 'h-6 w-6' : 'h-8 w-8'}
              />
              <div className={`font-semibold text-[#f5f5f5] ${compact ? 'text-sm' : ''}`}>
                {system.label}
              </div>
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
