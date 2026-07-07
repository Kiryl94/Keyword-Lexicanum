import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');

describe('PWA assets', () => {
  it('ships a web manifest with standalone display', () => {
    const manifest = JSON.parse(
      readFileSync(join(PUBLIC, 'manifest.webmanifest'), 'utf8'),
    );
    expect(manifest.name).toBe('Keyword Lexicanum');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('ships a service worker that caches the app shell', () => {
    const sw = readFileSync(join(PUBLIC, 'sw.js'), 'utf8');
    expect(sw).toContain('keyword-lexicanum-v1');
    expect(sw).toContain("cache.addAll(['/', '/manifest.webmanifest'])");
    expect(sw).toContain('/_next/static/');
  });
});
