import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LookupResultCard } from '@/components/LookupResultCard';
import type { LookupHit } from '@/lib/lookup';

const TABLE_SIDE_MAX_CHARS = 400;

const sampleHit: LookupHit = {
  found: true,
  keyword: 'Advantage',
  explanation: 'Roll two d20s and use the higher result on the roll.',
  phase: 'General',
  phaseApplicability: 'general',
  citation: 'SRD — Advantage',
  source: {
    documentTitle: 'D&D System Reference Document 5.2.1',
    documentUrl: 'https://www.dndbeyond.com/sources/dnd/free-rules',
    section: 'Advantage',
  },
  corpusVersion: '5.2.1-lookup-v1',
};

describe('LookupResultCard', () => {
  it('shows keyword and explanation without debug-like values', () => {
    render(<LookupResultCard result={sampleHit} systemLabel="D&D 5e (SRD)" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Advantage' })).toBeInTheDocument();
    expect(screen.getByText(sampleHit.explanation)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/undefined|null|\[object Object\]/i);
  });

  it('keeps citation collapsed by default for minimal table-side view', () => {
    render(<LookupResultCard result={sampleHit} systemLabel="D&D 5e (SRD)" />);

    expect(screen.getByRole('button', { name: /source & page link/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText(/open the linked pdf/i)).not.toBeInTheDocument();
  });

  it('reveals citation only after the user expands the source control', () => {
    render(<LookupResultCard result={sampleHit} systemLabel="D&D 5e (SRD)" />);

    fireEvent.click(screen.getByRole('button', { name: /source & page link/i }));

    expect(screen.getByRole('button', { name: /source & page link/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/open the linked pdf/i)).toBeInTheDocument();
  });

  it('renders a clear not-found state without inventing rules', () => {
    render(
      <LookupResultCard
        result={{ found: false, query: 'xyznotaterm' }}
        systemLabel="Pathfinder 2e"
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/not in corpus/i);
    expect(screen.getByText(/xyznotaterm/)).toBeInTheDocument();
    expect(screen.getByText(/will not guess or invent/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/undefined|null/i);
  });

  it('does not leak internal corpus metadata in the rendered card', () => {
    const longHit: LookupHit = {
      ...sampleHit,
      explanation: 'x'.repeat(TABLE_SIDE_MAX_CHARS + 50),
      corpusVersion: 'secret-build-id',
    };

    render(<LookupResultCard result={longHit} systemLabel="D&D 5e (SRD)" />);

    expect(screen.getByText(longHit.explanation)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('secret-build-id');
    expect(document.body.textContent).not.toMatch(/corpusVersion/i);
  });
});
