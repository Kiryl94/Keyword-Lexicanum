export type PhaseApplicability = 'restricted' | 'general';

/** Traceable reference to the official rules document. */
export type CorpusSource = {
  documentTitle: string;
  documentUrl: string;
  page?: number;
  pageEnd?: number;
  section?: string;
};

export type CorpusEntry = {
  keyword: string;
  phase: string;
  applicability: PhaseApplicability;
  explanation: string;
  /** Human-readable citation line (includes page when available). */
  citation: string;
  source?: CorpusSource;
  /** Alternate lookup terms that resolve to this entry's keyword. */
  aliases?: string[];
};

export type CorpusBundle = {
  version: string;
  license: string;
  attribution: string;
  entryCount: number;
  /** Default document URL for entries missing per-entry source URLs. */
  sourceDocumentUrl?: string;
  entries: CorpusEntry[];
};
