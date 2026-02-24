import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const uiSrc = join(ROOT, 'packages', 'ui', 'src');
const shouldFix = process.argv.includes('--fix');

interface ComponentInfo {
  name: string;
  file: string;
  level: string;
  hasStory: boolean;
}

const components: ComponentInfo[] = [];

function scanLevel(dir: string, level: string): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.tsx')) continue;
    if (entry.name === 'index.ts' || entry.name === 'index.tsx') continue;
    if (entry.name.includes('.stories.') || entry.name.includes('.test.')) continue;

    const componentName = entry.name.replace('.tsx', '');
    const storyFile = join(dir, `${componentName}.stories.tsx`);
    components.push({
      name: componentName,
      file: join(dir, entry.name).replace(`${ROOT}/`, ''),
      level,
      hasStory: existsSync(storyFile),
    });
  }
}

scanLevel(join(uiSrc, 'atoms'), 'atoms');
scanLevel(join(uiSrc, 'molecules'), 'molecules');
scanLevel(join(uiSrc, 'organisms'), 'organisms');

const missing = components.filter((c) => !c.hasStory);

if (shouldFix && missing.length > 0) {
  for (const comp of missing) {
    const dir = join(ROOT, dirname(comp.file));
    const storyPath = join(dir, `${comp.name}.stories.tsx`);
    const skeleton = `import type { Meta, StoryObj } from '@storybook/react';
import { ${comp.name} } from './${comp.name}';

const meta: Meta<typeof ${comp.name}> = {
  title: '${comp.level}/${comp.name}',
  component: ${comp.name},
};

export default meta;
type Story = StoryObj<typeof ${comp.name}>;

export const Default: Story = {
  args: {},
};
`;
    writeFileSync(storyPath, skeleton);
    console.log(`  Generated: ${storyPath.replace(`${ROOT}/`, '')}`);
  }
  console.log(`Generated ${missing.length} skeleton story file(s).`);
}

// Report
const byLevel = new Map<string, ComponentInfo[]>();
for (const c of components) {
  const list = byLevel.get(c.level) ?? [];
  list.push(c);
  byLevel.set(c.level, list);
}

const total = components.length;
const covered = components.filter((c) => c.hasStory).length;

console.log(
  `\nStorybook coverage: ${covered}/${total} components (${total > 0 ? Math.round((covered / total) * 100) : 0}%)`,
);
for (const [level, comps] of byLevel) {
  const levelCovered = comps.filter((c) => c.hasStory).length;
  console.log(`  ${level}: ${levelCovered}/${comps.length}`);
  for (const c of comps) {
    console.log(`    ${c.hasStory ? 'ok' : 'MISSING'} ${c.name}`);
  }
}

if (missing.length > 0 && !shouldFix) {
  console.error(
    `\nStorybook coverage validation FAILED: ${missing.length} component(s) missing stories.`,
  );
  console.error('Run with --fix to generate skeleton story files.');
  process.exit(2);
} else if (missing.length === 0) {
  console.log('\nStorybook coverage validation passed. 100% coverage.');
}
