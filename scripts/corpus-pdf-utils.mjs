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
    return {
      text: result.text.replace(/\r\n/g, '\n'),
      pages: result.total,
    };
  } finally {
    await parser.destroy();
  }
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

/**
 * Extract a section starting at a case-insensitive label until the next label
 * in stopLabels or maxLength is reached. Tries line headers first, then inline.
 */
export function extractSection(fullText, label, stopLabels = [], maxLength = 2400) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const lineStartPattern = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*(?:\\n|$)`, 'i');
  const lineStartMatch = lineStartPattern.exec(fullText);
  if (lineStartMatch) {
    return sliceSection(fullText, lineStartMatch.index + lineStartMatch[0].length, stopLabels, maxLength, label);
  }

  const lineContainsPattern = new RegExp(`(?:^|\\n)\\s*[^\\n]*\\b${escaped}\\b[^\\n]*(?:\\n|$)`, 'i');
  const lineContainsMatch = lineContainsPattern.exec(fullText);
  if (lineContainsMatch) {
    return sliceSection(
      fullText,
      lineContainsMatch.index + lineContainsMatch[0].length,
      stopLabels,
      maxLength,
      label,
    );
  }

  const inlinePattern = new RegExp(`\\b${escaped}\\b`, 'i');
  const inlineMatch = inlinePattern.exec(fullText);
  if (inlineMatch) {
    return sliceSection(fullText, inlineMatch.index, stopLabels, maxLength, label);
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

export function writeCorpusBundle(filename, bundle) {
  ensureLocalDataDir();
  const outPath = join(LOCAL_DATA_DIR, filename);
  writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${bundle.entryCount} entries to ${outPath}`);
  console.log('Set in .env.local for local dev:');
  console.log(`  ${bundle.envKey}=${outPath.replace(/\\/g, '/')}`);
}
