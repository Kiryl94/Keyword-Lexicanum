'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LookupPanel } from '@/components/LookupPanel';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export default function LookupPage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      router.replace('/');
    }
  }, [isDesktop, router]);

  if (isDesktop) {
    return null;
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-3 p-5">
      <LookupPanel />
    </main>
  );
}
