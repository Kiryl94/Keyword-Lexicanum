import { describe, expect, it } from 'vitest';
import { formatCorpusCitation, sourceUrlWithPage } from '@/lib/corpus/citation';

describe('sourceUrlWithPage', () => {
  it('appends PDF page fragment when page is set', () => {
    expect(sourceUrlWithPage('https://example.com/rules.pdf', 42)).toBe(
      'https://example.com/rules.pdf#page=42',
    );
  });

  it('returns base URL when page is omitted', () => {
    expect(sourceUrlWithPage('https://example.com/rules.pdf')).toBe(
      'https://example.com/rules.pdf',
    );
  });
});

describe('formatCorpusCitation', () => {
  it('includes document title, page, and section', () => {
    expect(
      formatCorpusCitation({
        documentTitle: 'WH40k Core Rules',
        documentUrl: 'https://example.com/rules.pdf',
        page: 12,
        section: 'Engagement',
      }),
    ).toBe('WH40k Core Rules, p. 12 — Engagement');
  });

  it('formats page ranges', () => {
    expect(
      formatCorpusCitation({
        documentTitle: 'WH40k Core Rules',
        documentUrl: 'https://example.com/rules.pdf',
        page: 12,
        pageEnd: 13,
        section: 'Fight Phase',
      }),
    ).toBe('WH40k Core Rules, pp. 12–13 — Fight Phase');
  });
});
