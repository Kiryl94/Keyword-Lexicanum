import { afterEach, describe, expect, it, vi } from 'vitest';
import { canRegisterServiceWorker, registerServiceWorker } from '@/lib/pwa/register';

describe('registerServiceWorker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when service workers are unavailable', async () => {
    expect(canRegisterServiceWorker()).toBe(false);
    await expect(registerServiceWorker()).resolves.toBeNull();
  });

  it('registers the service worker at the app root scope', async () => {
    const register = vi.fn().mockResolvedValue({ scope: 'http://localhost/' });
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { serviceWorker: { register } });

    expect(canRegisterServiceWorker()).toBe(true);
    await expect(registerServiceWorker()).resolves.toEqual({ scope: 'http://localhost/' });
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  it('returns null when registration throws', async () => {
    const register = vi.fn().mockRejectedValue(new Error('blocked'));
    vi.stubGlobal('navigator', { serviceWorker: { register } });

    await expect(registerServiceWorker()).resolves.toBeNull();
  });
});
