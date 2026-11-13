import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '/',
  server: {
    host: true,
    port: Number(process.env.VITE_PORT || 3003),
    allowedHosts: ['all'],
  },
  build: {
    outDir: resolve(resolve(__dirname, 'src'), '../dist'),
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@data': resolve(__dirname, 'src/data'),
      '@lib': resolve(__dirname, 'src/lib'),
    },
  },
});
