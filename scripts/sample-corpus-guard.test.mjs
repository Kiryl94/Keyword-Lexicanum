import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { WH40K_RULES } from './wh40k-rules-manifest.mjs';
import { STARCRAFT_RULES } from './starcraft-rules-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src/data');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), 'utf8'));
}

function loadSample(filename) {
  return JSON.parse(readFileSync(join(DATA, filename), 'utf8'));
}

describe('Demo sample corpora integrity', () => {
  it('WH40k sample matches manifest length and entryCount metadata', () => {
    const sample = loadSample('wh40k-core-corpus.sample.json');
    expect(sample.license).toBe('sample-only');
    expect(sample.entryCount).toBe(WH40K_RULES.length);
    expect(sample.entries).toHaveLength(WH40K_RULES.length);
    expect(sample.entryCount).toBe(sample.entries.length);
    expect(sample.entries.every((e) => e.explanation.length > 0)).toBe(true);
  });

  it('StarCraft sample matches manifest length and entryCount metadata', () => {
    const sample = loadSample('starcraft-core-corpus.sample.json');
    expect(sample.license).toBe('sample-only');
    expect(sample.entryCount).toBe(STARCRAFT_RULES.length);
    expect(sample.entries).toHaveLength(STARCRAFT_RULES.length);
    expect(sample.entryCount).toBe(sample.entries.length);
  });

  it('D&D SRD corpus is not sample-only', () => {
    const dnd = loadSample('dnd5e-srd-corpus.json');
    expect(dnd.license).not.toBe('sample-only');
    expect(dnd.entryCount).toBe(dnd.entries.length);
  });
});

describe('Demo public bundle aliases', () => {
  it('tsconfig resolves WH40k and StarCraft imports to sample JSON', () => {
    const tsconfig = loadJson('tsconfig.json');
    const paths = tsconfig.compilerOptions.paths;
    expect(paths['@/data/wh40k-active-corpus.json'][0]).toContain(
      'wh40k-core-corpus.sample.json',
    );
    expect(paths['@/data/starcraft-active-corpus.json'][0]).toContain(
      'starcraft-core-corpus.sample.json',
    );
  });

  it('next.config defaults demo corpus paths to sample JSON', async () => {
    const { default: nextConfig } = await import('../next.config.ts');
    const aliases = nextConfig.turbopack?.resolveAlias ?? {};
    expect(aliases['@/data/wh40k-active-corpus.json']).toContain('sample');
    expect(aliases['@/data/starcraft-active-corpus.json']).toContain('sample');
  });
});
