import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CONTEXT_LIMIT = 10_000;

export function readHookInput() {
  const raw = readFileSync(0, 'utf8');
  if (!raw.trim()) {
    return {};
  }
  return JSON.parse(raw);
}

export function getEditedPath(input) {
  const toolInput = input.tool_input ?? {};
  return (
    toolInput.file_path ??
    toolInput.path ??
    toolInput.target_file ??
    toolInput.filePath ??
    null
  );
}

export function runCommand(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    ...options,
  });
}

export function pass() {
  process.exit(0);
}

export function failWithContext(label, output) {
  const body = `${label}\n\n${output}`.trim().slice(0, CONTEXT_LIMIT);
  process.stdout.write(JSON.stringify({ additional_context: body }));
  process.exit(2);
}

export function resolveProjectPath(filePath) {
  if (!filePath) {
    return null;
  }
  return path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
}

export { ROOT };
