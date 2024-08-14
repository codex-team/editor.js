import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
  },
  define: {
    'NODE_ENV': JSON.stringify('test'),
    'VERSION': JSON.stringify('test-version'),
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, './types'),
    },
  },
});
