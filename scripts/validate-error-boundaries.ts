import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const errors: string[] = [];

const gameSrcDir = join(ROOT, 'packages', 'flappy-nature-game', 'src');

// Check for error boundary component
const errorBoundaryFile = join(gameSrcDir, 'GameErrorBoundary.tsx');
if (!existsSync(errorBoundaryFile)) {
  errors.push(
    'Missing GameErrorBoundary.tsx in packages/flappy-nature-game/src/. Game component must be wrapped in an error boundary.',
  );
} else {
  const content = readFileSync(errorBoundaryFile, 'utf-8');
  if (!content.includes('componentDidCatch') && !content.includes('getDerivedStateFromError')) {
    errors.push(
      'GameErrorBoundary.tsx does not implement componentDidCatch or getDerivedStateFromError.',
    );
  }
}

// Check that the main game component uses the error boundary
const gameComponentFile = join(gameSrcDir, 'FlappyNatureGame.tsx');
if (existsSync(gameComponentFile)) {
  const content = readFileSync(gameComponentFile, 'utf-8');
  if (!content.includes('GameErrorBoundary') && !content.includes('ErrorBoundary')) {
    errors.push(
      'FlappyNatureGame.tsx does not reference GameErrorBoundary. The game component must be wrapped.',
    );
  }
}

// Check for ErrorFallback in @repo/ui
const errorFallbackFile = join(ROOT, 'packages', 'ui', 'src', 'organisms', 'ErrorFallback.tsx');
if (!existsSync(errorFallbackFile)) {
  errors.push(
    'Missing ErrorFallback.tsx in packages/ui/src/organisms/. Error boundary needs a fallback UI component.',
  );
}

if (errors.length > 0) {
  console.error('Error boundary validation FAILED:');
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(2);
} else {
  console.log('Error boundary validation passed.');
}
