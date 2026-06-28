/**
 * Shared helpers for building corpora from official PDF downloads.
 * Output is written to src/data/local/ (gitignored) for personal use.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const LOCAL_DATA_DIR = join(__dirname, '../src/data/local');

export function ensureLocalDataDir() {
  mkdirSync(LOCAL_DATA_DIR, { recursive: true });
}

export async function fetchPdfText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PDF fetch failed: ${response.status} ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const pageStarts = [];
    let fullText = '';

    for (const page of result.pages) {
      pageStarts.push({ start: fullText.length, page: page.num });
      fullText += page.text.replace(/\r\n/g, '\n') + '\n\n';
    }

    return {
      text: fullText,
      pages: result.total,
      pageStarts,
      sourceUrl: url,
    };
  } finally {
    await parser.destroy();
  }
}

export function pageAtOffset(pageStarts, charIndex) {
  if (!pageStarts?.length) return undefined;
  let page = pageStarts[0].page;
  for (const entry of pageStarts) {
    if (entry.start <= charIndex) page = entry.page;
    else break;
  }
  return page;
}

export function pageEndAtOffset(pageStarts, charIndex) {
  if (!pageStarts?.length) return undefined;
  let page = pageStarts[pageStarts.length - 1].page;
  for (const entry of pageStarts) {
    if (entry.start <= charIndex) page = entry.page;
    else break;
  }
  return page;
}

export function normalizeKeyword(value) {
  return value.trim().toLowerCase();
}

export function cleanExtractedText(text) {
  return text
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

export function formatCorpusCitation(source) {
  const parts = [source.documentTitle];
  if (source.page) {
    parts.push(
      source.pageEnd && source.pageEnd !== source.page
        ? `pp. ${source.page}–${source.pageEnd}`
        : `p. ${source.page}`,
    );
  }
  if (source.section) {
    parts.push(`— ${source.section}`);
  }
  return parts.join(', ').replace(', —', ' —');
}

function findSectionStart(fullText, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const lineStartPattern = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*(?:\\n|$)`, 'i');
  const lineStartMatch = lineStartPattern.exec(fullText);
  if (lineStartMatch) {
    return {
      startIndex: lineStartMatch.index,
      contentStart: lineStartMatch.index + lineStartMatch[0].length,
    };
  }

  const lineContainsPattern = new RegExp(`(?:^|\\n)\\s*[^\\n]*\\b${escaped}\\b[^\\n]*(?:\\n|$)`, 'i');
  const lineContainsMatch = lineContainsPattern.exec(fullText);
  if (lineContainsMatch) {
    return {
      startIndex: lineContainsMatch.index,
      contentStart: lineContainsMatch.index + lineContainsMatch[0].length,
    };
  }

  const inlinePattern = new RegExp(`\\b${escaped}\\b`, 'i');
  const inlineMatch = inlinePattern.exec(fullText);
  if (inlineMatch) {
    return { startIndex: inlineMatch.index, contentStart: inlineMatch.index };
  }

  return null;
}

function sliceSection(fullText, startIndex, stopLabels, maxLength, currentLabel) {
  let endIndex = fullText.length;
  const currentNorm = normalizeKeyword(currentLabel);

  for (const stopLabel of stopLabels) {
    if (normalizeKeyword(stopLabel) === currentNorm) continue;
    const stopEscaped = stopLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stopPattern = new RegExp(`(?:^|\\n)\\s*${stopEscaped}\\s*(?:\\n|$)`, 'i');
    const stopMatch = stopPattern.exec(fullText.slice(startIndex));
    if (stopMatch && stopMatch.index > 0 && stopMatch.index < endIndex - startIndex) {
      endIndex = startIndex + stopMatch.index;
    }
  }

  const raw = fullText.slice(startIndex, Math.min(endIndex, startIndex + maxLength));
  return cleanExtractedText(raw);
}

/**
 * Extract rule text and character offset for page lookup.
 */
export function extractSectionWithMeta(fullText, label, stopLabels = [], maxLength = 2400) {
  const found = findSectionStart(fullText, label);
  if (!found) return null;

  const explanation = sliceSection(
    fullText,
    found.contentStart,
    stopLabels,
    maxLength,
    label,
  );
  if (!explanation || explanation.length < 40) return null;

  const endIndex = found.contentStart + explanation.length;
  return { explanation, startIndex: found.startIndex, endIndex };
}

/** @deprecated Use extractSectionWithMeta */
export function extractSection(fullText, label, stopLabels = [], maxLength = 2400) {
  return extractSectionWithMeta(fullText, label, stopLabels, maxLength)?.explanation ?? null;
}

export function buildPdfSource({ documentTitle, documentUrl, page, pageEnd, section }) {
  const source = { documentTitle, documentUrl, page, pageEnd, section };
  return { source, citation: formatCorpusCitation(source) };
}

export function writeCorpusBundle(filename, bundle) {
  ensureLocalDataDir();
  const outPath = join(LOCAL_DATA_DIR, filename);
  writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${bundle.entryCount} entries to ${outPath}`);
  console.log('Set in .env.local for local dev:');
  console.log(`  ${bundle.envKey}=${outPath.replace(/\\/g, '/')}`);
}
