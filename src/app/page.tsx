'use client';

import { GAME_SYSTEMS, useSessionStore } from '@/store/session';

export default function SystemPage() {
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const setActiveSystem = useSessionStore((s) => s.setActiveSystem);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-3 p-5">
      <h1 className="text-2xl font-bold text-[#f5f5f5]">Keyword Lexicanum</h1>
      <p className="mb-2 text-[#a0a0b0]">Select your active game system</p>
      {GAME_SYSTEMS.map((system) => {
        const selected = activeSystemId === system.id;
        return (
          <button
            key={system.id}
            type="button"
            onClick={() => setActiveSystem(system.id)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              selected
                ? 'border-[#e94560] bg-[#1a1a2e]'
                : 'border-[#2a2a40] bg-[#1a1a2e] hover:border-[#3a3a55]'
            }`}
          >
            <div className="font-semibold text-[#f5f5f5]">{system.label}</div>
            <div className="text-sm text-[#a0a0b0]">{system.description}</div>
          </button>
        );
      })}
      <p className="mt-4 text-xs text-[#6b6b80]">
        Web MVP — responsive for phone browsers at the table. Native app deferred.
      </p>
    </main>
  );
}
