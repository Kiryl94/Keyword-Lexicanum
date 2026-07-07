import { describe, expect, it } from 'vitest';
import {
  cleanDndExplanation,
  canonicalDndTopicKey,
  disambiguateDndPhaseKeyword,
  mergeDndDuplicateEntries,
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

describe('canonicalDndTopicKey', () => {
  it('treats slash and "and" variants as the same topic', () => {
    expect(canonicalDndTopicKey('Advantage and Disadvantage')).toBe(
      canonicalDndTopicKey('Advantage/Disadvantage'),
    );
  });
});

describe('mergeDndDuplicateEntries', () => {
  it('keeps one display keyword and stores the other as an alias', () => {
    const merged = mergeDndDuplicateEntries(
      {
        keyword: 'Advantage/Disadvantage',
        phase: 'General',
        applicability: 'general',
        explanation: 'Short.',
        citation: 'a',
      },
      {
        keyword: 'Advantage and Disadvantage',
        phase: 'General',
        applicability: 'general',
        explanation: 'Longer explanation about rolling two d20s.',
        citation: 'b',
      },
    );

    expect(merged.keyword).toBe('Advantage and Disadvantage');
    expect(merged.explanation).toContain('rolling two d20s');
    expect(merged.aliases).toContain('Advantage/Disadvantage');
  });
});

describe('disambiguateDndPhaseKeyword', () => {
  it('appends a phase-only suffix for restricted topics', () => {
    expect(disambiguateDndPhaseKeyword('Attack', 'Combat')).toBe('Attack (Combat Only)');
  });
});
