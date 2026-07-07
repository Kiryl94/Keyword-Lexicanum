import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PF2E_RULES } from './pf2e-rules-manifest.mjs';
import { YZE_RULES } from './yze-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../src/data');

describe('SRD corpora integrity', () => {
  it('PF2e corpus matches manifest and is ORC-licensed', () => {
    const corpus = JSON.parse(readFileSync(join(DATA, 'pf2e-srd-corpus.json'), 'utf8'));
    expect(corpus.license).toBe('ORC');
    expect(corpus.version).toBe('pf2e-remaster-v9');
    expect(corpus.entryCount).toBe(PF2E_RULES.length);
    expect(corpus.entries).toHaveLength(PF2E_RULES.length);
  });

  it('YZE corpus matches manifest and is FTL-licensed', () => {
    const corpus = JSON.parse(
      readFileSync(join(DATA, 'year-zero-engine-srd-corpus.json'), 'utf8'),
    );
    expect(corpus.license).toBe('YZE-FTL');
    expect(corpus.version).toBe('yze-srd-v10');
    expect(corpus.entryCount).toBe(YZE_RULES.length);
    expect(corpus.entries).toHaveLength(YZE_RULES.length);
  });
});
