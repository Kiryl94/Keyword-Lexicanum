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

/** Collapse punctuation variants for duplicate topic detection (e.g. Advantage/Disadvantage). */
export function canonicalDndTopicKey(name) {
  return name
    .toLowerCase()
    .replace(/\//g, ' and ')
    .replace(/\band\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function preferDndDisplayKeyword(a, b) {
  const score = (name) => {
    let value = 0;
    if (/\band\b/i.test(name)) value += 3;
    if (!name.includes('/')) value += 2;
    if (name.length > 12) value += 1;
    return value;
  };
  return score(a) >= score(b) ? a : b;
}

export function mergeDndDuplicateEntries(existing, incoming) {
  const keyword = preferDndDisplayKeyword(incoming.keyword, existing.keyword);
  const explanation =
    incoming.explanation.length > existing.explanation.length
      ? incoming.explanation
      : existing.explanation;
  const citation =
    incoming.explanation.length > existing.explanation.length
      ? incoming.citation
      : existing.citation;
  const source =
    incoming.explanation.length > existing.explanation.length
      ? incoming.source
      : existing.source;
  const aliases = new Set([...(existing.aliases ?? []), ...(incoming.aliases ?? [])]);
  for (const label of [existing.keyword, incoming.keyword]) {
    if (label !== keyword) aliases.add(label);
  }
  return {
    ...existing,
    keyword,
    explanation,
    citation,
    source,
    aliases: aliases.size > 0 ? [...aliases].sort() : undefined,
  };
}

export function disambiguateDndPhaseKeyword(keyword, phase) {
  if (/\([^)]+\sOnly\)$/i.test(keyword)) {
    return keyword;
  }
  return `${keyword} (${phase} Only)`;
}
