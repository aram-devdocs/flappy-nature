import { defineConfig } from 'tsup';

const isWatch = process.argv.includes('--watch');

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: isWatch ? true : { resolve: ['@repo/engine', '@repo/hooks', '@repo/types', '@repo/ui'] },
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  ...(isWatch ? {} : { noExternal: ['@repo/engine', '@repo/hooks', '@repo/types', '@repo/ui'] }),
});
