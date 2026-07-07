'use client';

import { SystemIcon } from '@/components/SystemIcon';
import {
  GAME_SYSTEM_CATEGORIES,
  GAME_SYSTEMS,
  type GameSystemCategory,
  type GameSystemId,
  useSessionStore,
} from '@/store/session';

type SystemPickerProps = {
  onSelect?: (id: GameSystemId) => void;
  variant?: 'full' | 'compact' | 'icons';
  className?: string;
};

function systemsInCategory(category: GameSystemCategory) {
  return GAME_SYSTEMS.filter((system) => system.category === category);
}

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
        className={`flex flex-row items-center justify-center gap-4 ${className}`}
      >
        {GAME_SYSTEM_CATEGORIES.map((group, groupIndex) => {
          const systems = systemsInCategory(group.category);
          if (systems.length === 0) return null;
          return (
            <div
              key={group.category}
              role="group"
              aria-label={`${group.label} — ${group.hint}`}
              className={`flex flex-col items-center gap-1 ${
                groupIndex > 0 ? 'border-l border-[#2a2a40] pl-4' : ''
              }`}
            >
              <div className="flex flex-row items-center gap-3">
                {systems.map((system) => {
                  const selected = activeSystemId === system.id;
                  const disabled = !system.available;
                  return (
                    <button
                      key={system.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-disabled={disabled}
                      aria-label={system.label}
                      title={
                        disabled
                          ? `${system.label} — coming soon`
                          : `${system.label} (${group.label})`
                      }
                      disabled={disabled}
                      onClick={() => handleSelect(system.id)}
                      className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${
                        disabled
                          ? 'cursor-not-allowed border-[#2a2a40] bg-[#151525] text-[#4a4a60] opacity-60'
                          : selected
                            ? 'border-[#e94560] bg-[#1a1a2e] text-[#e94560]'
                            : 'border-[#2a2a40] bg-[#1a1a2e] text-[#a0a0b0] hover:border-[#3a3a55] hover:text-[#f5f5f5]'
                      }`}
                    >
                      <SystemIcon systemId={system.id} className="h-8 w-8" />
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6b80]">
                {group.label}
              </span>
            </div>
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
      className={`${compact ? 'flex flex-col gap-3' : 'flex flex-col gap-4'} ${className}`}
    >
      {!compact && (
        <>
          <p className="text-[#a0a0b0]">Select your active game system</p>
          <p className="text-sm text-[#6b6b80]">Your choice is saved locally in this browser.</p>
        </>
      )}
      {GAME_SYSTEM_CATEGORIES.map((group) => {
        const systems = systemsInCategory(group.category);
        if (systems.length === 0) return null;
        return (
          <div
            key={group.category}
            role="group"
            aria-label={`${group.label} — ${group.hint}`}
            className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#e94560]">
                {group.label}
              </span>
              {!compact && (
                <span className="text-xs text-[#6b6b80]">{group.hint}</span>
              )}
            </div>
            {systems.map((system) => {
              const selected = activeSystemId === system.id;
              const disabled = !system.available;
              return (
                <button
                  key={system.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={disabled}
                  disabled={disabled}
                  onClick={() => handleSelect(system.id)}
                  className={`min-h-[48px] rounded-xl border px-4 py-3 text-left transition-colors ${
                    disabled
                      ? 'cursor-not-allowed border-[#2a2a40] bg-[#151525] opacity-60'
                      : selected
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
                      {disabled && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6b80]">
                          Soon
                        </span>
                      )}
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
      })}
    </div>
  );
}
