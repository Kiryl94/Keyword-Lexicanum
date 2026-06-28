export type PhaseApplicability = 'restricted' | 'general';

export type CorpusEntry = {
  keyword: string;
  phase: string;
  applicability: PhaseApplicability;
  explanation: string;
  citation: string;
};

export type CorpusBundle = {
  version: string;
  license: string;
  attribution: string;
  entryCount: number;
  entries: CorpusEntry[];
};
