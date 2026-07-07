import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PF2E_RULES } from './pf2e-rules-manifest.mjs';
import { YZE_RULES } from './yze-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../src/data');

describe('SRD corpora integrity', () => {
  it('D&D corpus matches lookup-v4 with Downtime and Social phases', () => {
    const corpus = JSON.parse(readFileSync(join(DATA, 'dnd5e-srd-corpus.json'), 'utf8'));
    expect(corpus.license).toBe('CC-BY-4.0');
    expect(corpus.version).toBe('5.2.1-lookup-v4');
    expect(corpus.entryCount).toBe(corpus.entries.length);
    const phases = new Set(corpus.entries.map((entry) => entry.phase));
    expect(phases.has('Downtime')).toBe(true);
    expect(phases.has('Social')).toBe(true);
  });

  it('PF2e corpus matches manifest and is ORC-licensed', () => {
    const corpus = JSON.parse(readFileSync(join(DATA, 'pf2e-srd-corpus.json'), 'utf8'));
    expect(corpus.license).toBe('ORC');
    expect(corpus.version).toBe('pf2e-remaster-v10');
    expect(corpus.entryCount).toBe(PF2E_RULES.length);
    expect(corpus.entries).toHaveLength(PF2E_RULES.length);
  });

  it('YZE corpus matches manifest and is FTL-licensed', () => {
    const corpus = JSON.parse(
      readFileSync(join(DATA, 'year-zero-engine-srd-corpus.json'), 'utf8'),
    );
    expect(corpus.license).toBe('YZE-FTL');
    expect(corpus.version).toBe('yze-srd-v11');
    expect(corpus.entryCount).toBe(YZE_RULES.length);
    expect(corpus.entries).toHaveLength(YZE_RULES.length);
  });
});
