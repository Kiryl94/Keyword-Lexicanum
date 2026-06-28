import type { NextConfig } from 'next';

function corpusPath(envVar: string, fallback: string) {
  const configured = process.env[envVar];
  if (configured) {
    return configured.startsWith('.')
      ? configured
      : `./${configured.replace(/\\/g, '/')}`;
  }
  return fallback;
}

const wh40kCorpusPath = corpusPath(
  'WH40K_CORPUS_PATH',
  './src/data/wh40k-core-corpus.sample.json',
);
const starcraftCorpusPath = corpusPath(
  'STARCRAFT_CORPUS_PATH',
  './src/data/starcraft-core-corpus.sample.json',
);

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@/data/wh40k-active-corpus.json': wh40kCorpusPath,
      '@/data/starcraft-active-corpus.json': starcraftCorpusPath,
    },
  },
  webpack(config) {
    config.resolve.alias['@/data/wh40k-active-corpus.json'] = wh40kCorpusPath;
    config.resolve.alias['@/data/starcraft-active-corpus.json'] = starcraftCorpusPath;
    return config;
  },
};

export default nextConfig;
