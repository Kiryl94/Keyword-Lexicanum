#!/usr/bin/env node
import { isLintable } from './risk-areas.mjs';
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

if (!editedPath || !isLintable(editedPath)) {
  pass();
}

const result = runCommand('npx', ['eslint', editedPath]);

if (result.status === 0) {
  pass();
}

const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
failWithContext(`ESLint failed after editing ${editedPath}:`, output);
