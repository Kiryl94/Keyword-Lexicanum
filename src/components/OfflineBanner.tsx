'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="border-b border-[#3a3040] bg-[#1a1520] px-4 py-2 text-center text-sm text-[#d0c0c8]"
      role="status"
      aria-live="polite"
    >
      Offline — cached rules still work for your last-loaded session.
    </div>
  );
}
