import type { GameSystemId } from '@/store/session';
import { getDndCorpusVersion } from '@/lib/corpus/dnd5e-srd';
import { getStarcraftCorpusVersion } from '@/lib/corpus/starcraft-core';
import { getWh40kCorpusVersion } from '@/lib/corpus/wh40k-core';

export function getCorpusVersion(systemId: GameSystemId): string {
  if (systemId === 'dnd5e-srd') return getDndCorpusVersion();
  if (systemId === 'wh40k-11') return getWh40kCorpusVersion();
  return getStarcraftCorpusVersion();
}
