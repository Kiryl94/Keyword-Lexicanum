'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa/register';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    void registerServiceWorker();
  }, []);

  return null;
}
