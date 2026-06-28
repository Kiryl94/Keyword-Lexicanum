'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'System' },
  { href: '/lookup', label: 'Lookup' },
  { href: '/phases', label: 'Phases' },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#2a2a40] bg-[#16213e]">
      <div className="mx-auto flex max-w-2xl items-center gap-1 px-4 py-2">
        <span className="mr-4 text-sm font-semibold text-[#f5f5f5]">Keyword Lexicanum</span>
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#1a1a2e] text-[#e94560]'
                  : 'text-[#a0a0b0] hover:text-[#f5f5f5]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
