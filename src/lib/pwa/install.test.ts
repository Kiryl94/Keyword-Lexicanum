import { describe, expect, it, vi } from 'vitest';
import {
  canShowInstallButton,
  isIosInstallBrowser,
  isStandaloneDisplay,
} from '@/lib/pwa/install';

describe('PWA install helpers', () => {
  it('detects standalone display mode', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: true }),
    });
    vi.stubGlobal('navigator', {});

    expect(isStandaloneDisplay()).toBe(true);
    expect(canShowInstallButton()).toBe(false);

    vi.unstubAllGlobals();
  });

  it('detects iOS Safari install browsers', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });

    expect(isIosInstallBrowser()).toBe(true);
    expect(canShowInstallButton()).toBe(true);

    vi.unstubAllGlobals();
  });

  it('hides install affordance when already running standalone', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: true }),
    });
    vi.stubGlobal('navigator', {});

    expect(canShowInstallButton()).toBe(false);

    vi.unstubAllGlobals();
  });
});
