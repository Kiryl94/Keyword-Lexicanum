import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CitationBlock } from '@/components/CitationBlock';

describe('CitationBlock', () => {
  it('renders plain citation text when source metadata is missing', () => {
    render(<CitationBlock citation="SRD — Advantage" />);

    expect(screen.getByText('SRD — Advantage')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a page-linked citation the player can open at the table', () => {
    render(
      <CitationBlock
        citation="unused"
        source={{
          documentTitle: 'WH40k Core Rules',
          documentUrl: 'https://example.com/rules.pdf',
          page: 42,
          section: 'Engagement',
        }}
      />,
    );

    const link = screen.getByRole('link', { name: /WH40k Core Rules, p\. 42 — Engagement/i });
    expect(link).toHaveAttribute('href', 'https://example.com/rules.pdf#page=42');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(/open the linked pdf at this page/i)).toBeInTheDocument();
  });
});
