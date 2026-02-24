import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const MAX_LINES = 200;
const violations: Array<{ file: string; lines: number }> = [];

const SKIP_DIRS = new Set(['__tests__', 'node_modules', 'dist']);

function isSkippedFile(name: string): boolean {
  return name.includes('.stories.') || name.includes('.test.');
}

function checkFileSize(full: string): void {
  const content = readFileSync(full, 'utf-8');
  const lineCount = content.split('\n').length;
  if (lineCount > MAX_LINES) {
    violations.push({ file: full.replace(`${ROOT}/`, ''), lines: lineCount });
  }
}

function scan(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) scan(full);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !isSkippedFile(entry.name)) {
      checkFileSize(full);
    }
  }
}

const packagesDir = join(ROOT, 'packages');
for (const pkg of readdirSync(packagesDir)) {
  const srcDir = join(packagesDir, pkg, 'src');
  try {
    statSync(srcDir);
    scan(srcDir);
  } catch {
    // no src dir
  }
}

if (violations.length > 0) {
  console.error(
    `File size validation FAILED: ${violations.length} file(s) exceed ${MAX_LINES} lines`,
  );
  for (const v of violations) {
    console.error(`  - ${v.file}: ${v.lines} lines (split into smaller modules)`);
  }
  process.exit(2);
} else {
  console.log(`File size validation passed. All source files are within ${MAX_LINES} lines.`);
}
