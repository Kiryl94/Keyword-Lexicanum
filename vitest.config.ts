import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
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
