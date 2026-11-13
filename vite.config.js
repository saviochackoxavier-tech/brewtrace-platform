import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'src'),
  base: '/',
  server: {
    host: true,
    port: Number(process.env.VITE_PORT || 3003),
    allowedHosts: ['all'],
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    // Zero-config static output: a single HTML entry whose <script>/<link>
    // refs are relative, plus a SPA fallback rewrite for all non-file requests.
    assetsInlineLimit: 4096,
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
