import { SERVICE_WORKER_PATH } from '@/lib/pwa/config';

export function canRegisterServiceWorker(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!canRegisterServiceWorker()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: '/' });
  } catch {
    return null;
  }
}
