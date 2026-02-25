import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const HOOK_PATTERN = /\buse[A-Z]\w*\s*\(/;
const violations: Array<{ file: string; line: number; hook: string }> = [];

function scan(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'node_modules') continue;
      scan(full);
    } else if (entry.isFile() && /\.tsx$/.test(entry.name)) {
      if (entry.name.includes('.stories.') || entry.name.includes('.test.')) continue;
      checkFile(full);
    }
  }
}

function checkFile(filePath: string): void {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    // Skip import lines -- `import { forwardRef } from 'react'` is fine
    if (line.trimStart().startsWith('import ')) continue;
    // Skip comments
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
    const match = HOOK_PATTERN.exec(line);
    if (match) {
      const rel = filePath.replace(`${ROOT}/`, '');
      violations.push({ file: rel, line: i + 1, hook: match[0].trim() });
    }
  }
}

const uiSrcDir = join(ROOT, 'packages', 'ui', 'src');
try {
  statSync(uiSrcDir);
  scan(uiSrcDir);
} catch {
  console.log('UI stateless validation: packages/ui/src not found, skipping.');
  process.exit(0);
}

if (violations.length > 0) {
  console.error('UI stateless validation FAILED:');
  for (const v of violations) {
    console.error(`  - ${v.file}:${v.line} -- hook call found: ${v.hook}`);
  }
  console.error(
    '\nUI components must be stateless. Move state into @repo/hooks and wire via @repo/flappy-gouda-game.',
  );
  process.exit(2);
} else {
  console.log('UI stateless validation passed. All UI components are stateless.');
}
