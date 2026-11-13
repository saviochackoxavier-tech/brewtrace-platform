const fs = require('fs');
fs.writeFileSync('src/App.vue', '<template>\n  <Header />\n  <main class="app-main">\n    <RouterView />\n  </main>\n</template>\n\n<style scoped>\n.app-main {\n  flex: 1;\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2.5rem 1.5rem 4rem;\n}\n</style>\n');
