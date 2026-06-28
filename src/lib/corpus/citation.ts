import type { CorpusEntry, CorpusSource } from '@/lib/corpus/types';

export function sourceUrlWithPage(url: string, page?: number): string {
  if (!page || page < 1) return url;
  const base = url.split('#')[0];
  return `${base}#page=${page}`;
}

export function formatCorpusCitation(source: CorpusSource): string {
  const parts = [source.documentTitle];
  if (source.page) {
    parts.push(
      source.pageEnd && source.pageEnd !== source.page
        ? `pp. ${source.page}–${source.pageEnd}`
        : `p. ${source.page}`,
    );
  }
  if (source.section) {
    parts.push(`— ${source.section}`);
  }
  return parts.join(', ').replace(', —', ' —');
}

export function buildCorpusSource(
  partial: CorpusSource & Pick<CorpusSource, 'documentTitle' | 'documentUrl'>,
): CorpusSource {
  return {
    documentTitle: partial.documentTitle,
    documentUrl: partial.documentUrl,
    page: partial.page,
    pageEnd: partial.pageEnd,
    section: partial.section,
  };
}

export function entryWithCitation(
  entry: Omit<CorpusEntry, 'citation' | 'source'>,
  source: CorpusSource,
): CorpusEntry {
  return {
    ...entry,
    source,
    citation: formatCorpusCitation(source),
  };
}

export type { CorpusSource };
