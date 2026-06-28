import { describe, expect, it } from 'vitest';
import {
  cleanDndExplanation,
  proseWithoutTables,
  shouldExcludeDndEntry,
  stripMarkdownTables,
} from './dnd-corpus-utils.mjs';

describe('stripMarkdownTables', () => {
  it('removes pipe tables but keeps prose', () => {
    const text = [
      'Each ability has a modifier derived from its score.',
      '',
      '|Score|Modifier|',
      '|---|---|',
      '|10|+0|',
    ].join('\n');

    expect(stripMarkdownTables(text)).toBe(
      'Each ability has a modifier derived from its score.',
    );
  });
});

describe('shouldExcludeDndEntry', () => {
  it('excludes XP-by-CR reference tables', () => {
    expect(
      shouldExcludeDndEntry(
        'Experience Points by Challenge Rating',
        '| Challenge | XP |\n| 1 | 200 |',
      ),
    ).toBe(true);
  });

  it('keeps short condition definitions', () => {
    expect(
      shouldExcludeDndEntry(
        'Poisoned',
        '• A poisoned creature has disadvantage on attack rolls and ability checks.',
      ),
    ).toBe(false);
  });

  it('keeps XP rules with prose', () => {
    expect(
      shouldExcludeDndEntry(
        'Experience Points',
        'The experience point cost to gain a level is always based on your total character level.',
      ),
    ).toBe(false);
  });
});

describe('cleanDndExplanation', () => {
  it('removes ability modifier score table from explanation', () => {
    const text = [
      'An ability modifier is derived from its score.',
      '',
      '|Score|Modifier|',
      '|10–11|+0|',
    ].join('\n');

    expect(cleanDndExplanation(text)).not.toContain('|');
    expect(proseWithoutTables(cleanDndExplanation(text))).toContain('derived from its score');
  });
});
