#!/usr/bin/env node
import { isRiskArea, isTestable } from './risk-areas.mjs';
import {
  failWithContext,
  getEditedPath,
  pass,
  readHookInput,
  resolveProjectPath,
  runCommand,
} from './hook-utils.mjs';

const input = readHookInput();
const editedPath = resolveProjectPath(getEditedPath(input));

if (!editedPath || !isTestable(editedPath) || !isRiskArea(editedPath)) {
  pass();
}

const result = runCommand('npx', ['vitest', 'related', editedPath, '--run']);

if (result.status === 0) {
  pass();
}

const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
failWithContext(`Related tests failed after editing ${editedPath}:`, output);
