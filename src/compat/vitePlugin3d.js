// Vite plugin that compiles the checkout page's inline 3D card script using the
// injected *runtime* compiler. @vitejs/plugin-vue still handles .vue SFCs; this
// plugin is a no-op fallback kept for build-time parity with a fully static tree.
module.exports = function vitePlugin3d() {
  return {
    name: 'vite-plugin-3d-card-runtime',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html;
    },
  };
};
