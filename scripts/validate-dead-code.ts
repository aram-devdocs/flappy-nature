import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

interface ExportInfo {
  name: string;
  file: string;
  isUsed: boolean;
}

const exports: ExportInfo[] = [];
const allSourceContent = new Map<string, string>();

function collectFiles(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.turbo')
        continue;
      collectFiles(full);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      const content = readFileSync(full, 'utf-8');
      allSourceContent.set(full.replace(`${ROOT}/`, ''), content);
    }
  }
}

function findExports(filePath: string, content: string): void {
  // Named exports: export function/const/class/type/interface NAME
  const namedExportPattern = /export\s+(?:function|const|class|type|interface|enum)\s+(\w+)/g;
  let match: RegExpExecArray | null;
  match = namedExportPattern.exec(content);
  while (match !== null) {
    exports.push({ name: match[1] ?? '', file: filePath, isUsed: false });
    match = namedExportPattern.exec(content);
  }

  // Re-exports: export { Name } from './...'
  const reExportPattern = /export\s*\{([^}]+)\}/g;
  match = reExportPattern.exec(content);
  while (match !== null) {
    const names = (match[1] ?? '').split(',').map(
      (n) =>
        n
          .trim()
          .split(/\s+as\s+/)
          .pop()
          ?.trim() ?? '',
    );
    for (const name of names) {
      if (name) exports.push({ name, file: filePath, isUsed: false });
    }
    match = reExportPattern.exec(content);
  }
}

// Collect all source files
const packagesDir = join(ROOT, 'packages');
for (const pkg of readdirSync(packagesDir)) {
  const srcDir = join(packagesDir, pkg, 'src');
  try {
    statSync(srcDir);
    collectFiles(srcDir);
  } catch {
    // no src dir
  }
}

// Also scan apps
const appsDir = join(ROOT, 'apps');
if (existsSync(appsDir)) {
  for (const app of readdirSync(appsDir)) {
    const srcDir = join(appsDir, app, 'src');
    try {
      statSync(srcDir);
      collectFiles(srcDir);
    } catch {
      // no src dir
    }
  }
}

// Find exports in package non-index files
for (const [filePath, content] of allSourceContent) {
  if (filePath.includes('index.ts')) continue; // Skip barrel files
  if (filePath.includes('__tests__/')) continue;
  if (filePath.includes('.stories.')) continue;
  findExports(filePath, content);
}

// Check if each export is used somewhere (simple text search)
for (const exp of exports) {
  for (const [filePath, content] of allSourceContent) {
    if (filePath === exp.file) continue; // Don't count self-references
    if (content.includes(exp.name)) {
      exp.isUsed = true;
      break;
    }
  }
}

const unused = exports.filter((e) => !e.isUsed);

if (unused.length > 0) {
  console.log(`Dead code analysis: ${unused.length} potentially unused export(s) found.`);
  for (const u of unused) {
    console.log(`  - ${u.file}: ${u.name}`);
  }
  console.log('\nThis is informational only. Review manually before removing.');
} else {
  console.log('Dead code analysis: No potentially unused exports found.');
}

// Always exit 0 -- informational only
process.exit(0);
