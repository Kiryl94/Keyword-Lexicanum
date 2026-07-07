import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    environmentMatchGlobs: [['src/**/*.test.tsx', 'jsdom']],
  },
  resolve: {
    alias: {
      '@/data/wh40k-active-corpus.json': path.resolve(
        __dirname,
        'src/data/wh40k-core-corpus.sample.json',
      ),
      '@/data/starcraft-active-corpus.json': path.resolve(
        __dirname,
        'src/data/starcraft-core-corpus.sample.json',
      ),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
