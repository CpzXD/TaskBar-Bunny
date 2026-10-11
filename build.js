// build.js
// Fast bundle script using esbuild

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, 'src/renderer/dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  esbuild.buildSync({
    entryPoints: {
      app: path.join(__dirname, 'src/renderer/app.js'),
      wardrobe: path.join(__dirname, 'src/renderer/ui/wardrobe.js'),
      settings: path.join(__dirname, 'src/renderer/ui/settings.js')
    },
    bundle: true,
    outdir: distDir,
    platform: 'browser',
    target: ['chrome120'],
    minify: false,
    sourcemap: true
  });
  console.log('[build] Bundled renderer scripts successfully to src/renderer/dist/');
} catch (err) {
  console.error('[build] Build failed:', err);
  process.exit(1);
}
