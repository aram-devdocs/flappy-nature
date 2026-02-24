import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const errors: string[] = [];
const warnings: string[] = [];

// Check root CLAUDE.md exists
const rootClaudeMd = join(ROOT, 'CLAUDE.md');
if (!existsSync(rootClaudeMd)) {
  errors.push('Missing root CLAUDE.md');
} else {
  const content = readFileSync(rootClaudeMd, 'utf-8');
  const requiredSections = ['Architecture', 'Commands', 'Anti-Patterns', 'Commit Convention'];
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`) && !content.includes(`# ${section}`)) {
      errors.push(`Root CLAUDE.md missing required section: ${section}`);
    }
  }
}

// Check .claude/rules/ files for constrained packages
const constrainedPackages = ['engine', 'ui', 'hooks', 'game'];
const rulesDir = join(ROOT, '.claude', 'rules');

if (!existsSync(rulesDir)) {
  errors.push('Missing .claude/rules/ directory');
} else {
  for (const pkg of constrainedPackages) {
    const ruleFile = join(rulesDir, `${pkg}.md`);
    if (!existsSync(ruleFile)) {
      warnings.push(`Missing rule file: .claude/rules/${pkg}.md`);
    }
  }
}

// Check package-level CLAUDE.md files
const packagesDir = join(ROOT, 'packages');
for (const pkgName of readdirSync(packagesDir)) {
  const pkgDir = join(packagesDir, pkgName);
  const pkgJson = join(pkgDir, 'package.json');
  if (!existsSync(pkgJson)) continue;

  const claudeMd = join(pkgDir, 'CLAUDE.md');
  if (!existsSync(claudeMd)) {
    warnings.push(`Missing CLAUDE.md for packages/${pkgName}`);
    continue;
  }

  const content = readFileSync(claudeMd, 'utf-8');
  const pkgJsonContent = JSON.parse(readFileSync(pkgJson, 'utf-8')) as { name: string };

  // Verify package name reference
  if (!content.includes(pkgJsonContent.name) && !content.includes(`@repo/${pkgName}`)) {
    warnings.push(`packages/${pkgName}/CLAUDE.md does not reference its own package name`);
  }
}

if (errors.length > 0) {
  console.error('CLAUDE.md validation FAILED:');
  for (const e of errors) {
    console.error(`  ERROR: ${e}`);
  }
  for (const w of warnings) {
    console.error(`  WARN: ${w}`);
  }
  process.exit(2);
}

if (warnings.length > 0) {
  console.log('CLAUDE.md validation passed with warnings:');
  for (const w of warnings) {
    console.log(`  WARN: ${w}`);
  }
} else {
  console.log('CLAUDE.md validation passed.');
}
