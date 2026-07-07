import type { GameSystemId } from '@/store/session';
import { getDndCorpusVersion } from '@/lib/corpus/dnd5e-srd';
import { getPf2eCorpusVersion } from '@/lib/corpus/pf2e-srd';
import { getStarcraftCorpusVersion } from '@/lib/corpus/starcraft-core';
import { getWh40kCorpusVersion } from '@/lib/corpus/wh40k-core';
import { getYzeCorpusVersion } from '@/lib/corpus/year-zero-engine';

export function getCorpusVersion(systemId: GameSystemId): string {
  switch (systemId) {
    case 'dnd5e-srd':
      return getDndCorpusVersion();
    case 'pf2e-srd':
      return getPf2eCorpusVersion();
    case 'year-zero-engine':
      return getYzeCorpusVersion();
    case 'wh40k-11':
      return getWh40kCorpusVersion();
    case 'starcraft-mini':
      return getStarcraftCorpusVersion();
    default:
      return 'unknown';
  }
}
