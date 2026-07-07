import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InstallAppButton } from '@/components/InstallAppButton';

describe('InstallAppButton', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the install button when the app is not already installed', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14)',
    });

    render(<InstallAppButton />);

    expect(
      screen.getByRole('button', { name: 'Add to Home Screen' }),
    ).toBeInTheDocument();
  });

  it('shows iOS install instructions when tapped without a deferred prompt', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });

    render(<InstallAppButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Home Screen' }));

    expect(screen.getByText('Tap Share, then choose “Add to Home Screen”.')).toBeInTheDocument();
  });
});
