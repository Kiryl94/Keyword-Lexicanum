'use client';

import { formatCorpusCitation, sourceUrlWithPage } from '@/lib/corpus/citation';
import type { CorpusSource } from '@/lib/corpus/types';

type CitationBlockProps = {
  citation: string;
  source?: CorpusSource;
};

export function CitationBlock({ citation, source }: CitationBlockProps) {
  if (!source) {
    return <p className="text-xs leading-relaxed text-[#8a8aa0]">{citation}</p>;
  }

  const href = sourceUrlWithPage(source.documentUrl, source.page);
  const label = formatCorpusCitation(source);

  return (
    <p className="text-xs leading-relaxed text-[#8a8aa0]">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#e94560] underline decoration-[#e94560]/40 underline-offset-2 hover:text-[#ff6b81]"
      >
        {label}
      </a>
      <span className="mt-1 block text-[#6b6b80]">Open source to verify this rule.</span>
    </p>
  );
}
