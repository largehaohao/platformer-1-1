import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    // The whole game is a handful of hand-written modules plus assets; no chunking needed.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  test: {
    include: ['src/**/*.test.ts', 'tools/**/*.test.ts'],
    // The sim core must not need a DOM. Keeping the node environment means any accidental
    // `document` usage on a test path fails loudly instead of silently passing. See ADR-0001.
    environment: 'node',
  },
});
