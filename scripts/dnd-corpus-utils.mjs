/**
 * Filters and cleans D&D SRD corpus entries for keyword lookup.
 * Drops reference tables and strips markdown tables from explanations.
 */

/** Keyword names that are pure reference tables or out-of-scope for lookup. */
export const DND_EXCLUDE_NAME_PATTERNS = [
  / Table$/i,
  / by Challenge Rating$/i,
  /Deities$/i,
  /^The .* Pantheon$/i,
  /^Step \d+:/i,
  /^Mounts and Other Animals$/i,
  /^Tack, Harness, and Drawn Vehicles$/i,
  /^Waterborne Vehicles$/i,
  /^Training$/i,
  /^Self-Sufficiency$/i,
  /^Services$/i,
  /^Spellcasting Services$/i,
  /^Food, Drink, and Lodging$/i,
  /^Madness Effects$/i,
  /^Trap Effects$/i,
  /^Statistics for Objects$/i,
  /^Creating Sentient Magic Items$/i,
  /^Prerequisites$/i,
];

export function stripMarkdownTables(text) {
  if (!text) return '';

  return text
    .split('\n')
    .filter((line) => !line.trim().includes('|'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function proseWithoutTables(text) {
  return stripMarkdownTables(text)
    .replace(/^>\s[^\n]*/gm, '')
    .replace(/#{1,6}\s[^\n]*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function shouldExcludeDndEntry(name, explanation) {
  if (DND_EXCLUDE_NAME_PATTERNS.some((pattern) => pattern.test(name))) {
    return true;
  }

  const prose = proseWithoutTables(explanation);
  const hasTable = explanation.includes('|');

  if (hasTable && prose.length < 40) {
    return true;
  }

  if (prose.length < 15) {
    return true;
  }

  return false;
}

export function cleanDndExplanation(text) {
  return stripMarkdownTables(text)
    .replace(/, as shown in the [^.]+\./gi, '. See the linked SRD for the full chart.')
    .replace(/shown in the [A-Za-z ]+ table/gi, 'detailed in the linked SRD')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
