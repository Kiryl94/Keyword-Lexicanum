'use client';

import { useRouter } from 'next/navigation';
import { LookupPanel } from '@/components/LookupPanel';
import { SystemPicker } from '@/components/SystemPicker';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-5xl p-5 md:max-w-none md:p-0">
      {/* Mobile: system picker only; selecting redirects to Lookup */}
      <div className="md:hidden">
        <h1 className="mb-2 text-2xl font-bold text-[#f5f5f5]">Keyword Lexicanum</h1>
        <SystemPicker onSelect={() => router.push('/lookup')} />
        <p className="mt-6 text-xs text-[#6b6b80]">
          Web MVP — responsive for phone browsers at the table. Native app deferred.
        </p>
      </div>

      {/* Desktop: system picker flush left + lookup fills remainder */}
      <div className="hidden md:flex md:min-h-[calc(100dvh-3rem)] md:w-full">
        <aside className="flex shrink-0 flex-row items-start gap-2 pl-2 pt-2">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a0a0b0] [writing-mode:vertical-lr]"
            aria-hidden="true"
          >
            Game System
          </h2>
          <SystemPicker compact />
        </aside>
        <section className="min-w-0 flex-1 px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <LookupPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
