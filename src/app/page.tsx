'use client';

import { LookupPanel } from '@/components/LookupPanel';
import { SystemPicker } from '@/components/SystemPicker';
import { VerticalGameSystemLabel } from '@/components/VerticalGameSystemLabel';
import { useSessionStore } from '@/store/session';

function KeyedLookupPanel() {
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  return <LookupPanel key={activeSystemId ?? 'none'} />;
}

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl md:max-w-none md:p-0">
      {/* Mobile: icon picker at top + lookup below (merged, no tabs) */}
      <div className="flex min-h-[calc(100dvh-3rem)] flex-col md:hidden">
        <header className="border-b border-[#2a2a40] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <SystemPicker variant="icons" />
        </header>
        <section className="flex-1 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <KeyedLookupPanel />
        </section>
      </div>

      {/* Desktop: vertical label + compact picker left, lookup right */}
      <div className="hidden md:flex md:min-h-[calc(100dvh-3rem)] md:w-full">
        <aside className="flex shrink-0 flex-row items-start gap-2 pl-2 pt-2">
          <VerticalGameSystemLabel />
          <SystemPicker variant="compact" />
        </aside>
        <section className="min-w-0 flex-1 px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <KeyedLookupPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
