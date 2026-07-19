'use client';

import { useEffect, useState } from 'react';
import {
  type BeforeInstallPromptEvent,
  canShowInstallButton,
  isIosInstallBrowser,
} from '@/lib/pwa/install';

export function InstallAppButton() {
  const [visible] = useState(() =>
    typeof window !== 'undefined' ? canShowInstallButton() : false,
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, [visible]);

  if (!visible) return null;

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowHint(false);
      return;
    }

    setShowHint(true);
  }

  const hint = deferredPrompt
    ? null
    : isIosInstallBrowser()
      ? 'Tap Share, then choose “Add to Home Screen”.'
      : 'Open your browser menu and choose “Install app” or “Add to Home Screen”.';

  return (
    <div className="flex flex-col items-center gap-2 border-t border-[#2a2a40] pt-4">
      <button
        type="button"
        onClick={() => void handleInstall()}
        className="min-h-[48px] w-full max-w-md rounded-lg border border-[#3a3a55] bg-[#1a1a2e] px-4 py-3 text-sm font-medium text-[#f5f5f5] transition-colors hover:border-[#e94560] hover:text-[#e94560] focus:border-[#e94560] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
      >
        Add to Home Screen
      </button>
      {showHint && hint ? (
        <p className="max-w-md text-center text-sm leading-relaxed text-[#8a8aa0]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
