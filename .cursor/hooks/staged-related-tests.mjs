#!/usr/bin/env node
import { isRiskArea, isTestable } from './risk-areas.mjs';
import { failWithContext, pass, resolveProjectPath, runCommand } from './hook-utils.mjs';

const staged = process.argv
  .slice(2)
  .map(resolveProjectPath)
  .filter((filePath) => filePath && isTestable(filePath) && isRiskArea(filePath));

if (staged.length === 0) {
  pass();
}

const result = runCommand('npx', ['vitest', 'related', ...staged, '--run']);

if (result.status === 0) {
  pass();
}

const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
failWithContext('Related tests failed for staged risk-area files:', output);
