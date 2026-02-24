import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

interface A11yCheck {
  component: string;
  required: string;
  wcagRef: string;
}

const violations: Array<{ file: string; check: string; wcagRef: string }> = [];

function hasDialogRole(content: string): boolean {
  return content.includes('role="dialog"') || content.includes('<dialog');
}

function checkDialogA11y(rel: string, componentName: string, content: string): void {
  const isOverlay = content.includes("position: 'absolute'") && content.includes('inset: 0');
  if (!isOverlay) return;
  if (!hasDialogRole(content)) {
    violations.push({
      file: rel,
      check: `${componentName}: needs role="dialog" or <dialog> element`,
      wcagRef: 'WCAG 4.1.2',
    });
  }
  if (!content.includes('aria-label')) {
    violations.push({
      file: rel,
      check: `${componentName}: needs aria-label`,
      wcagRef: 'WCAG 4.1.2',
    });
  }
}

function getButtonChecks(componentName: string, content: string): A11yCheck[] {
  if (!content.includes('<button') || content.includes('aria-label')) return [];
  const hasIconOnlyButton =
    content.includes('onClick') && !content.match(/<button[^>]*>[\s\S]*?\w+[\s\S]*?<\/button>/);
  if (!hasIconOnlyButton) return [];
  return [
    { component: componentName, required: 'aria-label on icon buttons', wcagRef: 'WCAG 4.1.2' },
  ];
}

function checkCanvasA11y(rel: string, content: string): void {
  if (content.includes('<canvas') && !content.includes('aria-label')) {
    violations.push({ file: rel, check: 'Canvas needs aria-label', wcagRef: 'WCAG 1.1.1' });
  }
}

function checkScoreDisplayA11y(rel: string, componentName: string, content: string): void {
  if (componentName === 'ScoreDisplay' && !content.includes('aria-live')) {
    violations.push({
      file: rel,
      check: 'Score display should use aria-live for dynamic updates',
      wcagRef: 'WCAG 4.1.3',
    });
  }
}

function checkComponent(filePath: string, componentName: string): void {
  const content = readFileSync(filePath, 'utf-8');
  const rel = filePath.replace(`${ROOT}/`, '');

  checkDialogA11y(rel, componentName, content);
  checkCanvasA11y(rel, content);
  checkScoreDisplayA11y(rel, componentName, content);

  const buttonChecks = getButtonChecks(componentName, content);
  for (const check of buttonChecks) {
    if (!content.includes(check.required.split('=')[0] ?? '')) {
      violations.push({
        file: rel,
        check: `${check.component}: needs ${check.required}`,
        wcagRef: check.wcagRef,
      });
    }
  }
}

const uiSrc = join(ROOT, 'packages', 'ui', 'src');
const levels = ['atoms', 'molecules', 'organisms'];

for (const level of levels) {
  const dir = join(uiSrc, level);
  try {
    statSync(dir);
  } catch {
    continue;
  }
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.tsx') || entry.includes('.stories.') || entry.includes('.test.'))
      continue;
    checkComponent(join(dir, entry), entry.replace('.tsx', ''));
  }
}

if (violations.length > 0) {
  console.error(`Accessibility validation FAILED: ${violations.length} issue(s) found.`);
  for (const v of violations) {
    console.error(`  - ${v.file}: ${v.check} (${v.wcagRef})`);
  }
  process.exit(2);
} else {
  console.log('Accessibility validation passed.');
}
