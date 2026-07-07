/** Risk-area prefixes from context/foundation/test-plan.md §1 hot-spots. */
const RISK_PREFIXES = [
  'src/lib/',
  'src/store/',
  'src/components/',
  'src/data/',
  'scripts/',
];

const LINTABLE = /\.(ts|tsx|js|mjs)$/i;
const TESTABLE = /\.(ts|tsx|mjs)$/i;

export function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

export function isRiskArea(filePath) {
  const normalized = normalizePath(filePath);
  return RISK_PREFIXES.some((prefix) => normalized.includes(prefix));
}

export function isLintable(filePath) {
  return LINTABLE.test(filePath);
}

export function isTestable(filePath) {
  return TESTABLE.test(filePath);
}
